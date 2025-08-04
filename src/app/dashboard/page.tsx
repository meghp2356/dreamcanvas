"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/nextjs";
import CreateBoard from "@/components/dashboard/createBoard"


type Member = {
  name: string;
  avatarInitial: string;
  online: boolean;
  activity?: string;
};

type Board = {
  id: string;
  name: string;
  lastUpdated: string;
  members: Member[];
  smartInsights: string[];
};

export default function DashboardPage() {
  // initial static boards
  const defaultBoards: Board[] = [
    {
      id: "b1",
      name: "Project Vision",
      lastUpdated: "5 minutes ago",
      members: [
        { name: "Megh Patel", avatarInitial: "M", online: true, activity: "Editing canvas" },
        { name: "Sneli Tiwari", avatarInitial: "S", online: true, activity: "Viewing board" },
        { name: "Rohan", avatarInitial: "R", online: false },
      ],
      smartInsights: [
        "Users drop off during onboarding; consider simplifying step 2.",
        "AI suggests adding a 'Quick Start' tooltip for first-time visitors.",
        "Recent activity clustered around feature prioritization—highlight top 3.",
      ],
    },
    {
      id: "b2",
      name: "Q3 Goals",
      lastUpdated: "1 day ago",
      members: [
        { name: "Megh Patel", avatarInitial: "M", online: true, activity: "Commenting" },
        { name: "Anita", avatarInitial: "A", online: false },
      ],
      smartInsights: ["Goal alignment is 80%; suggest a sync meeting.", "Revenue projection needs review."],
    },
  ];

  const {user} =  useClerk()

  const [boards, setBoards] = useState<Board[]>(defaultBoards);
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0].id);
  const selectedBoard = boards.find((b) => b.id === selectedBoardId)!;

  // create flow
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  // join flow
  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [joinBoardId, setJoinBoardId] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  // activity filters
  const [activityFilter, setActivityFilter] = useState<"All" | "AI" | "You">("All");
  const [showAIPanel, setShowAIPanel] = useState(true);

  const createBoard = () => {
    if (!newBoardName.trim()) return;
    const id = `b_${Date.now()}`;
    const newBoard: Board = {
      id,
      name: newBoardName.trim(),
      lastUpdated: "Just now",
      members: [{ name: "Megh Patel", avatarInitial: "M", online: true, activity: "Owner" }],
      smartInsights: ["No insights yet. Start by adding something to the canvas."],
    };
    setBoards((prev) => [newBoard, ...prev]);
    setSelectedBoardId(id);
    setNewBoardName("");
    setShowNewBoard(false);
  };

  const handleJoin = () => {
    setJoinError(null);
    const target = boards.find((b) => b.id === joinBoardId.trim());
    if (!target) {
      setJoinError("Board not found. Check the ID and try again.");
      return;
    }
    const already = target.members.find((m) => m.name === "Megh Patel");
    if (!already) {
      target.members.push({
        name: "Megh Patel",
        avatarInitial: "M",
        online: true,
        activity: "Joined board",
      });
      target.lastUpdated = "Just now";
      setBoards((prev) => [...prev]);
    }
    setSelectedBoardId(target.id);
    setJoinBoardId("");
    setShowJoinPanel(false);
  };



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 hidden md:flex flex-col bg-slate-900 border-r border-slate-700 p-6 gap-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Dreamboard
            </span>
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wide text-gray-400">Your Boards</div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowNewBoard((s) => !s)}
                className="text-xs bg-indigo-600 px-2 py-1 rounded-full hover:bg-indigo-500 transition"
              >
                + New
              </button>
              <button
                onClick={() => {
                  setShowJoinPanel((s) => !s);
                  setJoinError(null);
                  setJoinBoardId("");
                }}
                className="text-xs bg-gray-700 px-2 py-1 rounded-full hover:bg-slate-800 transition"
              >
                Join
              </button>
            </div>
          </div>

          {showNewBoard && (
            <CreateBoard />
          )}

          {showJoinPanel && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
              <div className="flex flex-col gap-2">
                <input
                  placeholder="Board ID (e.g., b1 or b_... )"
                  value={joinBoardId}
                  onChange={(e) => setJoinBoardId(e.target.value)}
                  className="w-full bg-slate-800 px-3 py-2 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleJoin();
                    }
                    if (e.key === "Escape") {
                      setShowJoinPanel(false);
                      setJoinBoardId("");
                    }
                  }}
                />
                <button
                  onClick={handleJoin}
                  disabled={!joinBoardId.trim()}
                  className="w-full px-3 py-2 bg-indigo-500 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Join
                </button>
                {joinError && <div className="text-xs text-red-400">{joinError}</div>}
                <div className="text-xs text-gray-400">
                  Ask someone to share the board ID to join. Existing boards only.
                </div>
              </div>
            </motion.div>
          )}

          {boards.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBoardId(b.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition break-words ${
                b.id === selectedBoardId
                  ? "bg-indigo-500/10 text-indigo-300 font-semibold"
                  : "text-gray-300 hover:bg-slate-800"
              }`}
            >
              <div className="truncate">{b.name}</div>
              <div className="text-xs text-gray-400">●</div>
            </div>
          ))}
        </div>

        <div className="flex-grow" />

        <div className="text-sm text-gray-400">v1.0.0</div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-xl font-semibold">{selectedBoard.name}</div>
            <div className="text-sm text-gray-400">Last updated {selectedBoard.lastUpdated}</div>
            <div className="px-2 py-1 bg-indigo-600/20 rounded-full text-xs font-medium">
              Smart Insights Active
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative">
              <input
                placeholder="Search inside board..."
                className="bg-slate-800 px-4 py-2 rounded-full text-sm w-60 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">⌘K</div>
            </div>
            <button aria-label="Notifications" className="relative p-2 rounded-full hover:bg-slate-800 transition">
              🔔
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-indigo-400 ring-1 ring-slate-900" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">{user?.username}</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                M
              </div>
            </div>
          </div>
        </div>

        {/* Body grid */}
        <div className="px-6 py-8 flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left big canvas + AI strip */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Canvas header with quick AI prompt */}
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-semibold">Canvas</h2>
                  <div className="text-sm text-gray-400">Live collaborative drawing & structure</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="text-xs bg-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                    💡 Smart suggestion: "Add onboarding flow outline"
                  </div>
                  <button className="text-sm bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
                    Apply suggestion
                  </button>
                </div>
              </div>

              {/* Canvas + AI assistant mini panel */}
              <div className="flex gap-6">
                {/* Canvas placeholder */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-br from-neutral-800 to-slate-800 shadow-md flex flex-col">
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-16 bg-indigo-500 rounded-full" />
                      <div className="text-xs text-gray-400 ml-auto">Live</div>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center text-sm text-gray-300 overflow-hidden">
                      Collaborative canvas goes here (tldraw embed)
                    </div>
                    <div className="mt-2 flex gap-3 flex-wrap">
                      <div className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs flex items-center gap-1">
                        + Comment
                      </div>
                      <div className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs flex items-center gap-1">
                        + @mention
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant panel */}
                <div className="w-80 flex flex-col bg-gradient-to-br from-neutral-900 to-slate-900 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                    <div className="text-lg font-semibold">AI Assistant</div>
                    <button
                      aria-label="Collapse"
                      onClick={() => setShowAIPanel((s) => !s)}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {showAIPanel ? "Hide" : "Show"}
                    </button>
                  </div>
                  {showAIPanel ? (
                    <div className="flex flex-col flex-grow p-4 gap-3 overflow-y-auto">
                      <div className="text-xs text-gray-400 mb-1">Quick prompts</div>
                      <div className="flex flex-col gap-2">
                        <div className="bg-neutral-800 rounded-lg p-3 text-sm">
                          "Summarize recent changes on this board."
                        </div>
                        <div className="bg-neutral-800 rounded-lg p-3 text-sm">
                          "Generate a roadmap from current insights."
                        </div>
                        <div className="bg-neutral-800 rounded-lg p-3 text-sm">
                          "Explain drop-off in onboarding flow."
                        </div>
                      </div>
                      <div className="mt-auto">
                        <form className="flex gap-2">
                          <input
                            placeholder="Ask AI anything..."
                            className="flex-grow bg-slate-800 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-500 transition">
                            Ask
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-xs text-gray-400">AI Assistant collapsed. Click show to expand.</div>
                  )}
                </div>
              </div>

              {/* Smart Insights */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Smart Insights</h2>
                  <button className="text-sm text-indigo-400 hover:underline">Refresh</button>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {selectedBoard.smartInsights.map((insight, i) => (
                    <div
                      key={i}
                      className="relative bg-gradient-to-br from-neutral-800 to-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col shadow-sm break-words"
                    >
                      <div className="absolute top-2 right-2 text-xs bg-indigo-600 px-2 py-1 rounded-full">
                        AI
                      </div>
                      <p className="text-sm leading-relaxed">{insight}</p>
                      <div className="text-xs text-gray-400 mt-2">Suggested action</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: collaborators + activity */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Collaborators */}
              <div className="bg-gradient-to-br from-neutral-800 to-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold">Collaborators</div>
                  <div className="flex gap-3">
                    <button className="text-sm text-indigo-400 hover:underline">Invite</button>
                    <button className="text-sm bg-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-500 transition">
                      Start Call
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mb-3">
                  {selectedBoard.members.map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center gap-3 bg-slate-900 rounded-full px-3 py-2 text-sm"
                    >
                      <div className="relative">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold ${
                            m.online
                              ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                              : "bg-slate-700"
                          }`}
                        >
                          {m.avatarInitial}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-slate-900 ${
                            m.online ? "bg-green-400" : "bg-gray-600"
                          }`}
                          aria-label={m.online ? "Online" : "Offline"}
                        />
                      </div>
                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="truncate font-medium">{m.name}</div>
                        <div className="text-xs text-gray-400">
                          {m.online ? m.activity || "Online" : "Offline"}
                        </div>
                      </div>
                      <div className="text-xs text-indigo-400">● Live</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Presence, commenting, and peer-editing happen in real time.
                </div>
              </div>

              {/* Activity feed with filter tabs */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Board Activity</h2>
                    <div className="flex gap-1 text-xs">
                      {["All", "AI", "You"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setActivityFilter(f as any)}
                          className={`px-3 py-1 rounded-full font-medium transition ${
                            activityFilter === f
                              ? "bg-indigo-500 text-white"
                              : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="text-sm text-indigo-400 hover:underline">See all</button>
                </div>
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[360px]">
                  <ActivityItem action="Edited" target="Canvas layout" when="10 minutes ago" type="You" />
                  <ActivityItem
                    action="Suggested"
                    target="Add onboarding tip"
                    when="25 minutes ago"
                    type="AI"
                  />
                  <ActivityItem action="Added note" target="Onboarding flow idea" when="35 minutes ago" type="You" />
                  <ActivityItem action="Shared" target="Board with Sneli" when="Yesterday" type="You" />
                  <ActivityItem action="Pinned" target="Key KPI list" when="2 days ago" type="AI" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-6 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Dreamboard. All rights reserved.
        </div>
      </div>
    </div>
  );
}

/* reusable activity item */
function ActivityItem({
  action,
  target,
  when,
  type,
}: {
  action: string;
  target: string;
  when: string;
  type: "AI" | "You" | string;
}) {
  const badge =
    type === "AI" ? (
      <div className="text-[10px] bg-indigo-600 px-2 py-1 rounded-full inline-block mr-2">AI</div>
    ) : type === "You" ? (
      <div className="text-[10px] bg-green-500 px-2 py-1 rounded-full inline-block mr-2">You</div>
    ) : null;

  return (
    <div className="flex gap-3 bg-slate-800 border border-slate-700 rounded-xl p-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold">
          {action[0]}
        </div>
      </div>
      <div className="flex flex-col flex-grow text-sm min-w-0">
        <div className="truncate flex items-center gap-1">
          {badge}
          <span className="font-medium">{action}</span>{" "}
          <span className="text-gray-300">{target}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">{when}</div>
      </div>
    </div>
  );
}
