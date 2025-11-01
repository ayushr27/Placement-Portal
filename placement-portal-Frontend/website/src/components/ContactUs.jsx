import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // install lucide-react if not yet

const ContactUs = () => {
  return (
    <section
      id="contact"
      className="bg-[#f4f7ff] py-16 px-4 sm:px-8 lg:px-20"
    >
      <h2 className="text-3xl font-bold text-center text-[#31398A] mb-12">
        Contact Us
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Professor In Charge */}
        <div className="bg-white border border-[#e0e7ff] rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex-1 flex flex-col md:flex-row gap-6">
          <img
            src="/css.png"
            alt="Professor In Charge"
            className="w-28 h-32 object-cover rounded-lg border-2 border-[#31398A]"
          />
          <div>
            <h3 className="text-xl font-semibold text-[#31398A] mb-1">
              Professor In Charge
            </h3>
            <p className="font-medium text-gray-800">
              Dr. Nittala Noel Anurag Prashanth
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Department of Science
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#029309]" /> 
                <a href="#" className="hover:underline">
                  08518-289100 (Ext:239)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#029309]" />
                <a
                  href="mailto:noel@iiitk.ac.in"
                  className="hover:underline"
                >
                  noel@iiitk.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Office */}
        <div className="bg-white border border-[#e0e7ff] rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex-1">
          <h3 className="text-xl font-semibold text-[#31398A] mb-3">
            Placement Office
          </h3>
          <div className="text-sm text-gray-700 mb-4 flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-1 text-[#029309]" />
            <span>
              3rd floor, Academic Building,
              <br />
              IIITDM Kurnool, Kurnool - 518008, India
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#029309]" />
              <a href="tel:+919840936835" className="hover:underline">
                +91-9840936835
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#029309]" />
              <span>+91-9553151357</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#029309]" />
              <a
                href="mailto:placementcell@iiitk.ac.in"
                className="hover:underline"
              >
                placementcell@iiitk.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
