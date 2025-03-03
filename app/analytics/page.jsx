"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [data, setData] = useState(null);
  const [totalSolved, setTotalSolved] = useState(0);
  const [ratingHistory, setRatingHistory] = useState([]); // Store CF rating history
  const [loadingRating, setLoadingRating] = useState(false); // Loading state for CF rating fetch
  const [streakData, setStreakData] = useState([]); // Daily problem-solving data for heatmap
  const [loadingHeatmap, setLoadingHeatmap] = useState(false); // Loading state for heatmap data

  // Fetch user data
  const fetchdata = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users?email=${user.primaryEmailAddress?.emailAddress}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data1 = await res.json();
      setData(data1);

      // Convert problems array into graph data format with indexing starting from 1
      if (data1?.problems) {
        const formattedProblems = data1.problems.map((value, index) => ({
          index: index + 1,
          value
        }));
        setProblems(formattedProblems);

        // Calculate total problems solved
        setTotalSolved(data1.problems.reduce((acc, curr) => acc + curr, 0));
      }

      if (data1?.cfHandle) {
        fetchCodeforcesRating(data1.cfHandle);
        fetchCodeforcesSubmissions(data1.cfHandle); // Fetch submissions for heatmap
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch Codeforces rating history
  const fetchCodeforcesRating = async (cfHandle) => {
    setLoadingRating(true);
    try {
      const res = await fetch(`https://codeforces.com/api/user.rating?handle=${cfHandle}`);
      if (!res.ok) throw new Error("Failed to fetch Codeforces rating history");

      const data = await res.json();
      if (data.status === "OK") {
        // Format rating history for the graph
        const formattedRatingHistory = data.result.map((entry, index) => ({
          index: index + 1,
          rating: entry.newRating,
          contestName: entry.contestName,
        }));
        setRatingHistory(formattedRatingHistory);
      }
    } catch (error) {
      console.error("Error fetching Codeforces rating history:", error);
    } finally {
      setLoadingRating(false);
    }
  };

  // Fetch Codeforces submissions for heatmap
  const fetchCodeforcesSubmissions = async (cfHandle) => {
    setLoadingHeatmap(true);
    try {
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${cfHandle}`);
      if (!res.ok) throw new Error("Failed to fetch Codeforces submissions");

      const data = await res.json();
      if (data.status === "OK") {
        // Process submissions to count problems solved per day
        const submissions = data.result;
        const solvedProblems = new Set(); // Track unique solved problems
        const dailyCounts = {}; // Track problems solved per day

        submissions.forEach((submission) => {
          if (submission.verdict === "OK") {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            if (!solvedProblems.has(problemId)) {
              solvedProblems.add(problemId);

              const submissionDate = new Date(submission.creationTimeSeconds * 1000)
                .toISOString()
                .split("T")[0]; // Format as YYYY-MM-DD

              if (!dailyCounts[submissionDate]) {
                dailyCounts[submissionDate] = 0;
              }
              dailyCounts[submissionDate]++;
            }
          }
        });

        // Convert dailyCounts to heatmap data format
        const heatmapData = Object.keys(dailyCounts).map((date) => ({
          date,
          count: dailyCounts[date],
        }));

        setStreakData(heatmapData);
      }
    } catch (error) {
      console.error("Error fetching Codeforces submissions:", error);
    } finally {
      setLoadingHeatmap(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchdata();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-600 shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-200 font-medium">
            Home
          </Link>
          <Link href="/dashboard" className="text-white hover:text-gray-200 font-medium">
            Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20 p-6 flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-2">Problem Solving Analytics</h2>
        <p className="text-gray-700">Your problem-solving trend over time.</p>

        {/* User Card */}
        {user && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-[350px] text-center">
            <div className="flex justify-center">
              <img
                src={user.imageUrl}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full border-2 border-gray-300"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{user.fullName || data?.name}</h3>

            <div className="mt-3 text-gray-600">
              <p><strong>Contests Participated:</strong> {data?.contests?.length || 0}</p>
              <p><strong>Total Problems Solved:</strong> {totalSolved}</p>
              <p><strong>Codeforces Handle:</strong> {data?.cfHandle || "N/A"}</p>
            </div>
          </div>
        )}

        {/* Problem Solving Graph */}
        {problems.length > 0 ? (
          <div className="w-full max-w-4xl mt-6">
            <h3 className="text-xl font-semibold mb-4">Problems Solved Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={problems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" label={{ value: "Contest", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Problems Solved", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-6 text-gray-500">No problem-solving data available.</p>
        )}

        {/* Codeforces Rating Graph */}
        {loadingRating ? (
          <p className="mt-6 text-gray-500">Loading Codeforces rating history...</p>
        ) : ratingHistory.length > 0 ? (
          <div className="w-full max-w-4xl mt-6">
            <h3 className="text-xl font-semibold mb-4">Codeforces Rating Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ratingHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" label={{ value: "Contest", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rating" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-6 text-gray-500">No Codeforces rating data available.</p>
        )}

        {/* Streak Tracker Heatmap */}
        <div className="w-full max-w-4xl mt-6">
          <h3 className="text-xl font-semibold mb-4">Daily Problem-Solving Streak</h3>
          {loadingHeatmap ? (
            <p className="text-gray-500">Loading heatmap data...</p>
          ) : streakData.length > 0 ? (
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))} // Last 1 year
              endDate={new Date()}
              values={streakData}
              classForValue={(value) => {
                if (!value) return "color-empty";
                return `color-scale-${Math.min(value.count, 4)}`; // 5 color levels
              }}
              tooltipDataAttrs={(value) => ({
                "data-tooltip": value.date
                  ? `${value.date}: ${value.count} problems solved`
                  : "No data",
              })}
            />
          ) : (
            <p className="text-gray-500">No heatmap data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

// Custom Tooltip for Codeforces Rating Graph
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-semibold">{payload[0].payload.contestName}</p>
        <p className="text-gray-600">Rating: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default Page;