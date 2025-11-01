import React from "react";
import {
  BookOpen,
  Building2,
  School,
  FileText,
  FlaskConical,
} from "lucide-react";

const brochures = [
  { year: "2024–25", file: "/24re.pdf" },
  { year: "2023–24", file: "/23.pdf" },
  { year: "2022–23", file: "/22.pdf" },
  { year: "2021–22", file: "/21.pdf" },
];

const Card = ({ Icon, title, children, linkText, link }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{children}</p>
    {link && (
      <a
        href={link}
        className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline"
      >
        {linkText}
      </a>
    )}
  </div>
);

const Brochure = () => {
  return (
    <section id="overview" className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Overview</h2>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2/3 Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Card
              Icon={School}
              title="Academic Facilities"
              linkText="Learn more"
              link="#"
            >
              IIITDM Kurnool provides a flexible and research-driven academic
              environment. Students are encouraged to explore creative and
              practical learning opportunities.
            </Card>

            {/* Card 2 */}
            <Card
              Icon={Building2}
              title="Industrial Design Centre"
              linkText="Explore IDC"
              link="#"
            >
              IDC blends creative pedagogy with design innovation. It covers
              Industrial Design, Visual Communication, Interaction Design,
              Animation, and more.
            </Card>

            {/* Card 3 */}
            <Card
              Icon={BookOpen}
              title="Departments & Programs"
              linkText="Know more"
              link="#"
            >
              IIITDM Kurnool offers over 20 departments and 10 programs,
              fostering multi-disciplinary growth with state-of-the-art
              facilities and academic rigor.
            </Card>

            {/* Card 4 */}
            <Card
              Icon={FlaskConical}
              title="Research & Innovation"
              linkText="Explore Research"
              link="#"
            >
              The institute actively supports innovation, startups, and
              cutting-edge research through dedicated labs, collaborations, and
              interdisciplinary initiatives.
            </Card>
          </div>

          {/* Brochure Downloads */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Placement Brochures
            </h3>
            <ul className="space-y-3 text-sm">
              {brochures.map(({ year, file }) => (
                <li key={year}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-700 hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download {year}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brochure;
