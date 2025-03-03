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
  const [cfHandle, setCfHandle] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

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
              email: user?.primaryEmailAddress?.emailAddress,
              name: user.fullName,
              contestId: "",
              avatar: user?.avatar,
              cfHandle: "",
              problems: [],
            }),
          });
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      } else {
        const userData = await res.json();
        setData(userData);
        setCfHandle(userData.cfHandle || ""); // Pre-fill CF handle if it exists
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

  const updateCFHandle = async () => {
    if (!cfHandle.trim()) return;

    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users/update`,
        {
          method: "POST", // ✅ Match backend method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            cfHandle,
          }),
        }
      );
      

      if (!res.ok) throw new Error("Failed to update CF handle");

      setMessage("Codeforces handle updated successfully!");
    } catch (error) {
      console.error("Error updating CF handle:", error);
      setMessage("Failed to update handle. Try again.");
    } finally {
      setUpdating(false);
    }
  };

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

        {/* Profile Update Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Update Profile</h3>
          <div className="flex items-center gap-4 mt-4">
            <input
              type="text"
              value={cfHandle}
              onChange={(e) => setCfHandle(e.target.value)}
              placeholder="Enter your Codeforces handle"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
            />
            <button
              onClick={updateCFHandle}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              disabled={updating}
            >
              {updating ? "Updating..." : "Save"}
            </button>
          </div>
          {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
        </div>

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
