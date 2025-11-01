import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, GraduationCap, Sparkles } from 'lucide-react';
const placementManagers = [
  {
    name: 'Deepak Kumar',
    role: 'Electronics & Communication Engineering',
    phone: '+91-6201901436',
    email: '121ec0045@iiitk.ac.in',
  },
  {
    name: 'Devesh Kumar Arya',
    role: 'Computer Science & Engineering',
    phone: '+91-6395565236',
    email: '121cs0028@iiitk.ac.in',
  },
  {
    name: 'Madhav Sharma',
    role: 'Artificial Intelligence & Data Science',
    phone: '+91-9910028554',
    email: '121ad0013@iiitk.ac.in',
  },
  {
    name: 'Lavish Singh',
    role: 'Computer Science & Engineering',
    phone: '+91-9340466934',
    email: '121cs0067@iiitk.ac.in',
  },
  {
    name: 'Chirag Bhise',
    role: 'Computer Science & Engineering',
    phone: '+91-9820532410',
    email: '121cs0010@iiitk.ac.in',
  },
  {
    name: 'Vivek Kumar',
    role: 'Artificial Intelligence & Data Science',
    phone: '+91-7667966536',
    email: '121ad0024@iiitk.ac.in',
  },
  {
    name: 'Shubham Gehlot',
    role: 'Electronics & Communication Engineering',
    phone: '+91-9784198405',
    email: '121ec0039@iiitk.ac.in',
  },
  {
    name: 'Vindya Vahini',
    role: 'Electronics & Communication Engineering',
    phone: '+91-9493259826',
    email: '121ec0036@iiitk.ac.in',
  },
  {
    name: 'Priyash Anand',
    role: 'Electronics & Communication Engineering',
    phone: '+91-6204614898',
    email: '121ec0006@iiitk.ac.in',
  },
  {
    name: 'Nitin Kanaujia',
    role: 'Mechanical Engineering',
    phone: '+91-7276242338',
    email: '121me0014@iiitk.ac.in',
  },
];
const PlacementCard = ({ name, role, phone, email, index }) => (
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
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#31398A] to-[#029309] p-0.5">
        <img
          src="/stt.jpg"
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

const Coordinators = () => (
  <section className="bg-[#f4f7ff] px-4 py-16 md:px-10 lg:px-16">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#31398A] mb-4">Institute Placement Coordinators</h2>
        <div className="w-16 h-0.5 bg-[#029309] mx-auto"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {placementManagers.map((manager, index) => (
          <PlacementCard key={index} {...manager} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default Coordinators;