import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash, FiX } from "react-icons/fi";

// A simple modal component to wrap the add/delete forms
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent  flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
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

// Coordinator data structure
const initialCoordinators = [
  {
    id: 1,
    name: "Coordinator 1",
    email: "coordinator1@example.com",
    contact: "9876543210",
    image: "https://placehold.co/100x100/d1d5db/374151?text=C1",
  },
  {
    id: 2,
    name: "Coordinator 2",
    email: "coordinator2@example.com",
    contact: "9876543211",
    image: "https://placehold.co/100x100/d1d5db/374151?text=C2",
  },
  {
    id: 3,
    name: "Coordinator 3",
    email: "coordinator3@example.com",
    contact: "9876543212",
    image: "https://placehold.co/100x100/d1d5db/374151?text=C3",
  },
  {
    id: 4,
    name: "Coordinator 4",
    email: "coordinator4@example.com",
    contact: "9876543213",
    image: "https://placehold.co/100x100/d1d5db/374151?text=C4",
  },
  {
    id: 5,
    name: "Coordinator 5",
    email: "coordinator5@example.com",
    contact: "9876543214",
    image: "https://placehold.co/100x100/d1d5db/374151?text=C5",
  },
];

const ManageCoordinators = () => {
  // State for the list of coordinators
  const [coordinators, setCoordinators] = useState(initialCoordinators);

  // State for the modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coordinatorToDelete, setCoordinatorToDelete] = useState(null);

  // State for the form inputs
  const [newCoordinator, setNewCoordinator] = useState({
    name: "",
    email: "",
    contact: "",
    image: null,
  });

  // State for selected coordinators to delete
  const [selectedCoordinators, setSelectedCoordinators] = useState([]);

  // Handles adding a new coordinator
  const handleAddCoordinator = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newCoordinator.name ||
      !newCoordinator.email ||
      !newCoordinator.contact ||
      !newCoordinator.image
    ) {
      toast.error("Please fill out all fields and add an image.");
      return;
    }

    const id =
      coordinators.length > 0
        ? Math.max(...coordinators.map((c) => c.id)) + 1
        : 1;
    const newCoord = { ...newCoordinator, id };
    setCoordinators([...coordinators, newCoord]);
    setNewCoordinator({ name: "", email: "", contact: "", image: null });
    setShowAddModal(false);
    toast.success("Coordinator added successfully!");
  };

  // Handles image selection for the new coordinator
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCoordinator({ ...newCoordinator, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  // Handles confirming the deletion of a single coordinator
  const handleDeleteCoordinator = () => {
    setCoordinators(
      coordinators.filter((c) => c.id !== coordinatorToDelete.id)
    );
    setShowDeleteModal(false);
    setCoordinatorToDelete(null);
    toast.success("Coordinator removed.");
  };

  // Handles clicking the delete icon
  const openDeleteModal = (coordinator) => {
    setCoordinatorToDelete(coordinator);
    setShowDeleteModal(true);
  };

  // Handles selecting/deselecting a coordinator for batch deletion
  const toggleSelection = (id) => {
    setSelectedCoordinators((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((cId) => cId !== id)
        : [...prevSelected, id]
    );
  };

  // Handles deleting all selected coordinators
  const handleDeleteSelected = () => {
    if (selectedCoordinators.length === 0) {
      toast.info("No coordinators selected for deletion.");
      return;
    }

    // Using a confirmation modal instead of alert
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedCoordinators.length} coordinator(s)?`
      )
    ) {
      setCoordinators(
        coordinators.filter((c) => !selectedCoordinators.includes(c.id))
      );
      setSelectedCoordinators([]);
      toast.success(`${selectedCoordinators.length} coordinator(s) deleted.`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8 max-w-4xl mx-auto font-[Figtree]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Placement Coordinators
        </h2>
      </div>

      {/* Coordinator Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center mb-8">
        {coordinators.map((coord) => (
          <div key={coord.id} className="relative flex flex-col items-center">
            {/* Selection Checkbox */}
            <input
              type="checkbox"
              checked={selectedCoordinators.includes(coord.id)}
              onChange={() => toggleSelection(coord.id)}
              className="absolute top-0 right-0 z-10 w-5 h-5 cursor-pointer"
            />

            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
              <img
                src={coord.image}
                alt={coord.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => openDeleteModal(coord)}
                className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-red-500 rounded-full text-white p-1 hover:bg-red-600 transition-colors shadow-lg"
              >
                <FiTrash size={16} />
              </button>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-800">
                {coord.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedCoordinators.length === 0}
          className={`py-3 px-6 rounded-full font-medium transition-colors shadow-lg
            ${
              selectedCoordinators.length > 0
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
          Add Coordinator
        </button>
      </div>

      {/* Add Coordinator Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="text-2xl font-bold mb-4">Add New Coordinator</h3>
          <form onSubmit={handleAddCoordinator} className="space-y-4">
            {/* Image Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                {newCoordinator.image ? (
                  <img
                    src={newCoordinator.image}
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
                  Coordinator Image
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
                value={newCoordinator.name}
                onChange={(e) =>
                  setNewCoordinator({ ...newCoordinator, name: e.target.value })
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
                value={newCoordinator.email}
                onChange={(e) =>
                  setNewCoordinator({
                    ...newCoordinator,
                    email: e.target.value,
                  })
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
                value={newCoordinator.contact}
                onChange={(e) =>
                  setNewCoordinator({
                    ...newCoordinator,
                    contact: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
              >
                Add Coordinator
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && coordinatorToDelete && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <h3 className="text-2xl font-bold mb-4">Confirm Deletion</h3>
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{coordinatorToDelete.name}</span>?
          </p>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCoordinator}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageCoordinators;
