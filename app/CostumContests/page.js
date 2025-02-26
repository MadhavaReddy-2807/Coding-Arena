"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function CustomContests() {
  const [contestName, setContestName] = useState("");
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [contestDate, setContestDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/problemset.problems");
        const data = await response.json();

        if (data.status === "OK") {
          const fetchedProblems = data.result.problems.slice(0, 50).map((problem) => ({
            name: problem.name,
            contestId: problem.contestId,
            index: problem.index,
            tags: problem.tags || [],
            url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
          }));

          setProblems(fetchedProblems);
          setFilteredProblems(fetchedProblems);

          // Extract unique tags
          const uniqueTags = [...new Set(fetchedProblems.flatMap((p) => p.tags))];
          setTags(uniqueTags);
        }
      } catch (error) {
        console.error("Error fetching Codeforces problems:", error);
        toast.error("Failed to fetch problems from Codeforces.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const toggleSelection = (problem) => {
    setSelectedProblems((prev) => {
      if (prev.some((p) => p.url === problem.url)) {
        return prev.filter((p) => p.url !== problem.url);
      } else {
        if (prev.length >= 7) {
          toast.error("You can select a maximum of 7 problems.");
          return prev;
        }
        return [...prev, problem];
      }
    });
  };

  const handleTagChange = (event) => {
    const tag = event.target.value;
    setSelectedTag(tag);
    setFilteredProblems(tag ? problems.filter((problem) => problem.tags.includes(tag)) : problems);
  };

  // Start contest with selected problems
  const startContest = async () => {
    if (!contestName.trim()) {
      toast.error("Please enter a contest name.");
      return;
    }

    if (selectedProblems.length === 0) {
      toast.error("Please select at least one problem to start the contest!");
      return;
    }

    if (!contestDate || !startTime || !endTime) {
      toast.error("Please provide a valid contest date and time.");
      return;
    }

    const contestId = uuidv4();
    const data = {
      name: contestName,
      organizer: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      contestId,
      problems: selectedProblems,
      startTime,
      endTime,
      contestDate,
      participants: [],
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}privatecontest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create contest");
      }

      // Redirect to contest page with the new contest ID
      router.push(`/CostumContests/${contestId}`);
    } catch (error) {
      console.error("Error starting contest:", error);
      toast.error("Failed to create contest. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mt-10 mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Custom Contests - Codeforces Problems</h1>

        {/* Tag Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Filter by Tag:</label>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Problem List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading problems...</p>
          </div>
        ) : (
          <>
            {filteredProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProblems.map((problem, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition-all"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 flex-shrink-0"
                      onChange={() => toggleSelection(problem)}
                      checked={selectedProblems.some((p) => p.url === problem.url)}
                    />
                    <div className="ml-4">
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {problem.name}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Contest {problem.contestId} - {problem.index}</p>
                      {problem.tags.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">Tags: {problem.tags.join(", ")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No problems found.</p>
            )}
          </>
        )}

        {/* Contest Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Contest Name:</label>
          <input
            type="text"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contest name"
          />
        </div>

        {/* Date & Time Inputs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <input type="date" value={contestDate} onChange={(e) => setContestDate(e.target.value)} className="p-3 border border-gray-300 rounded-md shadow-sm" />
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="p-3 border border-gray-300 rounded-md shadow-sm" />
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="p-3 border border-gray-300 rounded-md shadow-sm" />
        </div>

        {/* Start Contest Button */}
        <button onClick={startContest} disabled={selectedProblems.length === 0} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">Create Contest</button>
      </div>
    </>
  );
}
