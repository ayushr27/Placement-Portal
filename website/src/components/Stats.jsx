const Stats = () => {
  const stats = [
    { value: "100+", label: "Companies Visited" },
    { value: "90%+", label: "Placement Rate" },
    { value: "20LPA", label: "Highest Package" },
    { value: "8LPA", label: "Average Package" },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Placement Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <p className="text-4xl font-bold text-blue-700 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
