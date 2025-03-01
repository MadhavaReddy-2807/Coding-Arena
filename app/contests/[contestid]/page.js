"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ContestHeader from "@/components/ContestHeader/ContestHeader";
import { toast } from "sonner";

const Page = () => {
  const { contestid } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false); // Track if contest has ended

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}contests/${contestid}`);
        if (!res.ok) throw new Error("Failed to fetch contest data");

        const data = await res.json();
        setContest(data);

        if (user) {
          const isUserRegistered = data.participants?.some(
            (participant) => participant.email === user.primaryEmailAddress?.emailAddress
          );
          setIsRegistered(isUserRegistered);
        }

        const contestStartTime = new Date(`${data.startDate}T${data.startTime}:00`);
        const contestEndTime = new Date(`${data.startDate}T${data.endTime}:00`);
        const currentTime = new Date();

        setHasStarted(currentTime >= contestStartTime);
        setHasEnded(currentTime >= contestEndTime); // Set hasEnded
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestid) fetchContest();
  }, [contestid, user]);

  const handleRegister = async () => {
    if (!user) {
      toast.error("You must be logged in to register!");
      return;
    }

    setIsRegistering(true);
    try {
      const participant = {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}contests/${contestid}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participant),
      });

      if (!res.ok) throw new Error("Registration failed!");

      toast.success("Successfully registered for the contest!");

      setContest((prev) => (prev ? { ...prev, participants: [...(prev.participants || []), participant] } : prev));
      setIsRegistered(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoToContest = () => {
    router.push(`/contests/${contestid}/problems`);
  };

  if (loading) return <p className="text-center text-lg">Loading contest details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <ContestHeader />
      <div className="min-h-screen mt-16 flex flex-col items-center bg-gray-100 py-16 px-6">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-4">{contest.name}</h1>

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
          <p className="text-md text-gray-700 italic mt-6 text-center px-4">"{contest.aim}"</p>

          {/* Contest Details Grid */}
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="bg-white shadow-md p-5 rounded-xl text-center">
              <p className="text-xl font-semibold text-gray-900">📅 Start Date</p>
              <p className="text-gray-600">{contest.startDate}</p>
            </div>

            <div className="bg-white shadow-md p-5 rounded-xl text-center">
              <p className="text-xl font-semibold text-gray-900">⏰ Time</p>
              <p className="text-gray-600">
                {contest.startTime} - {contest.endTime}
              </p>
            </div>
          </div>

          {/* Number of Registrations */}
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-900">
              🏆 Registered Participants: <span className="text-blue-600">{contest.participants?.length || 0}</span>
            </p>
          </div>

          {/* Register or Go to Contest */}
          <div className="flex justify-center mt-8">
            {hasStarted ? (
              isRegistered ? (
                <button
                  onClick={handleGoToContest}
                  className="px-6 py-3 font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                >
                  {hasEnded ? "📜 View Contest (Ended)" : "🎯 Go to Contest"}
                </button>
              ) : (
                <p className="text-red-500 font-semibold">You are not registered for this contest.</p>
              )
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistered || isRegistering}
                className={`px-6 py-3 font-bold rounded-xl transition ${
                  isRegistered
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
                }`}
              >
                {isRegistered ? "✅ Registered" : isRegistering ? "Registering..." : "🚀 Register Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;