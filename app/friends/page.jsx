"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Users, Search } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const fetchCurrentUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users?email=${user.primaryEmailAddress.emailAddress}`
      );
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setNotFound(false);
    setSearchResults([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users/search?query=${searchQuery}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setSearchResults(data);
      if (data.length === 0) setNotFound(true);
    } catch (error) {
      console.error("Error searching users:", error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const addFriend = async (friendId) => {
    if (!currentUser) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/add-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          friendId: friendId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add friend");

      const newFriend = searchResults.find((user) => user._id === friendId);
      setFriends([...friends, newFriend]);
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const removeFriend = async (friendId) => {
    if (!currentUser) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/remove-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          friendId: friendId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove friend");

      setFriends(friends.filter((friend) => friend._id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const redirectToUserDashboard = (userId) => {
    router.push(`/dashboard/${userId}`);
  };

  const fetchFriends = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}users/${currentUser._id}/friends`
      );
      if (!res.ok) throw new Error("Failed to fetch friends");

      const data = await res.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen mt-10 bg-gray-100 text-gray-900">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Friends</h1>

        {/* Add Friend Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <UserPlus size={24} className="text-purple-500" />
              <h2 className="text-xl font-semibold">Add Friend</h2>
            </div>
            <div className="mt-4 flex space-x-4">
              <input
                type="text"
                placeholder="Enter friend's email or username"
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                className="bg-purple-500 text-white hover:bg-purple-600"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "Searching..." : (
                  <>
                    <Search size={16} className="mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {notFound && (
              <p className="mt-4 text-red-500 font-medium">No users found.</p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => redirectToUserDashboard(user._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.avatar || "https://via.placeholder.com/40"}
                        alt="User Avatar"
                        className="rounded-full w-10 h-10"
                      />
                      <p className="font-medium">{user.name}</p>
                    </div>

                    {friends.some(friend => friend._id === user._id) ? (
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFriend(user._id);
                        }}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="text-purple-500 border-purple-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          addFriend(user._id);
                        }}
                      >
                        Add Friend
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Friends List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Users size={24} className="text-purple-500" />
              <h2 className="text-xl font-semibold">Your Friends</h2>
            </div>
            <div className="mt-4 space-y-4">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
                    onClick={() => redirectToUserDashboard(friend._id)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={friend.avatar || "https://via.placeholder.com/40"}
                        alt="Friend Avatar"
                        className="rounded-full w-10 h-10"
                      />
                      <p className="font-medium">{friend.name}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="text-red-500 border-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFriend(friend._id);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No friends added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
