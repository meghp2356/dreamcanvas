"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";

import Sidebar, { Board } from "@/components/Sidebar";
import { getALlBoard, getAllUsers } from "@/actions/getWhiteBoardData";
import createUser from "@/actions/createUser";

// Types
type Member = {
  name: string;
  avatarInitial: string;
  online: boolean;
  activity?: string;
};

export default function DashboardPage() {
  const { user } = useClerk();

  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");


  // Fetch boards
  useEffect(() => {
    async function loadBoards() {

      if (user?.id) {
        await createUser();
      }
      const data = await getALlBoard();
      const mappedBoards: Board[] =
        data[0]?.whiteboards?.map((wb: any) => ({
          id: wb.id,
          name: wb.name,
          lastUpdated: new Date(wb.updatedAt).toLocaleString(),
          shareLink: `/board/${wb.id}`,
          members: [],
        })) || [];
      setBoards(mappedBoards);
      if (mappedBoards.length) setSelectedBoardId(mappedBoards[0].id);
    }
    loadBoards();
  }, []);

  // Fetch users for selected board
  useEffect(() => {
    if (!selectedBoardId || !user?.id) return;
    async function loadUsers() {
      const res = await getAllUsers(user!.id);
      const members: Member[] = res.users.map((u: any) => ({
        name: u.id,
        avatarInitial: u.id[0]?.toUpperCase(),
        online: true,
      }));
      setBoards((prev) =>
        prev.map((b) =>
          b.id === selectedBoardId ? { ...b, members } : b
        )
      );
    }
    loadUsers();
  }, [selectedBoardId, user?.id]);

  // Create board handler
  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    // TODO: Add board creation logic
    setNewBoardName("");
    setShowNewBoard(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800 text-white">
      <Sidebar
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
        showNewBoard={showNewBoard}
        toggleNewBoard={() => setShowNewBoard((s) => !s)}
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        onCreateBoard={handleCreateBoard}
      />
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900">
          <h1 className="text-xl font-semibold">
            {boards.find((b) => b.id === selectedBoardId)?.name || "No Board Selected"}
          </h1>
        </div>
        <div className="p-6">Canvas / Collaborators go here</div>
      </main>
    </div>
  );
}

