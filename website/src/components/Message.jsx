import { useState } from "react";
import React from "react";

const Message = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div
        id="directors-message"
        className="flex flex-col md:flex-row gap-10 bg-gray-50 py-12 px-4 sm:px-6 md:px-10 items-center w-full"
      >
        {/* Left side: Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src="/murty-bs.jpg"
            alt="Prof. Budaraju Srinivasa Murty"
            className="rounded-xl shadow-lg object-cover max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>

        {/* Right side: Text content */}
        <div className="text-justify md:w-2/3 w-full">
          <p className="text-blue-600 uppercase text-lg font-semibold mb-2">
            Director's Message
          </p>
          <h2 className="text-2xl text-justify sm:text-3xl font-semibold text-[#607d8b] mb-4">
            We cordially invite esteemed organizations
            and corporations to visit our campus and
            engage with our talented, motivated, and
            innovative students. We also welcome your
            valuable suggestions to further enhance
            and strengthen our initiatives. ...
          </h2>

          <button
            onClick={toggleModal}
            className="text-blue-600 hover:underline font-semibold"
          >
            Read more &nbsp;&raquo;
          </button>

          <div className="mt-6">
            <p className="font-bold text-gray-700 text-lg">
              Prof. Budaraju Srinivasa Murty
            </p>
            <p className="text-sm text-gray-500">
              Materials Science And Metallurgical Engineering
            </p>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">
            <div className="bg-white rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">
                Director's Full Message
              </h2>
              <p className="text-gray-700 text-left text-sm sm:text-base mb-6">
                Indian Institute of Information Technology Design and Manufacturing (IIITDM) Kurnool is the youngest among five centrally funded
                IIITDMs and established as part of Andhra Pradesh reorganization act in the academic year 2015-16 at the historical city of Kurnool in
                Rayalaseema region.
                Our Institute is recognized as an Institution of National Importance by an act of Parliament. The institute has a permanent campus at
                Jagannatha Gattu, Dinnedevarapadu, Kurnool. The institute offers four undergraduate programmes, namely, Computer Science and
                Engineering, Artificial Intelligence and Data Science, Electronics and Communication Engineering and Mechanical Engineering, with a
                total annual intake of 330 students, three MTech Programmes, namely, Data Analytics and Decision Sciences, Electronic System
                Design and Smart manufacturing, with an annual intake of 45 students, and PhD programmes.
                Our campus is located at one of the most scenic locations of Kurnool in a vast 190 acres of land, making it a best and pleasant place for
                young and aspiring students. Being adjacent to Nandyal – Kadapa highway, the institute is well connected to all parts of the country.
                All the faculty are highly qualified with Ph.D. degrees from reputed institutes across India and outside India.
                The Institute's goal is to provide aesthetically pleasing, environment-friendly green campus facilities to enhance the learning, teaching
                and interdisciplinary research activities. The Institute has organized various Techno-Cultural activities to enhance the practical learning
                and Industry Exposure of the students.
                I am sure that our students and faculty will carry the flagship of IIITDM Kurnool to greater heights by applying their knowledge in an
                interdisciplinary manner to provide solutions for various industrial, societal and research and development projects and will stand as
                responsible and dedicated technocrats in the process of nation building.
                I wish my students all the best in all their endeavors.
                Jai Hind
              </p>
              <div className="text-right">
                <button
                  onClick={toggleModal}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        id="fic-message"
        className="flex flex-col md:flex-row gap-10 bg-gray-50 py-12 px-4 sm:px-6 md:px-10 items-center w-full"
      >
        {/* Right side: Text content */}
        <div className="text-justify md:w-2/3 w-full">
          <p className="text-blue-600 uppercase text-lg font-semibold mb-2">
            FIC's Message
          </p>
          <h2 className="text-2xl text-justify sm:text-3xl font-semibold text-[#607d8b] mb-4">
            It is a pleasure to welcome you
            to the Training and Placement
            Cell of IIITDM Kurnool. We
            are committed to fostering
            strong industry collaborations
            and presenting a pool of
            talented engineers who are
            ready to drive innovation and
            growth in your organization
            "Connecting Talent with
            Industry" ...
          </h2>

          <button
            onClick={toggleModal}
            className="text-blue-600 hover:underline font-semibold"
          >
            Read more &nbsp;&raquo;
          </button>

          <div className="mt-6">
            <p className="font-bold text-gray-700 text-lg">
              Dr. Nittala Noel Anurag Prashanth
            </p>
            <p className="text-sm text-gray-500">
              Assitant Professor(Department of Science,IIITDM Kurnool)
            </p>
          </div>
        </div>
        {/* Left side: Image */}
        <div className="md:w-1/5 flex justify-center">
          <img
            src="/css.png"
            alt="Dr. Nittala Noel Anurag Prashanth"
            className="w-full h-full rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">
            <div className="bg-white rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">FIC's Full Message</h2>
              <p className="text-gray-700 text-left text-sm sm:text-base mb-6">
                Driving Innovation: IIITDM Kurnool’s 2026 Graduates – Prepared to
                Lead
                In today’s fast-evolving technology landscape, organizations seek
                professionals who combine strong technical expertise with agility
                and innovation. At IIITDM Kurnool, we nurture such talent.
                Our academic ecosystem blends rigorous technical education with
                real-world learning, ensuring our students graduate as wellrounded, industry-ready professionals.
                Key Strengths of Our Graduates:
                Technical Excellence:
                A robust, industry-aligned curriculum builds deep expertise in core
                and emerging technologies.
                Holistic Development:
                Students cultivate essential soft skills—leadership, communication,
                and teamwork—preparing them to thrive in collaborative
                environments.
                Agility & Critical Thinking:
                Hands-on projects, case-based learning, and innovation-driven
                activities foster adaptability and sharp analytical thinking.
                Industry Integration:
                Strategic partnerships with leading companies provide students
                with practical exposure through internships, live projects, and
                industry- led modules.
                Proven Track Record:
                Our graduates consistently secure placements in premier
                organizations, validating the effectiveness of our academic model
                and our emphasis on continuous industry engagement.
                Invitation to Recruiters:
                We invite esteemed organizations to partner with IIITDM Kurnool
                and explore a pool of future-ready engineers capable of driving
                innovation and growth. Together, let’s shape the future of
                technology and industry.
                Get in Touch:
                We look forward to collaborating with you.
              </p>
              <div className="text-right">
                <button
                  onClick={toggleModal}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        id="dfic-message"
        className="flex flex-col md:flex-row gap-10 bg-gray-50 py-12 px-4 sm:px-6 md:px-10 items-center w-full"
      >
        {/* Left side: Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src="https://files.iiitk.ac.in/faculty/vijayakumar.jpg"
            alt="Dr. Vijayakumar Devarakonda"
            className="rounded-xl shadow-lg object-cover max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>

        {/* Right side: Text content */}
        <div className="text-justify md:w-2/3 w-full">
          <p className="text-blue-600 uppercase text-lg font-semibold mb-2">
            DFIC's Message
          </p>
          <h2 className="text-2xl text-justify sm:text-3xl font-semibold text-[#607d8b] mb-4">
            We are proud to present the
            graduates of IIITDM Kurnool
            —engineers equipped with
            solid technical expertise and
            professional skills. We look
            forward to connecting you
            with our students and
            supporting your recruitment
            needs
            "Partnering with Industry
            to Drive Innovation"...
          </h2>

          <button
            onClick={toggleModal}
            className="text-blue-600 hover:underline font-semibold"
          >
            Read more &nbsp;&raquo;
          </button>

          <div className="mt-6">
            <p className="font-bold text-gray-700 text-lg">
              Dr. Vijayakumar Devarakonda
            </p>
            <p className="text-sm text-gray-500">
          Assistant Professor (Department of Electronics and Communication Engineering)
            </p>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">
            <div className="bg-white rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">DFIC's Full Message</h2>
              <p className="text-gray-700 text-left text-sm sm:text-base mb-6">
Engineering the Future: IIITDM Kurnool’s Class of 2026 – Fueling
Innovation, Driving Core Excellence
As industries advance toward smart manufacturing, embedded
intelligence, and sustainable technologies, the demand for engineers with
strong core expertise is growing. IIITDM Kurnool is committed to
developing engineers who are technically sound, hands-on, and
innovation-driven— with a focus on Electronics and Mechanical
Engineering, the pillars of industrial progress.
Core Disciplines – Real-World Impact:
Electronics & Communication Engineering (ECE):
Trained in VLSI, Embedded Systems, Signal Processing, Wireless
Communications and other allied areas, ECE graduates are prepared for
roles in Semiconductors, IoT, Telecom, and Electronics R&D.
Mechanical Engineering (ME):
With expertise in CAD/CAM, Robotics, Automation, and Sustainable
Design, ME graduates drive innovation across Aerospace,
Manufacturing, and Green technologies.
Cross-Disciplinary Strength:
Computer Science & Engineering (CSE):
Proficient in system architecture, software engineering, and algorithms,
CSE graduates enable seamless integration of hardware and software.
AI & Data Science (AI&DS):
Specializing in Machine Learning and Intelligent Automation, AI&DS
graduates enhance predictive analytics and smart systems across
domains.
What Sets IIITDM Kurnool Apart:
Project-Based Learning: Hands-on, interdisciplinary projects from
early semesters.
Advanced Labs: Cutting-edge facilities that simulate industry
environments.
Industry Integration: Strong ties with companies ensure curriculum
relevance.
Professional Readiness: Focus on communication, teamwork, and
leadership skills.
Partner With Us – Empower Your Engineering Edge:
At IIITDM Kurnool, we nurture engineers who combine deep technical
knowledge with digital agility.
We invite you to partner with us and access top talent ready to drive
innovation in your organization.
              </p>
              <div className="text-right">
                <button
                  onClick={toggleModal}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Message;
