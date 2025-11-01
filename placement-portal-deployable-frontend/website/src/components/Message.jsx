import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MessageSection = ({
  title,
  name,
  position,
  img,
  message,
  fullMessage,
  reverse,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {/* Section */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className={`relative flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-10 md:gap-20 py-20 px-6 md:px-16`}
      >
        {/* Image with Hover Glow */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="relative w-full md:w-1/2 flex justify-center"
        >
          <div className="absolute -inset-6 bg-gradient-to-r from-green-300/40 to-blue-300/40 blur-2xl rounded-full opacity-60 transition-all duration-500"></div>
          <img
            src={img}
            alt={name}
            className="relative rounded-2xl shadow-xl object-cover w-full max-w-md border border-gray-200"
          />
        </motion.div>

        {/* Text */}
        <div className="relative z-10 md:w-1/2 text-center md:text-left">
          <motion.h3
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-blue-700 text-lg uppercase font-semibold mb-3 tracking-widest"
          >
            {title}
          </motion.h3>

          <motion.h2
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-6"
          >
            {message}
          </motion.h2>

          <motion.button
            onClick={toggleModal}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-4 transition-all"
          >
            Read full message →
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-600 mt-6"
          >
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-sm">{position}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              {title} — Full Message
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
              {fullMessage}
            </p>
            <div className="text-right">
              <button
                onClick={toggleModal}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default function Message() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Background parallax blobs
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [100, -200]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [-50, 150]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-white text-gray-900"
    >
      {/* Parallax Gradient Blobs */}
      <motion.div
        className="absolute w-[800px] h-[800px] bg-gradient-to-r from-green-200/50 via-blue-200/40 to-cyan-200/40 rounded-full blur-3xl -z-10"
        style={{ top: "10%", left: "-20%", y: blob1Y }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] bg-gradient-to-l from-blue-200/40 via-teal-200/30 to-green-100/30 rounded-full blur-3xl -z-10"
        style={{ top: "60%", right: "-15%", y: blob2Y }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-cyan-100/30 via-green-100/20 to-blue-100/30 rounded-full blur-3xl -z-10"
        style={{ top: "40%", left: "40%", y: blob3Y }}
      />

      {/* Message Sections */}
      <div className="max-w-7xl mx-auto">
        <MessageSection
          title="Director's Message"
          name="Prof. Budaraju Srinivasa Murty"
          position="Department of Materials Science and Metallurgical Engineering"
          img="/murty-bs.jpg"
          message="We cordially invite esteemed organizations and corporations to engage with our talented, motivated, and innovative students."
          fullMessage={`Indian Institute of Information Technology Design and Manufacturing (IIITDM) Kurnool is the youngest among five centrally funded IIITDMs and was established as part of the Andhra Pradesh Reorganization Act in 2015–16.
Our institute is recognized as an Institution of National Importance by an Act of Parliament and offers several undergraduate, postgraduate, and doctoral programs focused on design and manufacturing.
With a serene 190-acre green campus, IIITDM Kurnool fosters interdisciplinary learning, innovation, and industry collaboration, producing responsible technocrats and leaders of tomorrow.`}
        />

        <MessageSection
          title="FIC's Message"
          name="Dr. Nittala Noel Anurag Prashanth"
          position="Assistant Professor, Department of Science, IIITDM Kurnool"
          img="/css.png"
          message="We are committed to fostering strong industry collaborations that drive growth, innovation, and meaningful opportunities."
          fullMessage={`At IIITDM Kurnool, we nurture agile professionals who merge technical depth with creative thinking.
Our graduates are equipped with strong analytical abilities, leadership qualities, and teamwork skills.
We invite recruiters to collaborate with us and access a pool of talent ready to contribute to innovation and growth across industries.`}
          reverse
        />

        <MessageSection
          title="DFIC's Message"
          name="Dr. Vijayakumar Devarakonda"
          position="Assistant Professor, Department of ECE"
          img="https://files.iiitk.ac.in/faculty/vijayakumar.jpg"
          message="Our graduates are engineers equipped with solid technical expertise and professional acumen to shape the industries of tomorrow."
          fullMessage={`IIITDM Kurnool’s programs are designed to empower students with interdisciplinary expertise, especially in Electronics, Mechanical, and Computer Engineering.
Through hands-on learning, advanced laboratories, and strong industry ties, our graduates emerge as innovators and changemakers capable of transforming ideas into impact.`}
        />
      </div>
    </div>
  );
}
