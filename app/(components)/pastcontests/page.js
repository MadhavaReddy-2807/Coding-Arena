"use client";
import React, { useEffect, useState } from "react";

const PastContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upcomingcontests`);
        if (!response.ok) throw new Error("Failed to fetch contests");
        
        const data = await response.json();
        const currentTime = new Date();
        
        // Filter completed contests based on endTime
        const completedContests = data.filter((contest) => {
          const contestEndTime = new Date(`${contest.startDate}T${contest.endTime}:00`);
          return contestEndTime < currentTime; // Only contests that have ended
        });

        setContests(completedContests);
      } catch (error) {
        console.error("Error fetching past contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Past Contests</h1>
      
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : contests.length === 0 ? (
        <p className="text-center text-gray-600">No past contests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <div key={contest.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{contest.name}</h2>
              <p className="text-gray-600">Author: {contest.author}</p>
              <p className="text-gray-600">Ended on: {contest.startDate} at {contest.endTime}</p>
              
              <a href={contest.link} className="text-blue-600 hover:underline mt-2 block">
                View Contest
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastContests;
