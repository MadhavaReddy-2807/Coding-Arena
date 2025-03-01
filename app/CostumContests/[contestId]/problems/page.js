"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ProblemsPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("problems"); // Default tab: Problems

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
         console.log("hello")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}privatecontests/${contestId}`);
        if (!res.ok) throw new Error("Failed to fetch contest details");

        const data = await res.json();
        setContest(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchContestDetails();
  }, [contestId]);

  if (loading) return <p className="text-center text-lg">Loading contest details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-100 py-16 px-6">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">{contest.name}</h1>
        <p className="text-lg text-gray-700 text-center">
          Hosted by <span className="text-blue-600 font-semibold">{contest.organizer}</span>
        </p>

        {/* Tabs */}
        <div className="flex justify-center mt-6 space-x-6">
          <button
            className={`px-6 py-2 font-semibold rounded-md transition ${
              activeTab === "problems" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("problems")}
          >
            Problems
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-md transition ${
              activeTab === "participants" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
        </div>

        {/* Problems List */}
        {activeTab === "problems" && (
          <div className="mt-8">
            {contest.problems?.length > 0 ? (
              contest.problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-5 rounded-xl my-4 border border-gray-300 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {problem.index}. {problem.name}
                  </h2>
                  <p className="text-gray-600">Type: {problem.type}</p>
                  <p className="text-gray-600">
                    Tags:{" "}
                    {problem.tags.map((tag, i) => (
                      <span key={i} className="text-purple-500 text-sm bg-purple-100 px-2 py-1 rounded-md mr-2">
                        {tag}
                      </span>
                    ))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No problems available.</p>
            )}
          </div>
        )}

        {/* Participants List */}
        {activeTab === "participants" && (
          <div className="mt-8">
            {contest.participants?.length > 0 ? (
              contest.participants.map((participant, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-5 rounded-xl my-4 border border-gray-300 hover:shadow-lg transition flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{participant.name}</h2>
                    <p className="text-gray-600">{participant.email}</p>
                  </div>
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                    Solved: {participant.solved || 0}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No participants yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
