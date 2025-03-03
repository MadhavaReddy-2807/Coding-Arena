"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
const resolveUsers = async ({ userIds }) => {
  console.log("Fetching users:", userIds);

  if (!userIds || userIds.length === 0) return []; // Early exit

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}getusers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds }),
    });

    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);

    const users = await res.json();
    console.log("users",users);
    const userlist=users.map(user => ({
      id: user.email,
      name: user.name,
      avatar: user.avatar,
    }));
    console.log("ijvsd",userlist)
    return userlist

  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export function Room({ children, contestid }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth"   resolveUsers={resolveUsers}
  >
      <RoomProvider id={contestid}> {/* Ensure id is correctly passed */}
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
