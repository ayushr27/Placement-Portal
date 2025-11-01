import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Cta = () => {
  const cards = [
    {
      icon: "🔗",
      title: "Alumni",
      desc: "Our alumni have excelled globally across diverse professions, forming a powerful network that enriches our community.",
      href: "https://alumni.iiitk.ac.in/home.dz",
    },
    {
      icon: "⭐",
      title: "Rankings",
      desc: "AAAA-rated by Careers360 — a mark of distinction recognizing our pursuit of excellence and holistic development.",
      href: "https://www.careers360.com/university/indian-institute-of-information-technology-design-and-manufacturing-kurnool",
    },
    {
      icon: "🎓",
      title: "Admission Process",
      desc: "Our students are selected through a rigorous screening process, ensuring that IIITDM Kurnool nurtures India’s brightest minds.",
      href: "https://iiitk.ac.in/Undergraduate/page",
    },
    {
      icon: "🌱",
      title: "All Round Development",
      desc: "We emphasize skill, aptitude, and perception to foster multi-dimensional growth and leadership qualities among our students.",
      href: "https://iiitk.ac.in/About-IIITDM-Kurnool/page",
    },
  ];

  // Track scroll position
  const { scrollYProgress } = useScroll();

  // Parallax transforms for background blobs
  const topBlobY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const topBlobX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bottomBlobY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const bottomBlobX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const gradientShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 80,
      },
    }),
  };

  return (
    <section
      id="why-recruit"
      className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white py-20 px-6 sm:px-10 md:px-16"
    >
      {/* Parallax Background Blobs */}
      <motion.div
        style={{
          translateY: topBlobY,
          translateX: topBlobX,
          background: "radial-gradient(circle at center, rgba(30, 64, 175, 0.4), transparent 70%)",
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[180px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{
          translateY: bottomBlobY,
          translateX: bottomBlobX,
          background: "radial-gradient(circle at center, rgba(163, 230, 53, 0.25), transparent 70%)",
        }}
        className="absolute bottom-0 right-0 w-[650px] h-[650px] blur-[160px] rounded-full pointer-events-none"
      />

      {/* Animated gradient overlay */}
      <motion.div
        style={{
          background: `linear-gradient(180deg, rgba(23,37,84,0.6) ${gradientShift}, rgba(30,64,175,0.3))`,
        }}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      {/* Header */}
      <motion.div
        className="relative max-w-5xl mx-auto text-center mb-20 z-10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-lime-500 mb-6">
          Why Recruit
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-gray-200 text-justify">
          Established in 2015 as an institute of national importance, IIITDM
          Kurnool stands as a symbol of innovation and excellence in engineering
          and sciences. With a mission to foster creativity and learning blended
          with excellence, we continuously evolve to stay aligned with global
          advancements. Through academics, research, and extracurricular
          development, IIITDM Kurnool nurtures individuals ready to excel in a
          competitive world.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto relative z-10">
        {cards.map(({ icon, title, desc, href }, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="group bg-blue-900/40 backdrop-blur-lg border border-blue-800 hover:border-lime-500 transition-all duration-300 p-8 rounded-2xl flex flex-col justify-between h-full text-center shadow-md"
          >
            <motion.div
              className="text-5xl mb-5"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{
                scale: 1,
                opacity: 1,
                transition: { delay: i * 0.25, duration: 0.5 },
              }}
              viewport={{ once: true }}
            >
              {icon}
            </motion.div>

            <h3 className="text-xl font-semibold mb-3 text-lime-500">
              {title}
            </h3>
            <p className="text-sm text-gray-200 mb-6">{desc}</p>

            <motion.a
              href={href}
              target="blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.4 },
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-blue-900 font-semibold py-2 px-6 rounded-full hover:bg-lime-500 hover:text-blue-950 transition-all duration-300 shadow-md"
            >
              Know more →
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Cta;
