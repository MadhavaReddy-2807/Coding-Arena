import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SK, // Ensure this is defined in your .env file
});

export async function POST(req) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Extract the room ID from the request body
    const { room } = await req.json();

    if (!room) {
      return new Response(JSON.stringify({ error: "Room ID is required" }), {
        status: 400,
      });
    }

    // Start an auth session inside your endpoint
    const session = liveblocks.prepareSession(
      user.primaryEmailAddress?.emailAddress, // Use the user's email as the user ID
      {
        userInfo: {
          name: user.firstName + " " + user.lastName, // Add user info
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl,
        },
      }
    );

    // Grant the user full access to the specified room
    session.allow(room, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Error in POST endpoint:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}