import React, { useEffect, useState } from "react";
import { api } from "../APIs/apiService";
import { useApiPromise } from "../Hooks/useApi";
import { Vote, CheckCircle, Info, User, Clock } from "lucide-react";
import { useNavigate } from "react-router";


const VotePage = () => {
  const [electionData, setElectionData] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [electionEnded, setElectionEnded] = useState(false);
  const navigate = useNavigate();
  const { run, loading } = useApiPromise();
  const postId = sessionStorage.getItem("postId");
  const {run:voterun, error:voteerror,loading : voterloading} = useApiPromise();
  const [alreadyVoted,setAlreadyVoted] = useState(false);

  
  // Fetch election data
  useEffect(() => {
    let isMounted = true;


    const fetchData = async () => {
      try {
        const res = await run(() =>
          api.post("/vote/fetch/postdetails", {post_id :postId},{
            token: true,
            withCredentials: true,
          })
        );
        if (isMounted) setElectionData(res.data[0]);
        if(!res.status){
           sessionStorage.removeItem("accessToken");
        navigate('/login',{replace : true})
        }
      } catch (err) {
       sessionStorage.removeItem("accessToken");
        navigate('/login',{replace : true})
        console.error("Error fetching post details:", err);
      }
    };

    fetchData();
    return () => (isMounted = false);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!electionData) return;
    const endTime = new Date(electionData.election_end).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Election Ended");
        setElectionEnded(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(
          `${days}d ${hours}h ${minutes}m ${seconds}s left`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [electionData]);

  const handleVote = async (candidateId) => {
    if (electionEnded || has_voted) return;
    setAlreadyVoted(true);
    setSelectedCandidate(candidateId);
    const res =   await voterun(()=>{
      api.post("/vote/choosecandidate",{candidate_id : candidateId},{token : true,retryOnAuthFail: true ,withCredentials:true})
    });
    

      if(!res.status){
        setSelectedCandidate(null);
        setAlreadyVoted(false);
      }
      
  };

  if (!electionData || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg text-primary text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const { organization_name, post_name, post_about, candidates,has_voted,vote_to } = electionData;
 
  return (
    <section className="min-h-screen bg-bg py-10 select-none">
      <div className="container mx-auto px-4 sm:px-8 text-text">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6 text-center border border-gray-200">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <Vote className="w-7 h-7 text-primary" />
            {organization_name}
          </h1>
          <h2 className="text-xl font-semibold text-text mb-2">{post_name}</h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto mb-4">{post_about}</p>

          {/* Countdown */}
          <div className={`flex items-center justify-center gap-2 text-sm text-white ${electionEnded ? "bg-error" :'bg-primary'} px-4 py-1 rounded-full w-max mx-auto`}>
            <Clock className="w-4 h-4" />
            {timeLeft}
          </div>
          {has_voted || alreadyVoted ? (<div className={`mt-3 text-sm text-white  inline-flex py-1 px-3 rounded-sm ${alreadyVoted ? "bg-primary" : "bg-error"} `}>
            <p className="text-white"> {alreadyVoted ? "Vote  recorded" : "You already voted."} </p>
          </div>) : ("")}
          {voteerror && (<p className="mt-3 text-sm text-error ">{voteerror}</p>)}
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates?.map((c) => (
            <div
              key={c.candidate_id}
              className={`relative bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-300 border ${
                (selectedCandidate  || vote_to) === c.candidate_id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-gray-200"
              } overflow-visible`}
            >
              {/* Avatar */}
              <div className="flex justify-center mt-6">
                {c.candidate_pic ? (
                  <img
                    src={c.candidate_pic}
                    alt={c.candidate_name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-md">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-primary">
                  {c.candidate_name || "Unknown"}
                </h3>
                <p className="text-sm text-text opacity-80 mt-2">
                  {c.about_candidate || "No description provided."}
                </p>

                {/* Brochure */}
                {c.brochure_pdf && (
                  <a
                    href={c.brochure_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-info hover:underline mt-3 text-sm"
                  >
                    <Info className="w-4 h-4 mr-1" /> View Brochure
                  </a>
                )}

                {/* Vote Button */}
                <div className="mt-5">
                  <button
                    onClick={() => handleVote(c.candidate_id)}
                    disabled={electionEnded || has_voted || voterloading}
                    className={`w-full flex items-center justify-center gap-2 py-2  rounded-full font-semibold transition-all duration-200 ${
                      selectedCandidate || vote_to === c.candidate_id
                        ? "bg-primary text-white" 
                        : electionEnded || has_voted || voterloading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "border border-primary text-primary hover:bg-primary cursor-pointer hover:text-white"
                    }`}
                  >
                    {selectedCandidate || vote_to === c.candidate_id ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Voted
                      </>
                    ) : electionEnded ? (
                      "Voting Closed"
                    ) : (
                      <>
                        <Vote className="w-5 h-5" />
                        Vote for Candidate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Selected Badge */}
              {(selectedCandidate || vote_to) === c.candidate_id && (
                <div className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full shadow-md">
                  Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VotePage;
