import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Integrate your API or email service here
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="bg-[#f4f7ff] py-20 px-4 sm:px-8 lg:px-20 relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-[#31398A] mb-16">Contact Us</h2>

      {/* Floating gradient blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-gradient-to-br from-green-200/40 via-blue-200/40 to-cyan-200/40 rounded-full blur-3xl -z-10 top-10 left-[-10%]"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-green-300/40 via-blue-300/40 to-cyan-300/40 rounded-full blur-3xl -z-10 top-[60%] right-[-15%]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Cards */}
        <div className="flex flex-col gap-8">
          {/* Professor In Charge */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-[#e0e7ff] rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 transition-all"
          >
            <img
              src="/css.png"
              alt="Professor In Charge"
              className="w-28 h-32 object-cover rounded-lg border-2 border-[#31398A]"
            />
            <div>
              <h3 className="text-xl font-semibold text-[#31398A] mb-1">Professor In Charge</h3>
              <p className="font-medium text-gray-800">Dr. Nittala Noel Anurag Prashanth</p>
              <p className="text-sm text-gray-500 mb-4">Department of Science</p>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#029309]" />
                  <a href="#" className="hover:underline">08518-289100 (Ext:239)</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#029309]" />
                  <a href="mailto:noel@iiitk.ac.in" className="hover:underline">noel@iiitk.ac.in</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Placement Office */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-[#e0e7ff] rounded-xl shadow-sm p-6 transition-all"
          >
            <h3 className="text-xl font-semibold text-[#31398A] mb-3">Placement Office</h3>
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
                <a href="tel:+919840936835" className="hover:underline">+91-9840936835</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#029309]" />
                <span>+91-9553151357</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#029309]" />
                <a href="mailto:placementcell@iiitk.ac.in" className="hover:underline">
                  placementcell@iiitk.ac.in
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-[#31398A] mb-6 text-center">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="peer w-full border-b-2 border-gray-300 focus:border-green-500 outline-none py-2 placeholder-transparent transition-all"
                placeholder="Your Name"
              />
              <label className="absolute left-0 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-green-500 peer-focus:text-sm">
                Your Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 placeholder-transparent transition-all"
                placeholder="Your Email"
              />
              <label className="absolute left-0 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-blue-500 peer-focus:text-sm">
                Your Email
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="peer w-full border-b-2 border-gray-300 focus:border-green-400 outline-none py-2 placeholder-transparent resize-none transition-all"
                placeholder="Your Message"
              />
              <label className="absolute left-0 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-green-500 peer-focus:text-sm">
                Your Message
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Send Message
            </motion.button>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-green-600 font-semibold mt-2"
              >
                Your message has been sent!
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs;
