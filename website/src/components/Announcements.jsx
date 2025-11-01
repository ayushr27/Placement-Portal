import { useState } from "react";

const Announcements = () => {
  const [announcements] = useState([
    {
      id: 1,
      title: "Summer Internship 2023 Results",
      date: "May 15, 2023",
      content:
        "The results for summer internship placements have been declared. Check your email for details.",
    },
    {
      id: 2,
      title: "Upcoming Recruitment Drive",
      date: "June 1, 2023",
      content:
        "Microsoft will be visiting our campus on June 15th for recruitment. Register by June 10th.",
    },
    {
      id: 3,
      title: "Resume Workshop",
      date: "April 28, 2023",
      content:
        "A workshop on building effective resumes will be conducted on May 5th at 3 PM in Auditorium.",
    },
  ]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Announcements
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">
                  {announcement.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {announcement.date}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{announcement.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
