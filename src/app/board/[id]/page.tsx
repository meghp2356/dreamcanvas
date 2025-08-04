"use client";
import getWhiteBoard from "@/actions/getWhiteBoardData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TldrawEditor from "@/components/editor/tldrawEditor";

//cmdx6py460000vsog8pn0kf0p

export default function page() {
  const params = useParams();
  const id = params.id as string;

  const [project , setProject] = useState<any>()

  useEffect(() => {
    const fetchBoard = async () => {
      const board = await getWhiteBoard(id);
      setProject(board.data)
    };

    fetchBoard();
  }, []);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Drawing area */}
      <main className="flex-grow md:w-2/3 p-2">
        <TldrawEditor 
            snapShot = {project}
        />
      </main>

      {/* Sidebar */}
      <aside className="md:w-1/3 w-full flex flex-col p-2 space-y-4">
        {/* AI Assistant */}
        <div className="flex flex-col flex-grow bg-gradient-to-br from-neutral-900 to-gray-900 border border-gray-700 rounded-3xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          </div>

          <div className="flex flex-col flex-grow p-4 space-y-3 overflow-y-auto">
            {/* AI conversation example */}
            <div className="bg-neutral-800 p-3 rounded-lg text-sm text-gray-300">
              How can I help you with your canvas today?
            </div>
            <div className="bg-indigo-600 p-3 rounded-lg text-sm self-end">
              Generate a mind map for project ideas.
            </div>
            <div className="bg-neutral-800 p-3 rounded-lg text-sm text-gray-300">
              Sure! Here’s a suggested layout for your mind map…
            </div>
          </div>

          {/* AI input */}
          <form className="flex p-3 gap-2 border-t border-gray-700">
            <input
              type="text"
              placeholder="Ask AI about your canvas..."
              className="flex-grow bg-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium"
            >
              Send
            </button>
          </form>
        </div>

        {/* Collaboration Panel */}
        <div className="bg-gradient-to-br from-neutral-900 to-gray-900 border border-gray-700 rounded-3xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold tracking-tight">Collaboration</h1>
          </div>

          <div className="flex flex-col p-4 gap-3 flex-grow overflow-y-auto">
            {/* Collaborators */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold">
                M
              </div>
              <span className="text-sm">Megh Patel (You)</span>
              <span className="text-green-400 text-xs ml-auto">Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-sm">Anjali Sharma</span>
              <span className="text-green-400 text-xs ml-auto">Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center font-bold">
                R
              </div>
              <span className="text-sm">Rahul Verma</span>
              <span className="text-gray-400 text-xs ml-auto">Offline</span>
            </div>
          </div>

          {/* Invite button */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium">
              + Invite Collaborator
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
