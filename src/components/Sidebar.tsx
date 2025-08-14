"use client";

import NewBoardForm from "@/components/NewBoardForm";

export type Board = {
  id: string;
  name: string;
  lastUpdated: string;
  members: any[];
  shareLink: string;
};

export default function Sidebar({
  boards,
  selectedBoardId,
  onSelectBoard,
  showNewBoard,
  toggleNewBoard,
  newBoardName,
  setNewBoardName,
  onCreateBoard,
}: {
  boards: Board[];
  selectedBoardId: string;
  onSelectBoard: (id: string) => void;
  showNewBoard: boolean;
  toggleNewBoard: () => void;
  newBoardName: string;
  setNewBoardName: (name: string) => void;
  onCreateBoard: () => void;
}) {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-slate-900 border-r border-slate-700 p-6 gap-6">
      <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        Dreamboard
      </h1>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="uppercase text-xs tracking-wide text-gray-400">
          Your Boards
        </h2>
        <button
          onClick={toggleNewBoard}
          className="text-xs bg-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-500 transition"
        >
          + New
        </button>
      </div>

      {/* New board input */}
      {showNewBoard && (
        <NewBoardForm
          onBoardCreated={() => {
             toggleNewBoard(); // hides form
            // reloadBoards();
          }}
        />
      )}

      {/* Board list */}
      <nav className="flex flex-col gap-2 overflow-y-auto">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => onSelectBoard(board.id)}
            className={`px-3 py-2 rounded-lg text-sm transition ${
              board.id === selectedBoardId
                ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >
            {board.name}
          </button>
        ))}
      </nav>

      <div className="mt-auto text-xs text-gray-500">
        © {new Date().getFullYear()} Dreamboard
      </div>
    </aside>
  );
}
