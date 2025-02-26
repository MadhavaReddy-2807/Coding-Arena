"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Activity } from "lucide-react";

const contests = [
  { id: "contest-1", name: "Code Rush", author: "Alice", rating: 1800, aim: "Sharpen your problem-solving skills with a variety of algorithmic and logical challenges designed to test your thinking speed and accuracy.", link: "/contests/contest-1" },
  { id: "contest-2", name: "Algorithm Arena", author: "Bob", rating: 2000, aim: "Push your algorithmic abilities to the limit by solving complex computational problems that demand deep analytical thinking and optimization techniques.", link: "/contests/contest-2" },
  { id: "contest-3", name: "Data Structure Duel", author: "Charlie", rating: 1750, aim: "Master the art of data structures by tackling problems that require efficient data handling and manipulation using advanced techniques.", link: "/contests/contest-3" },
  { id: "contest-4", name: "Hackathon Battle", author: "David", rating: 1900, aim: "Apply your coding skills to real-world scenarios by building innovative projects and solving practical challenges in a competitive environment.", link: "/contests/contest-4" },
  { id: "contest-5", name: "CP Showdown", author: "Eve", rating: 2100, aim: "Compete at an elite level against top programmers and refine your coding prowess through high-difficulty problems that require creativity and speed.", link: "/contests/contest-5" },
];

export default function UpcomingContests() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 shadow-lg p-4 rounded-lg bg-white">
        🚀 Upcoming Contests
      </h1>

      {/* Contest List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {contests.map((contest) => (
          <Card
            key={contest.id}
            className="border border-gray-200 shadow-lg rounded-2xl p-6 bg-white hover:shadow-xl transition"
          >
            <CardContent>
              <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" /> {contest.name}
              </h2>
              <p className="text-gray-700 mt-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Author:</span> {contest.author} (Rating: {contest.rating})
              </p>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="font-medium">Aim:</span> {contest.aim}
              </p>
              <Link href={contest.link}>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
                  View Details
                </button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-lg text-gray-700 font-semibold">
        "Keep coding, keep improving, and never stop challenging yourself! Wishing you success in your coding journey! 🚀💡"
      </div>
    </div>
  );
}
