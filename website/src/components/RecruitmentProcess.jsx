import React from "react";

const RecruitmentProcess = () => {
  const steps = [
    "Interested employers can get in touch with the Placement Office for campus hiring.",
    <>
      Recruiters interested in hiring can log in through [website link] and complete their registration by filling out the necessary details.
      <br />
      <a
        href="https://campus.placements.iiitdmk.ac.in/auth/recruiter/login"
        className="text-blue-600 underline break-all"
        target="_blank" rel="noopener noreferrer"
      >
        https://campus.placements.iiitdmk.ac.in
      </a>
    </>,
    "The details of the job are verified by the TPO (Training and Placement Officer), including remuneration details and any other ambiguous information.",
    "After successful verification, the job is made available online to students, according to the dates decided by the Placement Office.",
    "Interested students can register to participate in the recruitment process of a company by applying for its job postings.",
    "Companies will receive the consolidated details of registered students from Placement Office.",
    "Companies can proceed with their tests/screening process after finalizing the schedule in coordination with the Placement Office.",
    "Companies shortlist the selected students for the final interview process.",
    "Companies, in coordination with the Placement Office, finalize the date of the interview.",
    "Organizations provide a list of students to whom they are extending offers at the end of their interview slot.",
    "The Placement Office notifies the organization of the acceptance of selected students.",
    "The organization generates and delivers the offer letters to the selected candidates, consistent with the information provided in the job posting created online."
  ];

  return (
    <div id="process" className="bg-gray-100 px-6 py-16 lg:px-24">
      <h2 className="text-center text-4xl lg:text-5xl font-bold mb-6 text-blue-700">Recruitment Process</h2>
      <p className="text-center text-gray-600 text-lg lg:text-xl max-w-4xl mx-auto mb-12">
        Our process has evolved over the years to ensure that our recruiters have a seamless hiring experience. 
        Here we have simplified the steps for you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mr-4">
                {index + 1}
              </div>
            </div>
            <div className="text-justify text-base lg:text-lg leading-relaxed">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentProcess;
