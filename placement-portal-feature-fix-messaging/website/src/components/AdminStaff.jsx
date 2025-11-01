import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Building2, Sparkles } from 'lucide-react';

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

const StaffCard = ({ name, role, phone, email, index }) => (
  <motion.div 
    className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
    whileHover={{ 
      y: -5,
      transition: { duration: 0.3 }
    }}
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#31398A] to-[#029309] p-0.5">
        <img
          src="/adm.png"
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-[#31398A] mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{role}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#029309]" />
            <a href={`tel:${phone}`} className="text-sm text-gray-700 hover:text-[#31398A] transition-colors">
              {phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#029309]" />
            <a href={`mailto:${email}`} className="text-sm text-gray-700 hover:text-[#31398A] transition-colors break-all">
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminStaff = () => (
  <section className="bg-[#f4f7ff] px-4 py-16 md:px-10 lg:px-16">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#31398A] mb-4">Administration</h2>
        <div className="w-16 h-0.5 bg-[#029309] mx-auto"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {administrativeStaff.map((staff, index) => (
          <StaffCard key={index} {...staff} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default AdminStaff;
