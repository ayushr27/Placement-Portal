import Header from "../components/Header";
import Footer from "../components/Footer";

const ForStudents = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          For Students
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Placement Guidelines
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Register with the placement cell at the beginning of the
                academic year
              </li>
              <li>
                Maintain a minimum CGPA of 6.5 to be eligible for placements
              </li>
              <li>
                Attend all pre-placement talks of companies you're interested in
              </li>
              <li>Submit your updated resume in the prescribed format</li>
              <li>Dress formally for all placement interactions</li>
              <li>Follow the placement calendar and deadlines strictly</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Preparation Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Technical Preparation
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Coding practice platforms</li>
                <li>Core subject materials</li>
                <li>Previous interview questions</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Aptitude Tests
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Quantitative aptitude</li>
                <li>Logical reasoning</li>
                <li>Verbal ability</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3 text-blue-700">
                Soft Skills
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Communication workshops</li>
                <li>Group discussion practice</li>
                <li>Interview etiquette</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Placement Calendar
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Placement Registration
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    July 15, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    July 30, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Resume Submission
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    August 1, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    August 15, 2023
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    Mock Interviews
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    August 20-25, 2023
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
