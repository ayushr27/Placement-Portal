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
            Indian Institute of Information Technology Design and Manufacturing
            Kurnool is the youngest among five centrally funded IIITDMs and
            established as part of Andhra Pradesh reorganization ...
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
                Indian Institute of Information Technology Design and
                Manufacturing (IIITDM) Kurnool is the youngest among five
                centrally funded IIITDMs and established as part of Andhra
                Pradesh reorganization act in the academic year 2015-16 at the
                historical city of Kurnool in Rayalaseema region. <br />
                Our Institute is recognized as an Institution of National
                Importance by an act of Parliament. The institute has a
                permanent campus at Jagannatha Gattu, Dinnedevarapadu, Kurnool.
                The institute offers four undergraduate programmes, namely,
                Computer Science and Engineering, Artificial Intelligence and
                Data Science, Electronics and Communication Engineering and
                Mechanical Engineering, with a total annual intake of 240
                students, three MTech Programmes, namely, Data Analytics and
                Decision Sciences, Electronic System Design and Smart
                manufacturing, with an annual intake of 45 students, and PhD
                programmes. <br />
                Our campus is located at one of the most scenic locations of
                Kurnool in a vast 190 acres of land, making it a best and
                pleasant place for young and aspiring students. Being adjacent
                to Nandyal – Kadapa highway, the institute is well connected to
                all parts of the country. <br />
                All the faculty are highly qualified with PhD degrees from
                reputed institutes across India and outside India. The
                Institute's goal is to provide aesthetically pleasing,
                environment-friendly green campus facilities to enhance the
                learning, teaching and interdisciplinary research activities.
                The Institute has organized various Techno-Cultural activities
                to enhance the practical learning and Industry Exposure of the
                students. I am sure that our students and faculty will carry the
                flagship of IIITDM Kurnool to greater heights by applying their
                knowledge in an interdisciplinary manner to provide solutions
                for various industrial, societal and research and development
                projects and will stand as responsible and dedicated technocrats
                in the process of nation building. <br /> <br />
                I wish my students all the best in all their endeavors. <br />
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
            It is a pleasure to welcome you to the Training and Placement Cell
            of IIITDM Kurnool. We are committed to fostering strong industry
            collaborations and presenting a pool of talented engineers who are
            ready to drive innovation and growth in your
            organization."Connecting Talent with Industry" ...
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
              Materials Science And Metallurgical Engineering
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
                Driving Innovation: IIITDM Kurnool’s 2026 Graduates – Prepared
                to Lead In today’s fast-evolving technology landscape,
                organizations seek professionals who combine strong technical
                expertise with agility and innovation. At IIITDM Kurnool, we
                nurture such talent. Our academic ecosystem blends rigorous
                technical education with real-world learning, ensuring our
                students graduate as well rounded, industry-ready professionals.
                Key Strengths of Our Graduates: Technical Excellence: A robust,
                industry-aligned curriculum builds deep expertise in core and
                emerging technologies. Holistic Development: Students cultivate
                essential soft skills—leadership, communication, and
                teamwork—preparing them to thrive in collaborative environments.
                Agility & Critical Thinking: Hands-on projects, case-based
                learning, and innovation-driven activities foster adaptability
                and sharp analytical thinking. Industry Integration: Strategic
                partnerships with leading companies provide students with
                practical exposure through internships, live projects, and
                industry- led modules. Proven Track Record: Our graduates
                consistently secure placements in premier organizations,
                validating the effectiveness of our academic model and our
                emphasis on continuous industry engagement. Invitation to
                Recruiters: We invite esteemed organizations to partner with
                IIITDM Kurnool and explore a pool of future-ready engineers
                capable of driving innovation and growth. Together, let’s shape
                the future of technology and industry. Get in Touch: 4 We look
                forward to collaborating with you. Jai Hind
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
            src="/murty-bs.jpg"
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
            We are proud to present the graduates of IIITDM Kurnool —engineers
            equipped with solid technical expertise and professional skills. We
            look forward to connecting you with our students and supporting your
            recruitment needs ...
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
              Materials Science And Metallurgical Engineering
            </p>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">
            <div className="bg-white rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">DFIC's Full Message</h2>
              <p className="text-gray-700 text-left text-sm sm:text-base mb-6">
                Indian Institute of Information Technology Design and
                Manufacturing (IIITDM) Kurnool is the youngest among five
                centrally funded IIITDMs and established as part of Andhra
                Pradesh reorganization act in the academic year 2015-16 at the
                historical city of Kurnool in Rayalaseema region. <br />
                Our Institute is recognized as an Institution of National
                Importance by an act of Parliament. The institute has a
                permanent campus at Jagannatha Gattu, Dinnedevarapadu, Kurnool.
                The institute offers four undergraduate programmes, namely,
                Computer Science and Engineering, Artificial Intelligence and
                Data Science, Electronics and Communication Engineering and
                Mechanical Engineering, with a total annual intake of 240
                students, three MTech Programmes, namely, Data Analytics and
                Decision Sciences, Electronic System Design and Smart
                manufacturing, with an annual intake of 45 students, and PhD
                programmes. <br />
                Our campus is located at one of the most scenic locations of
                Kurnool in a vast 190 acres of land, making it a best and
                pleasant place for young and aspiring students. Being adjacent
                to Nandyal – Kadapa highway, the institute is well connected to
                all parts of the country. <br />
                All the faculty are highly qualified with PhD degrees from
                reputed institutes across India and outside India. The
                Institute's goal is to provide aesthetically pleasing,
                environment-friendly green campus facilities to enhance the
                learning, teaching and interdisciplinary research activities.
                The Institute has organized various Techno-Cultural activities
                to enhance the practical learning and Industry Exposure of the
                students. I am sure that our students and faculty will carry the
                flagship of IIITDM Kurnool to greater heights by applying their
                knowledge in an interdisciplinary manner to provide solutions
                for various industrial, societal and research and development
                projects and will stand as responsible and dedicated technocrats
                in the process of nation building. <br /> <br />
                I wish my students all the best in all their endeavors. <br />
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
    </>
  );
};

export default Message;
