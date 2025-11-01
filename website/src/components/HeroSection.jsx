const HeroSection = () => {
  return (
    <section className="relative bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Placement Cell
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            IIITDM Kurnool
          </h2>
          <p className="text-lg mb-8">
            Bridging the gap between talented students and leading organizations
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              For Students
            </button>
            <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition duration-300">
              For Recruiters
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/assets/images/placement-hero.png"
            alt="Placement Cell"
            className="max-w-md w-full rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
