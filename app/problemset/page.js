"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProblemSet = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);

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

          const uniqueTags = [...new Set(fetchedProblems.flatMap((p) => p.tags))];
          setTags(uniqueTags);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleTagChange = (event) => {
    const tag = event.target.value;
    setSelectedTag(tag);
    setFilteredProblems(
      tag ? problems.filter((problem) => problem.tags.includes(tag)) : problems
    );
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mt-10 mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Codeforces Problem Set</h1>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Filter by Tag:</label>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag, index) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading problems...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {problem.name}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Contest {problem.contestId} - {problem.index}
                    </p>
                    {problem.tags.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Tags: {problem.tags.join(", ")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600">No problems found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSet;
