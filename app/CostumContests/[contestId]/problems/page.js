"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContestHeader from "@/components/ContestHeader/ContestHeader";

const ProblemsPage = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("problems");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
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

  useEffect(() => {
    if (!contest || !contest.participants) return;

    const fetchLeaderboard = async () => {
      try {
        const currentTime = new Date().getTime() / 1000; // Current time in seconds
        const endDate = new Date(`${contest.contestDate}T${contest.endTime}:00Z`).getTime() / 1000;

        // Check if the contest has ended
        if (currentTime > endDate) {
          console.log("Contest has ended. Leaderboard will not be updated.");
          return;
        }

        const leaderboardData = await Promise.all(
          contest.participants.map(async (participant) => {
            if (!participant.cfHandle) return { name: participant.name, handle: "N/A", solved: 0, penalty: 0 };

            const res = await fetch(`https://codeforces.com/api/user.status?handle=${participant.cfHandle}`);
            const data = await res.json();
            if (!data.result) return { name: participant.name, handle: participant.cfHandle, solved: 0, penalty: 0 };
            return processICPCScoring(data.result, participant.name, participant.cfHandle);
          })
        );

        setLeaderboard(leaderboardData.sort((a, b) => b.solved - a.solved || a.penalty - b.penalty));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    // Fetch leaderboard 5 seconds after contest data is available
    const leaderboardTimeout = setTimeout(fetchLeaderboard, 5000);

    // Auto-refresh leaderboard every 1 minute (only if contest is ongoing)
    const interval = setInterval(() => {
      const currentTime = new Date().getTime() / 1000;
      const endDate = new Date(`${contest.contestDate}T${contest.endTime}:00Z`).getTime() / 1000;

      if (currentTime <= endDate) {
        fetchLeaderboard();
      } else {
        clearInterval(interval); // Stop the interval if the contest has ended
      }
    }, 60000);

    return () => {
      clearTimeout(leaderboardTimeout);
      clearInterval(interval);
    };
  }, [contest]); // Run when `contest` is updated

  const processICPCScoring = (submissions, name, handle) => {
    let problemStatus = {};
    let solvedCount = 0;
    let penalty = 0;

    if (!contest || !contest.problems) {
      console.error("Contest or contest problems are undefined.");
      return { name, handle, solved: 0, penalty: 0 };
    }

    const startDate = new Date(`${contest.contestDate}T${contest.startTime}:00Z`).getTime() / 1000;
    const endDate = new Date(`${contest.contestDate}T${contest.endTime}:00Z`).getTime() / 1000;

    submissions.forEach((submission) => {
      const { problem, verdict, creationTimeSeconds } = submission;
      const problemKey = `${problem.contestId}/${problem.index}`;
      const isProblemInContest = contest.problems.some((p) => {
        const urlParts = p.url.split("/");
        const contestIdFromUrl = parseInt(urlParts[urlParts.length - 2]);
        const indexFromUrl = urlParts[urlParts.length - 1];
        return contestIdFromUrl === problem.contestId && indexFromUrl === problem.index;
      });

      if (
        isProblemInContest &&
        (creationTimeSeconds + 19800) >= startDate &&
        (creationTimeSeconds + 19800) <= endDate
      ) {
        if (!problemStatus[problemKey]) {
          problemStatus[problemKey] = { attempts: 0, solved: false, firstSolveTime: 0 };
        }

        if (problemStatus[problemKey].solved) return;

        if (verdict === "OK") {
          problemStatus[problemKey].solved = true;
          solvedCount++;
          problemStatus[problemKey].firstSolveTime = creationTimeSeconds;
          penalty += Math.floor((creationTimeSeconds - startDate) / 60) + problemStatus[problemKey].attempts * 20;
        } else {
          problemStatus[problemKey].attempts++;
          penalty += 20;
        }
      }
    });

    return { name, handle, solved: solvedCount, penalty };
  };

  if (loading) return <p className="text-center text-lg">Loading contest details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <ContestHeader />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-6">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">{contest?.name}</h1>
          <p className="text-lg text-gray-700 text-center">
            Hosted by <span className="text-blue-600 font-semibold">{contest?.organizer}</span>
          </p>

          {/* Tabs */}
          <div className="flex-col gap-3 flex  md:flex-row justify-center mt-6 space-x-4">
            <button
              className={`px-6 py-2 font-semibold rounded-md transition-all duration-300 ${
                activeTab === "problems"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("problems")}
            >
              Problems
            </button>
            <button
              className={`px-6 py-2 font-semibold rounded-md transition-all duration-300 ${
                activeTab === "participants"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("participants")}
            >
              Participants
            </button>
            <button
              className={`px-6 py-2 font-semibold rounded-md transition-all duration-300 ${
                activeTab === "leaderboard"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </button>
          </div>

          {/* Problems Tab */}
          {activeTab === "problems" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Problems</h2>
              <div className="grid gap-4">
                {contest?.problems?.map((problem, index) => (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold text-lg hover:underline"
                    >
                      {problem.index}. {problem.name}
                    </a>
                    <p className="text-sm text-gray-600 mt-2">Tags: {problem.tags.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === "participants" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Participants</h2>
              {contest?.participants?.length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow-md">
                  <table className="w-full border-collapse bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">CF Handle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contest?.participants.map((participant, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3 font-semibold">{participant.name}</td>
                          <td className="p-3 text-blue-500 hover:text-blue-600">
                            {participant.cfHandle ? (
                              <a
                                href={`https://codeforces.com/profile/${participant.cfHandle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {participant.cfHandle}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No participants yet.</p>
              )}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Leaderboard</h2>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 text-left">Rank</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">CF Handle</th>
                      <th className="p-3 text-left">Solved</th>
                      <th className="p-3 text-left">Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{user?.name}</td>
                        <td className="p-3">{user?.handle}</td>
                        <td className="p-3">{user.solved}</td>
                        <td className="p-3">{user?.penalty} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProblemsPage;