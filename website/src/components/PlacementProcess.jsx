const PlacementProcess = () => {
  const steps = [
    {
      title: "Registration",
      description:
        "Companies register with the placement cell by providing necessary details",
    },
    {
      title: "Pre-Placement Talk",
      description:
        "Company representatives visit campus to present opportunities",
    },
    {
      title: "Resume Submission",
      description: "Eligible students submit their resumes for consideration",
    },
    {
      title: "Selection Process",
      description:
        "Companies conduct tests/interviews as per their recruitment process",
    },
    {
      title: "Offer Letter",
      description: "Selected students receive offer letters from companies",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Placement Process
        </h2>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="md:w-1/2 p-4">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementProcess;
