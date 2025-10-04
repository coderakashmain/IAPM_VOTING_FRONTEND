import React from "react";

const CandidateGrid = React.memo(({ candidates }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {candidates.map((candidate) => (
        <li
          key={candidate.candidate_id}
          className="rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <div className="flex flex-col items-center text-center">
            {candidate.candidate_pic ? (
              <img
                src={candidate.candidate_pic}
                alt={candidate.candidate_name}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-gray-500 text-xl font-bold">
                  {candidate.candidate_name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-lg">{candidate.candidate_name}</h3>
            {/* <p className="text-gray-600 text-sm">{candidate.member_id}</p> */}
            {/* <p className="text-gray-600 text-sm">{candidate.candidate_mobile}</p> */}
            <p className="text-gray-600 text-sm">{candidate.candidate_email}</p>
            <p className="mt-2 text-gray-700 text-sm">{candidate.about_candidate}</p>
            {candidate.brochure_pdf && (
              <a
                href={candidate.brochure_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className=" active mt-4  underline text-xs bg-primary text-white py-1 px-3 rounded-2xl "
              >
                View Brochure
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
})

export default CandidateGrid;
