"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const AdminPanel = () => {
  const [contest, setContest] = useState({
    name: "",
    author: "",
    authoremail: "madhava2807@gmail.com",
    aim: "",
    startDate: "",
    startTime: "",
    endTime: "",
    problems: [],
    participants: [],
    id: uuidv4(),
  });

  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const [selectedTag, setSelectedTag] = useState("");
   const[loading,setLoading]=useState(false);
  useEffect(() => {
    const fetchProblems = async () => {
      try {

        const response = await fetch("https://codeforces.com/api/problemset.problems");
        const data = await response.json();
        if (data.status === "OK") {
          setProblems(
            data.result.problems.slice(0, 50).map(problem => ({
              ...problem,
              url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setContest((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleProblemSelection = useCallback((problem) => {
    setSelectedProblems((prev) => {
      const newSelection = new Set(prev);
      const problemKey = `${problem.contestId}-${problem.index}`;
      if (newSelection.has(problemKey)) {
        newSelection.delete(problemKey);
      } else {
        newSelection.add(problemKey);
      }
      return newSelection;
    });
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter(problem => !selectedTag || problem.tags.includes(selectedTag));
  }, [problems, selectedTag]);

  const tags = useMemo(() => [...new Set(problems.flatMap(problem => problem.tags))], [problems]);

  const finalContest = useMemo(() => ({
    ...contest,
    problems: problems.filter(problem => selectedProblems.has(`${problem.contestId}-${problem.index}`)),
    link: `/contest/${contest.id}`,
  }), [contest, problems, selectedProblems]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upcomingcontests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalContest),
      });

      if (res.ok) {
        alert("Contest added successfully!");
        setContest({ name: "", author: "", authoremail: "madhava2807@gmail.com", aim: "", startDate: "", startTime: "", endTime: "", problems: [], participants: [], id: uuidv4() });
        setSelectedProblems(new Set());
      } else {
        console.error("Failed to send contest data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-900 flex flex-col items-center text-white">
      <h1 className="text-4xl font-bold mb-6">📢 Add a New Contest</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <input type="text" name="name" value={contest.name} onChange={handleChange} placeholder="Contest Name" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="text" name="author" value={contest.author} onChange={handleChange} placeholder="Author Name" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input 
    type="email" 
    name="authoremail" 
    value={contest.authoremail}  
    placeholder="Author Email" 
    required 
    readOnly 
    className="w-full p-2 rounded bg-gray-700 text-white"
/>
        <input type="text" name="aim" value={contest.aim} onChange={handleChange} placeholder="Contest Aim" required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="date" name="startDate" value={contest.startDate} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="time" name="startTime" value={contest.startTime} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>
        <input type="time" name="endTime" value={contest.endTime} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white"/>

        <select onChange={(e) => setSelectedTag(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">
          <option value="">All Tags</option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">📝 Select Problems</h2>
          <div className="max-h-40 overflow-y-auto">
            {filteredProblems.map((problem, index) => {
              const problemKey = `${problem.contestId}-${problem.index}`;
              return (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`problem-${index}`}
                    onChange={() => toggleProblemSelection(problem)}
                    checked={selectedProblems.has(problemKey)}
                    className="mr-2"
                  />
                  <label htmlFor={`problem-${index}`} className="text-sm">
                    <a href={problem.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {problem.contestId}{problem.index} - {problem.name}
                    </a>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg">{loading?<Loader2 className="animate-spin" />:"🚀 Add Contest"}</button>
      </form>
    </div>
  );
};

export default AdminPanel;
