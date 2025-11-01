import React from "react";

const Cta = () => {
  return (
    <div
      id="why-recruit"
      className="bg-blue-950 text-white py-12 px-4 sm:px-6 md:px-10 "
    >
      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-12 mt-12 ">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Why Recruit</h1>
        <p className="text-sm text-justify sm:text-base leading-relaxed">
          Established in 2015, as an institute of national importance, IIITDM
          Kurnool is recognized worldwide as a leader in the field of research
          and education in engineering and sciences. Our mission is to create an
          ambience in which new ideas and creativity flourish. The motto of
          IIITDM Kurnool is to provide learning blended with excellence, to
          create leaders of tomorrow. The dynamic and constantly evolving
          academic program reflects the institute's commitment to stay in tune
          with the expanding frontiers of knowledge worldwide. Extracurricular
          activities are also treated with equal importance towards overall
          development making the students at IIITDM Kurnool fit to take on the
          challenges faced in the competitive corporate world. Backed by the
          support of Alumni in different sectors and guidance of esteemed
          professors, we strive to offer a highly nurturing environment to all
          its students.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {/* Card Template */}
        {[
          {
            icon: "🔗",
            title: "Alumni",
            desc: "Our Alumni have emerged successful and excelled in varied professions across the globe. This network is highly enriching for the growth of our community.",
          },
          {
            icon: "⭐",
            title: "Rankings",
            desc: "Recognized as India’s No. 1 University, we strive for excellence. Our rankings reflect our steep progress.",
          },
          {
            icon: "🎓",
            title: "Admission Process",
            desc: "All the students enrolled at IIITDM Kurnool are selected after a rigorous screening process. It ensures that we nurture India's most brilliant minds.",
          },
          {
            icon: "🌱",
            title: "All Round Development",
            desc: "One's skills, aptitude, and perception reflect the personality of an individual. We offer numerous opportunities for multi-dimensional growth.",
          },
        ].map(({ icon, title, desc }, idx) => (
          <div
            key={idx}
            className="bg-blue-800 p-6 rounded-lg flex flex-col justify-between h-full text-center"
          >
            <div>
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm">{desc}</p>
            </div>
            <button className="mt-6 bg-white text-blue-900 font-bold py-2 px-4 rounded hover:bg-gray-200 transition">
              Know more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cta;
