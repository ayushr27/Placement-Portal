import React from 'react';

const administrativeStaff = [
  {
    name: 'P. Chaithanya Deepak',
    role: 'Assist. Placement Officer',
    phone: '+91-9553151357',
    email: 'placementcell@iiitk.ac.in',
  },
  {
    name: 'Ravi Kumar',
    role: 'Office Admin',
    phone: '+91-9876543210',
    email: 'ravi.admin@iiitk.ac.in',
  },
];

const StaffCard = ({ name, role, phone, email }) => (
  <div className="bg-white shadow-md p-6 rounded-lg flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full">
    <div className="w-24 h-24 bg-gray-200 flex-shrink-0 rounded-full overflow-hidden">
      <img src="/adm.png" alt={name} className="object-cover w-full h-full" />
    </div>
    <div className="text-center sm:text-left">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
      <div className="text-gray-500 mt-2 text-sm space-y-1">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className="material-icons text-base">phone</span>
          <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
        </div>
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className="material-icons text-base">email</span>
          <a href={`mailto:${email}`} className="hover:underline break-all">{email}</a>
        </div>
      </div>
    </div>
  </div>
);

const AdminStaff = () => (
  <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-12">
    <h1 className="text-3xl font-bold text-center mb-10">Administration</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {administrativeStaff.map((staff, index) => (
        <StaffCard
          key={index}
          name={staff.name}
          role={staff.role}
          phone={staff.phone}
          email={staff.email}
        />
      ))}
    </div>
  </div>
);

export default AdminStaff;
