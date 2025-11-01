import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // install lucide-react if not yet

const ContactUs = () => {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-8 lg:px-20 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-[#003d82]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#003d82]/10 border border-[#003d82]/20 px-4 py-2 rounded-full mb-6">
            <svg className="w-4 h-4 text-[#003d82]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <span className="text-[#003d82] text-sm font-semibold tracking-wide">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003d82] mb-4">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Professor In Charge */}
          <div className="bg-white border-2 border-[#003d82]/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex-1 flex flex-col md:flex-row gap-6 group hover:border-[#003d82]/30">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="/css.png"
                  alt="Professor In Charge"
                  className="w-32 h-36 object-cover rounded-xl border-4 border-[#003d82]/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#003d82] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-block bg-[#003d82]/10 text-[#003d82] text-xs font-bold px-3 py-1 rounded-full mb-2">
                  Faculty In-Charge
                </span>
                <h3 className="text-2xl font-bold text-[#003d82] mb-1">
                  Dr. Nittala Noel Anurag Prashanth
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  Department of Science, IIITDM Kurnool
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-amber-600" />
                  </div>
                  <a href="tel:08518289100" className="text-gray-700 hover:text-[#003d82] font-medium">
                    08518-289100 (Ext: 239)
                  </a>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  <a
                    href="mailto:noel@iiitk.ac.in"
                    className="text-gray-700 hover:text-[#003d82] font-medium"
                  >
                    noel@iiitk.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Placement Office */}
          <div className="bg-gradient-to-br from-[#003d82] to-[#0056b3] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex-1 text-white">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3">
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-xs font-bold text-white">Office Location</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">
                Placement Office
              </h3>
              <div className="flex items-start gap-3 mb-6 text-gray-100">
                <MapPin className="w-5 h-5 mt-1 text-amber-300 flex-shrink-0" />
                <span className="text-sm leading-relaxed">
                  3rd Floor, Academic Building<br />
                  IIITDM Kurnool, Kurnool - 518008<br />
                  Andhra Pradesh, India
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#003d82]" />
                </div>
                <a href="tel:+919840936835" className="font-medium hover:text-amber-200">
                  +91-9840936835
                </a>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#003d82]" />
                </div>
                <span className="font-medium">+91-9553151357</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#003d82]" />
                </div>
                <a
                  href="mailto:placementcell@iiitk.ac.in"
                  className="font-medium hover:text-amber-200"
                >
                  placementcell@iiitk.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
