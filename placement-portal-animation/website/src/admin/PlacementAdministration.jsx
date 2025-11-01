import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiX } from "react-icons/fi";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <FiX size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const initialEmployees = [
  {
    id: 1,
    name: "Ravi Kumar",
    contact: "+91-9876543210",
    email: "ravi.admin@iiitk.ac.in",
    image: "https://placehold.co/100x100/d1d5db/374151?text=Ravi",
  },
  {
    id: 2,
    name: "Sita Sharma",
    contact: "+91-9876543211",
    email: "sita.admin@iiitk.ac.in",
    image: "https://placehold.co/100x100/d1d5db/374151?text=Sita",
  },
];

const PlacementAdministration = () => {
  // State for the list of administration employees
  const [employees, setEmployees] = useState(initialEmployees);
  // State for the modal
  const [showAddModal, setShowAddModal] = useState(false);
  // State for selected employees to delete
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  // State for the form inputs
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    contact: "",
    email: "",
    image: null,
  });

  // Handles adding a new employee
  const handleAddEmployee = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.contact ||
      !newEmployee.image
    ) {
      toast.error("Please fill out all fields and add an image.");
      return;
    }

    const id =
      employees.length > 0 ? Math.max(...employees.map((a) => a.id)) + 1 : 1;
    const newEmp = { ...newEmployee, id };
    setEmployees([...employees, newEmp]);
    setNewEmployee({ name: "", contact: "", email: "", image: null });
    setShowAddModal(false);
    toast.success("Employee added successfully!");
  };

  // Handles updating an employee's details
  const handleUpdateEmployee = (id) => {
    // This is where you'd implement the API call to update the employee
    console.log(`Updating employee with ID: ${id}`);
    toast.success("Employee details updated!");
  };

  // Handles removing a single employee
  const handleRemoveEmployee = (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter((a) => a.id !== id));
      toast.success("Employee removed.");
    }
  };

  // Handles image selection for the new employee
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEmployee({ ...newEmployee, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  // Handles selecting/deselecting an employee for batch deletion
  const toggleSelection = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((aId) => aId !== id)
        : [...prevSelected, id]
    );
  };

  // Handles deleting all selected employees
  const handleDeleteSelected = () => {
    if (selectedEmployees.length === 0) {
      toast.info("No employees selected for deletion.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedEmployees.length} employee(s)?`
      )
    ) {
      setEmployees(employees.filter((a) => !selectedEmployees.includes(a.id)));
      setSelectedEmployees([]);
      toast.success(`${selectedEmployees.length} employee(s) deleted.`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8 max-w-4xl mx-auto font-[Figtree]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Placement Administration Employees
        </h2>
      </div>

      {/* Employee List */}
      <div className="space-y-6 mb-8">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="relative p-6 border border-gray-200 rounded-xl flex items-center space-x-6"
          >
            <input
              type="checkbox"
              checked={selectedEmployees.includes(employee.id)}
              onChange={() => toggleSelection(employee.id)}
              className="absolute top-2 left-2 z-10 w-5 h-5 cursor-pointer"
            />
            {/* Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={employee.image}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Employee Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={employee.name}
                  onChange={(e) => {
                    const updatedEmployees = employees.map((a) =>
                      a.id === employee.id ? { ...a, name: e.target.value } : a
                    );
                    setEmployees(updatedEmployees);
                  }}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <button
                  onClick={() => handleUpdateEmployee(employee.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={employee.contact}
                  onChange={(e) => {
                    const updatedEmployees = employees.map((a) =>
                      a.id === employee.id
                        ? { ...a, contact: e.target.value }
                        : a
                    );
                    setEmployees(updatedEmployees);
                  }}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <button
                  onClick={() => handleUpdateEmployee(employee.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="relative col-span-1 sm:col-span-2">
                <input
                  type="email"
                  value={employee.email}
                  onChange={(e) => {
                    const updatedEmployees = employees.map((a) =>
                      a.id === employee.id ? { ...a, email: e.target.value } : a
                    );
                    setEmployees(updatedEmployees);
                  }}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <button
                  onClick={() => handleUpdateEmployee(employee.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleUpdateEmployee(employee.id)}
                className="py-2 px-4 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800"
              >
                Update
              </button>
              <button
                onClick={() => handleRemoveEmployee(employee.id)}
                className="py-2 px-4 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedEmployees.length === 0}
          className={`py-3 px-6 rounded-full font-medium transition-colors shadow-lg
            ${
              selectedEmployees.length > 0
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
        >
          Delete Selected
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="py-3 px-6 rounded-full bg-black text-white font-medium transition-colors hover:bg-gray-800 shadow-lg"
        >
          <FiPlus className="inline-block mr-2" />
          Add Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="text-2xl font-bold mb-4">Add New Employee</h3>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                {newEmployee.image ? (
                  <img
                    src={newEmployee.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500 text-center p-2">
                    Add Image
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee Image
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Click to upload or drag & drop
                </p>
              </div>
            </div>

            {/* Input fields */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Contact
              </label>
              <input
                type="tel"
                id="contact"
                value={newEmployee.contact}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, contact: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
              >
                Add Employee
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default PlacementAdministration;
