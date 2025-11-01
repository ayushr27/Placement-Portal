import { Briefcase, Calendar, Users, FileText, CheckCircle } from "lucide-react";

const icons = [
  Briefcase,
  Calendar,
  Users,
  FileText,
  Briefcase,
  CheckCircle,
  Calendar,
  Users,
  CheckCircle,
  FileText,
];

const steps = [
  {
    title: "Job Verification",
    description:
      "The TPO verifies job details, including remuneration and clarifies any ambiguities.",
  },
  {
    title: "Job Posting",
    description:
      "Verified jobs are published online for students based on the schedule set by the Placement Office.",
  },
  {
    title: "Student Registration",
    description:
      "Interested students apply for job postings to participate in the company's recruitment process.",
  },
  {
    title: "Resume Sharing",
    description:
      "The Placement Office sends consolidated student application details to the respective companies.",
  },
  {
    title: "Assessment Process",
    description:
      "Companies conduct tests or screenings as per the finalized schedule in coordination with the Placement Office.",
  },
  {
    title: "Shortlisting",
    description:
      "Companies shortlist candidates for the final interview stage based on assessment results.",
  },
  {
    title: "Interview Scheduling",
    description:
      "Interview dates are finalized jointly by the company and the Placement Office.",
  },
  {
    title: "Final Interviews",
    description:
      "Organizations conduct final interviews and provide a list of selected students.",
  },
  {
    title: "Selection Notification",
    description:
      "The Placement Office informs companies of students who have accepted their job offers.",
  },
  {
    title: "Offer Letter Distribution",
    description:
      "Companies issue offer letters to selected candidates based on the verified job postings.",
  },
];

const PlacementProcess = () => {
  return (
    <section className="py-20 bg-[#f4f7ff]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#31398A] mb-16">
          Placement Process
        </h2>

        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#31398A] via-[#029309] to-[#31398A] opacity-20 transform -translate-x-1/2" />

          <div className="space-y-0">
            {steps.map((step, index) => {
              const Icon = icons[index % icons.length];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Connector Icon */}
                  <div className="md:w-1/2 flex justify-center mb-2 md:mb-0">
                    <div
                      className={`w-14 h-14 rounded-full ${
                        isEven ? "bg-[#31398A]" : "bg-[#029309]"
                      } text-white flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="md:w-1/2 px-6">
                    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                      <h3 
                      className={`text-xl font-semibold ${
                        isEven ? "text-[#31398A]" : "text-[#029309]"
                      } mb-2`}
                        
                        >
                        {step.title}
                      </h3>
                      <p className="text-gray-700 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementProcess;
