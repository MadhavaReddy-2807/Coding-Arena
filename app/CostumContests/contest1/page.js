"use client"
import Link from "next/link";
import { useState } from "react";

export default function Contest1() {
  const [checkedProblems, setCheckedProblems] = useState([]);

  // Toggle checkbox selection
  const handleCheck = (index) => {
    setCheckedProblems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">Contest 1</h1>
      <p className="text-gray-600 mb-6">Select a problem to solve.</p>

      {/* Problems - Displayed Vertically with Checkboxes */}
      <div className="flex flex-col space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={checkedProblems.includes(index)}
              onChange={() => handleCheck(index)}
              className="mr-2 w-5 h-5 cursor-pointer"
            />

            {/* Problem Link */}
            <Link href={`/custom-contests/contest1/problem${index + 1}`} className="text-lg font-semibold">
              Problem {index + 1}
            </Link>
          </div>
        ))}
      </div>

      {/* Back to Custom Contests */}
      <div className="mt-6">
        <Link href="/CostumContests" className="text-blue-600 hover:underline">
          ← Back to Custom Contests
        </Link>
      </div>
    </div>
  );
}
