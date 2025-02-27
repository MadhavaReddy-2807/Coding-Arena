"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContestHeader from "@/components/ContestHeader/ContestHeader";

const Page = () => {
  const { contestid } = useParams(); // Get the contest ID from URL params
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     console.log(contestid);
    const fetchContest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}contests/${contestid}`);
        if (!res.ok) throw new Error("Failed to fetch contest data");

        const data = await res.json();
        setContest(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestid) fetchContest();
  }, [contestid]);

  if (loading) return <p className="text-center text-lg">Loading contest details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
    <ContestHeader />
  
    <div className="min-h-screen mt-16 flex flex-col items-center bg-gray-100 py-16 px-6">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
        
        <h1 className="text-5xl font-bold text-gray-900 text-center mb-4">
          {contest.name}
        </h1>
  
        {/* Organizer & Rating */}
        <div className="text-center">
          <p className="text-lg text-gray-700">
            Hosted by <span className="text-blue-600 font-semibold">{contest.author}</span>
          </p>
          <p className="text-lg text-gray-600 mt-1">
            Rating: <span className="font-semibold text-purple-500">{contest.rating}</span>
          </p>
        </div>
  
        {/* Contest Description */}
        <p className="text-md text-gray-700 italic mt-6 text-center px-4">
          "{contest.aim}"
        </p>
  
        {/* Contest Details Grid */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="bg-white shadow-md p-5 rounded-xl text-center">
            <p className="text-xl font-semibold text-gray-900">📅 Start Date</p>
            <p className="text-gray-600">{contest.startDate}</p>
          </div>
  
          <div className="bg-white shadow-md p-5 rounded-xl text-center">
            <p className="text-xl font-semibold text-gray-900">⏰ Time</p>
            <p className="text-gray-600">{contest.startTime} - {contest.endTime}</p>
          </div>
        </div>
  
        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <a href={contest.link} className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
            Register Now 
          </a>
        </div>
      </div>
  
    </div>
  </>
  
  
  );
};

export default Page;
