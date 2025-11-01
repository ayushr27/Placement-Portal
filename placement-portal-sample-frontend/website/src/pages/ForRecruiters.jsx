import Header from "../components/Header";
import Footer from "../components/Footer";

const ForRecruiters = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          For Recruiters
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Why Recruit from IIITDM Kurnool?
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Highly skilled students with strong technical foundation</li>
              <li>Focus on design and manufacturing along with IT education</li>
              <li>Interdisciplinary approach to problem solving</li>
              <li>Excellent track record of placements with top companies</li>
              <li>Strong industry-academia collaboration</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recruitment Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Step 1: Registration
              </h3>
              <p className="text-gray-700">
                Companies register with the placement cell by providing job
                details, eligibility criteria, and selection process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Step 2: Pre-Placement Talk
              </h3>
              <p className="text-gray-700">
                Conduct a session to introduce your company to students and
                generate interest.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Step 3: Selection Process
              </h3>
              <p className="text-gray-700">
                Conduct tests, interviews, or any other selection process as per
                your requirements.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Placement Brochure
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <p className="text-gray-700 mb-4">
                Download our placement brochure to learn more about our
                programs, student profiles, and placement statistics.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Download Brochure (PDF)
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-gray-100 w-32 h-40 flex items-center justify-center text-gray-500">
                Brochure Preview
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForRecruiters;
