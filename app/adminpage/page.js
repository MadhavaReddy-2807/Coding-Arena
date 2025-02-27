"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AdminPanel = () => {
  const [contest, setContest] = useState({
    name: "",
    author: "",
    authoremail: "",
    aim: "",
    startDate: "",
    startTime: "",
    endTime: "",
    problems: [],
    id: uuidv4(), // Auto-generate unique contest ID
  });

  const [problems, setProblems] = useState([]); // Store fetched problems
  const [selectedProblems, setSelectedProblems] = useState([]); // Store selected problems
  const [tags, setTags] = useState([]); // Store unique tags
  const [selectedTag, setSelectedTag] = useState("");

  // Fetch problems from Codeforces API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/problemset.problems");
        const data = await response.json();
        if (data.status === "OK") {
          setProblems(data.result.problems);
          const uniqueTags = new Set(data.result.problems.flatMap(problem => problem.tags));
          setTags(Array.from(uniqueTags));
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setContest({ ...contest, [e.target.name]: e.target.value });
  };

  // Handle problem selection
  const handleProblemSelection = (problem) => {
    if (selectedProblems.some((p) => p.contestId === problem.contestId && p.index === problem.index)) {
      setSelectedProblems(selectedProblems.filter((p) => !(p.contestId === problem.contestId && p.index === problem.index)));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalContest = {
        ...contest,
        problems: selectedProblems,
        link: `/contest/${contest.id}`, // Auto-generate contest link
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upcomingcontests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalContest),
      });

      if (res.ok) {
        alert("Contest added successfully!");
        setContest({
          name: "",
          author: "",
          authoremail: "",
          aim: "",
          startDate: "",
          startTime: "",
          endTime: "",
          problems: [],
          id: uuidv4(), // Generate new contest ID for next entry
        });
        setSelectedProblems([]);
      } else {
        console.error("Failed to send contest data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-900 flex flex-col items-center text-white">
      <h1 className="text-4xl font-bold mb-6">📢 Add a New Contest</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <input type="text" name="name" value={contest.name} onChange={handleChange} placeholder="Contest Name" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="text" name="author" value={contest.author} onChange={handleChange} placeholder="Author Name" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="email" name="authoremail" value={contest.authoremail} onChange={handleChange} placeholder="Author Email" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="text" name="aim" value={contest.aim} onChange={handleChange} placeholder="Contest Aim" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="date" name="startDate" value={contest.startDate} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="time" name="startTime" value={contest.startTime} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="time" name="endTime" value={contest.endTime} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>

        {/* Filter by Tags */}
        <select onChange={(e) => setSelectedTag(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">
          <option value="">All Tags</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>

        {/* Problems Section */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">📝 Select Problems</h2>
          <div className="max-h-40 overflow-y-auto">
            {problems.filter(problem => !selectedTag || problem.tags.includes(selectedTag)).map((problem, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`problem-${index}`}
                  onChange={() => handleProblemSelection(problem)}
                  checked={selectedProblems.some((p) => p.contestId === problem.contestId && p.index === problem.index)}
                  className="mr-2"
                />
                <label htmlFor={`problem-${index}`} className="text-sm">
                  {problem.contestId}{problem.index} - {problem.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">🚀 Add Contest</button>
      </form>
    </div>
  );
};

export default AdminPanel;