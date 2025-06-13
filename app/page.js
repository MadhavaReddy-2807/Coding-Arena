"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Timer, Pencil, UserPlus } from "lucide-react"; // Added UserPlus icon
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useUser();
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    if (!user) return;

    try {
      const email = user.primaryEmailAddress?.emailAddress;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users?email=${email}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          // New user: Register them and redirect
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              name: user.fullName,
              avatar: user.imageUrl,
              contestId: "",
              problems: [],
            }),
          });

          setIsNewUser(true);
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (isNewUser) {
      router.push("/dashboard");
    }
  }, [isNewUser, router]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <header className="bg-blue-600 mt-10 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Competitive Programming Arena</h1>
        <p className="mt-4 text-lg">
          Create contests, challenge friends, and track performance.
        </p>

        <Link href="/contests">
          <Button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
            Join a Contest
          </Button>
        </Link>
      </header>

      <section className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
        {/* Friends */}
        <Card>
          <CardContent
            className="flex flex-col hover:cursor-pointer items-center p-6"
            onClick={() => router.push("/friends")} // Redirect to friends page
          >
            <UserPlus size={40} className="text-purple-500" /> {/* Updated icon */}
            <h3 className="mt-4 font-bold text-lg">Friends</h3>
            <p className="text-center text-gray-600">
              Connect and compete with friends.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent
            className="flex flex-col hover:cursor-pointer items-center p-6"
            onClick={() => router.push("/problemset")}
          >
            <Pencil size={40} className="text-green-500" />
            <h3 className="mt-4 font-bold text-lg">Problem Set</h3>
            <p className="text-center text-gray-600">
              Challenge yourself by solving them.
            </p>
          </CardContent>
        </Card>

        {/* Past Contests */}
        <Card>
          <CardContent
            className="flex flex-col hover:cursor-pointer items-center p-6"
            onClick={() => router.push("/pastcontests")}
          >
            <Users size={40} className="text-blue-500" />
            <h3 className="mt-4 font-bold text-lg">Past Contests</h3>
            <p className="text-center text-gray-600">
              Review previous contests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent
            className="hover:cursor-pointer flex flex-col items-center p-6"
            onClick={() => router.push("/CostumContests")}
          >
            <Timer size={40} className="text-red-500" />
            <h3 className="mt-4 font-bold text-lg">Custom Contests</h3>
            <p className="text-center text-gray-600">
              Set up private contests with custom rules.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 fixed bottom-1 w-full text-white text-center py-1 mt-12">
<p>Check  <strong><a href="https://github.com/MadhavaReddy-2807/Coding-Arena" target="_blank" rel="noopener noreferrer">GitHub</a></strong> to know about CP Arena  </p>
      </footer>
    </div>
  );
}