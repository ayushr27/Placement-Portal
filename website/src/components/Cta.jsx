import React from "react";

const Cta = () => {
  const cards = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Strong Alumni Network",
      desc: "Our Alumni have emerged successful and excelled in varied professions across the globe. This network is highly enriching for the growth of our community.",
      href: "https://alumni.iiitk.ac.in/home.dz",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: "National Rankings",
      desc: "Recognized as an Institution of National Importance, we strive for excellence. Our rankings reflect our commitment to quality education.",
      href: "https://www.careers360.com/university/indian-institute-of-information-technology-design-and-manufacturing-kurnool",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Rigorous Selection",
      desc: "All students enrolled at IIITDM Kurnool are selected after a rigorous screening process, ensuring we nurture India's most brilliant minds.",
      href: "https://iiitk.ac.in/Undergraduate/page",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Holistic Development",
      desc: "We offer numerous opportunities for multi-dimensional growth, preparing students for challenges in the competitive corporate world.",
      href: "https://iiitk.ac.in/About-IIITDM-Kurnool/page",
    },
  ];

  return (
    <div
      id="why-recruit"
      className="bg-gradient-to-br from-[#003d82] via-[#002855] to-[#003d82] text-white py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>

      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-16 mt-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-4 py-2 rounded-full mb-6">
          <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
          </svg>
          <span className="text-amber-100 text-sm font-semibold tracking-wide">
            For Recruiters
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Why Recruit from IIITDM Kurnool
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
        <p className="text-base sm:text-lg leading-relaxed text-gray-100">
          Established in 2015, as an institute of national importance, IIITDM
          Kurnool is recognized worldwide as a leader in the field of research
          and education in engineering and sciences. Our mission is to create an
          ambience in which new ideas and creativity flourish. The motto of
          IIITDM Kurnool is to provide learning blended with excellence, to
          create leaders of tomorrow.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
        {cards.map(({ icon, title, desc, href }, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl flex flex-col justify-between h-full hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group"
          >
            <div>
              <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
              <h3 className="text-xl font-bold mb-3 text-amber-300">{title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed">{desc}</p>
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-center bg-white text-[#003d82] font-semibold py-2.5 px-5 rounded-lg hover:bg-amber-400 hover:text-[#002855] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cta;
