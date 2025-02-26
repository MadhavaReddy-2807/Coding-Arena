import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Activity, Timer } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Component */}
      <Header />
      
      {/* Hero Section */}
      <header className="bg-blue-600 mt-5 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Competitive Programming Arena</h1>
        <p className="mt-4 text-lg">Create contests, challenge friends, and track performance.</p>
        <Button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
          Join a Contest
        </Button>
      </header>
      
      {/* Features Section */}
      <section className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Trophy size={40} className="text-yellow-500" />
            <h3 className="mt-4 font-bold text-lg">Leaderboard</h3>
            <p className="text-center text-gray-600">Track your rankings in real-time.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Users size={40} className="text-green-500" />
            <h3 className="mt-4 font-bold text-lg">Team Contests</h3>
            <p className="text-center text-gray-600">Compete in solo or team-based challenges.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Activity size={40} className="text-blue-500" />
            <h3 className="mt-4 font-bold text-lg">Performance Analytics</h3>
            <p className="text-center text-gray-600">Analyze your strengths and weaknesses.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Timer size={40} className="text-red-500" />
            <h3 className="mt-4 font-bold text-lg">Custom Contests</h3>
            <p className="text-center text-gray-600">Set up private contests with custom rules.</p>
          </CardContent>
        </Card>
      </section>
      
      {/* Leaderboard Preview */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center">Leaderboard</h2>
        <div className="mt-6 bg-white shadow-md rounded-lg p-4">
          <ul>
            <li className="flex justify-between border-b py-2">
              <span className="font-semibold">1. John Doe</span>
              <span className="text-gray-600">1200 pts</span>
            </li>
            <li className="flex justify-between border-b py-2">
              <span className="font-semibold">2. Jane Smith</span>
              <span className="text-gray-600">1100 pts</span>
            </li>
            <li className="flex justify-between py-2">
              <span className="font-semibold">3. Alice Brown</span>
              <span className="text-gray-600">1050 pts</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>&copy; 2025 Competitive Programming Arena. All rights reserved.</p>
      </footer>
    </div>
  );
}
