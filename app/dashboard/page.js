"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users?email=${user.primaryEmailAddress?.emailAddress}`
      );
  
      if (!res.ok) {
        if (res.status === 404) {
          // User doesn't exist, create new user
          await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName,
              contestId: "",
              problems: [], 
            }),
          });
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      } else {
        const userData = await res.json();
        setData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-600 shadow-md py-4 px-6 flex justify-between items-center fixed w-full top-0 z-50">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        <nav className="flex space-x-6">
          <Link href="/" className="text-white hover:text-gray-200 font-medium">
            Home
          </Link>
          <div
            className="text-white hover:text-gray-200 font-medium cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            Analytics
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20 p-6">
        <h2 className="text-xl font-semibold">Welcome to the Dashboard!</h2>
        <p className="text-gray-700 mt-2">Manage your activities and track your progress here.</p>

        {/* Participated Contests Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Participated Contests</h3>

          {loading ? (
            <p className="text-gray-500 mt-2">Loading contests...</p>
          ) : data?.contests?.length > 0 ? (
            <div className="flex flex-col w-full gap-4 mt-4">
              {data.contests.map((contest, index) => (
                <div
                  key={index}
                  className="bg-white w-full shadow-md p-4 rounded-lg hover:shadow-lg transition-all"
                >
                  <h4 className="text-lg font-semibold">{contest.name}</h4>
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    View Contest
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">You haven't participated in any contests yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
