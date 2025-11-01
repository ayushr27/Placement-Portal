import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Placement Office
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <address className="not-italic text-gray-700 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Dr. XYZ ABC</h3>
                  <p>Placement Officer</p>
                  <p>IIITDM Kurnool</p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Address:</span> IIITDM
                    Kurnool Campus, Yerramukkapalli Village, Kurnool, Andhra
                    Pradesh - 518008
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    placement@iiitk.ac.in
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> +91 8519 235
                    678
                  </p>
                </div>
              </address>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Send Us a Message
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Location Map
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Map of IIITDM Kurnool Campus</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
