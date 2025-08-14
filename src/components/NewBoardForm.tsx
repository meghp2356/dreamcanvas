// "use client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import createWhiteboard from "@/actions/createWhiteBoard";

// export default function NewBoardForm({
//   onBoardCreated,
// }: {
//   onBoardCreated?: () => void;
// }) {
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   async function handleCreate() {
//     if (!name.trim()) return;
//     setError("");

//     startTransition(async () => {
//       try {
//         const board = await createWhiteboard({ name, project: {} });
//         setName("");
//         onBoardCreated?.();
//         router.push(`/board/${board.id}`); // redirect to the new board
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//       }
//     });
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       <input
//         type="text"
//         placeholder="New board name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full bg-slate-800 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         onKeyDown={(e) => {
//           if (e.key === "Enter") handleCreate();
//           if (e.key === "Escape") setName("");
//         }}
//       />
//       <button
//         onClick={handleCreate}
//         disabled={isPending || !name.trim()}
//         className="w-full bg-indigo-600 px-3 py-2 rounded-md text-sm font-semibold disabled:opacity-50 hover:bg-indigo-500 transition"
//       >
//         {isPending ? "Creating..." : "Create"}
//       </button>
//       {error && <p className="text-red-400 text-xs">{error}</p>}
//     </div>
//   );
// }

"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import createWhiteboard from "@/actions/createWhiteBoard";
import { useRouter } from "next/navigation";

export default function NewBoardForm({
  open,
  onClose,
  onBoardCreated,
}: {
  open: boolean;
  onClose: () => void;
  onBoardCreated?: (board: any) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit() {
    if (!name.trim()) {
      setError("Please enter a board name");
      return;
    }
    setError("");

    startTransition(async () => {
      try {
        const newBoard = await createWhiteboard({ name, project: {} });
        setName("");
        onBoardCreated?.(newBoard);
        onClose();
        router.push(`/board/${newBoard.id}`);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Create New Board</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Board name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 rounded-md px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                  if (e.key === "Escape") onClose();
                }}
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isPending || !name.trim()}
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

