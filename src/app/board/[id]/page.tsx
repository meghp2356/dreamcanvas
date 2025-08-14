"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import TldrawEditor from "@/components/editor/TldrawEditor";
import joinWhiteboard from "@/actions/joinWhiteboard"; // <- Import the action

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    async function connectUserToBoard() {
      try {
        await joinWhiteboard(id);
      } catch (error) {
        console.error("Error joining board:", error);
      }
    }
    if (id) {
      connectUserToBoard();
    }
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Drawing area */}
      <main className="flex-grow md:w-2/3 p-2">
        <TldrawEditor roomId={id} />
      </main>

      {/* Sidebar */}
    </div>
  );
}
