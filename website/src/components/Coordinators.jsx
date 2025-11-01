import React from 'react';
import { Mail, Phone } from 'lucide-react';
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
const PlacementCard = ({ name, role, phone, email }) => (
  <div className="bg-[#fefefe] border border-[#e0e7ff] shadow-sm rounded-xl p-5 hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <img
        src="/stt.jpg"
        alt={name}
        className="w-14 h-14 rounded-full object-cover border-2 border-[#31398A]"
      />
      <div>
        <h3 className="text-base font-semibold text-[#31398A]">{name}</h3>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
    <div className="mt-4 text-sm space-y-2 text-gray-600">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-[#029309]" />
        <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-[#029309]" />
        <a href={`mailto:${email}`} className="hover:underline break-all">{email}</a>
      </div>
    </div>
  </div>
);

const Coordinators = () => (
  <section className="bg-[#f4f7ff] px-4 py-12 md:px-10 lg:px-16">
    <h2 className="text-3xl font-bold text-center text-[#31398A] mb-10">Institute Placement Coordinators</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {placementManagers.map((manager, index) => (
        <PlacementCard key={index} {...manager} />
      ))}
    </div>
  </section>
);

export default Coordinators;