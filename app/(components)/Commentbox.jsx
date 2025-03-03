"use client";
import React from "react";
import { Composer, Thread } from "@liveblocks/react-ui";
import { useThreads } from "@liveblocks/react";

const Commentbox = () => {
  const { threads = [] } = useThreads(); // Prevent undefined error

  return (
    <div className="w-[300px] h-[350px] shadow-lg rounded-lg overflow-auto p-2 bg-white">
      {threads.length > 0 ? (
        threads.map((thread) => <Thread key={thread.id} thread={thread} />)
      ) : (
        <p className="text-center text-gray-500">No comments yet.</p>
      )}
      <Composer />
    </div>
  );
};

export default Commentbox;
