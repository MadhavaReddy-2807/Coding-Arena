"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomContests() {
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/problemset.problems");
        const data = await response.json();

        if (data.status === "OK") {
          const fetchedProblems = data.result.problems.slice(0, 10).map((problem) => ({
            name: problem.name,
            contestId: problem.contestId,
            index: problem.index,
            url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
          }));
          setProblems(fetchedProblems);
        }
      } catch (error) {
        console.error("Error fetching Codeforces problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Handle problem selection
  const toggleSelection = (problem) => {
    setSelectedProblems((prev) =>
      prev.some((p) => p.url === problem.url)
        ? prev.filter((p) => p.url !== problem.url) // Remove if already selected
        : [...prev, problem] // Add if not selected
    );
  };

  // Start contest with selected problems
  const startContest = () => {
    if (selectedProblems.length === 0) {
      alert("Please select at least one problem to start the contest!");
      return;
    }
    ///here it should redirect to a page of customcontest/uuid and that data of problme set should be stored int the mongo data base
    router.push(`/contest?problems=${encodeURIComponent(JSON.stringify(selectedProblems))}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Contests - Codeforces Problems</h1>
      {loading ? (
        <p>Loading problems...</p>
      ) : (
        <>
          <ul className="mt-4 space-y-2">
            {problems.length > 0 ? (
              problems.map((problem, index) => (
                <li key={index} className="flex items-center space-x-4 border p-4 rounded-md shadow-md">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    onChange={() => toggleSelection(problem)}
                    checked={selectedProblems.some((p) => p.url === problem.url)}
                  />
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {problem.name}
                  </a>
                </li>
              ))
            ) : (
              <p>No problems found.</p>
            )}
          </ul>

          {/* Start Contest Button */}
          <button
            onClick={startContest}
            disabled={selectedProblems.length === 0}
            className={`mt-6 px-6 py-3 rounded-xl font-semibold transition ${
              selectedProblems.length > 0 ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Start Contest
          </button>
        </>
      )}
    </div>
  );
}
