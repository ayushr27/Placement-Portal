const Recruiters = () => {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Adobe",
    "Intel",
    "NVIDIA",
    "Qualcomm",
    "Samsung",
    "Goldman Sachs",
    "JP Morgan",
    "Morgan Stanley",
    "Barclays",
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our Recruiters
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-300"
            >
              <p className="text-lg font-medium text-gray-700">{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recruiters;
