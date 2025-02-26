"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Activity, Timer, Pencil } from "lucide-react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Component */}
      <Header />
      
      {/* Hero Section */}
      <header className="bg-blue-600 mt-10 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Competitive Programming Arena</h1>
        <p className="mt-4 text-lg">Create contests, challenge friends, and track performance.</p>
        <Button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
          Join a Contest
        </Button>
      </header>
      
      {/* Features Section */}
      <section className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 md:mt-10 lg:grid-cols-4 justify-center gap-6">
        {/* Leaderboard */}
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Trophy size={40} className="text-yellow-500" />
            <h3 className="mt-4 font-bold text-lg">Leaderboard</h3>
            <p className="text-center text-gray-600">Track your rankings in real-time.</p>
          </CardContent>
        </Card>

        {/* Problem Setting */}
        <Card>
          <CardContent className="flex flex-col hover:cursor-pointer items-center p-6" onClick={()=>{router.push('/problemset')}} >
            <Pencil size={40} className="text-green-500" />
            <h3 className="mt-4 font-bold text-lg">Problem Set</h3>
            <p className="text-center text-gray-600"> Challenge yourself by solving them.</p>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card>
          <CardContent className="flex flex-col hover:cursor-pointer items-center p-6" onClick={() => router.push('/analytics')}>
            <Activity size={40} className="text-blue-500" />
            <h3 className="mt-4 font-bold text-lg">Performance Analytics</h3>
            <p className="text-center text-gray-600">Analyze your strengths and weaknesses.</p>
          </CardContent>
        </Card>

        {/* Custom Contests */}
        <Card>
          <CardContent className="hover:cursor-pointer flex flex-col items-center p-6" onClick={() => router.push('/CostumContests')}>
            <Timer size={40} className="text-red-500" />
            <h3 className="mt-4 font-bold text-lg">Custom Contests</h3>
            <p className="text-center text-gray-600">Set up private contests with custom rules.</p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 fixed bottom-1 w-full text-white text-center py-1 mt-12">
        <p>&copy; 2025 Competitive Programming Arena. All rights reserved.</p>
      </footer>
    </div>
  );
}
