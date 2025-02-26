"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [data, setData] = useState(null);
  const [totalSolved, setTotalSolved] = useState(0);

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
    } catch (error) {
      console.error("Error fetching user data:", error);
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
            </div>
          </div>
        )}

        {/* Graph */}
        {problems.length > 0 ? (
          <ResponsiveContainer width="60%" height={300} className="mt-6">
            <LineChart data={problems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: "Contest", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Problems Solved", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="mt-6 text-gray-500">No data available.</p>
        )}
      </main>
    </div>
  );
};

export default Page;
