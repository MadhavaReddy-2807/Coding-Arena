"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ContestHeader from "@/components/ContestHeader/ContestHeader";
import { toast } from "sonner";

const Page = () => {
  const { contestId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}privatecontests/${contestId}`;
        const res = await fetch(url);

        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Failed to fetch: ${errorData}`);
        }

        const data = await res.json();
        setContest(data);

        if (user) {
          const isUserRegistered = data.participants?.some(
            (p) => p.email === user.primaryEmailAddress?.emailAddress
          );
          setIsRegistered(isUserRegistered);
        }

        const currentTime = new Date();
        const contestStartTime = new Date(`${data.contestDate}T${data.startTime}:00`);
        setHasStarted(currentTime >= contestStartTime);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchContest();
  }, [contestId, user]);

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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}privatecontests/${contestId}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(participant),
        }
      );

      if (!res.ok) throw new Error("Registration failed!");

      toast.success("Successfully registered for the contest!");
      setContest((prev) => ({
        ...prev,
        participants: [...(prev.participants || []), participant],
      }));
      setIsRegistered(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading contest details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <ContestHeader />
      <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-100 py-16 px-6">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
          <h1 className="text-5xl font-bold text-gray-900 text-center mb-4">{contest.name}</h1>

          <div className="text-center">
            <p className="text-lg text-gray-700">
              Hosted by <span className="text-blue-600 font-semibold">{contest.organizer}</span>
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="bg-white shadow-md p-5 rounded-xl text-center">
              <p className="text-xl font-semibold text-gray-900">📅 Start Date</p>
              <p className="text-gray-600">{contest.contestDate}</p>
            </div>

            <div className="bg-white shadow-md p-5 rounded-xl text-center">
              <p className="text-xl font-semibold text-gray-900">⏰ Time</p>
              <p className="text-gray-600">
                {contest.startTime} - {contest.endTime}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-gray-900">
              🏆 Registered Participants: <span className="text-blue-600">{contest.participants?.length || 0}</span>
            </p>
          </div>

          {/* Registration Button with "Registered" State */}
          {!hasStarted && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRegister}
                className={`px-6 py-3 text-lg font-bold rounded-xl shadow-md transition-all duration-300 ${
                  isRegistered
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:scale-105 hover:shadow-lg"
                }`}
                disabled={isRegistered || isRegistering}
              >
                {isRegistered ? "Registered" : isRegistering ? "Registering..." : "Register Now"}
              </button>
            </div>
          )}

          {/* Redirect to Problems Page if Contest Has Started */}
          {hasStarted && (
            <div className="mt-8 flex justify-center">
              {isRegistered ? (
                <button
                  onClick={() => router.push(`/CostumContests/${contestId}/problems`)}
                  className="px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Go to Problems Page
                </button>
              ) : (
                <p className="text-red-500 font-semibold">You are not registered for this contest.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
