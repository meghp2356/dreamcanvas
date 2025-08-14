"use client";

import { useEffect, useMemo, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, ExternalLink, Loader2, PlusCircle } from "lucide-react";

import { getALlBoard, getAllUsers } from "@/actions/getWhiteBoardData";
import createUser from "@/actions/createUser";
import NewBoardForm from "@/components/NewBoardForm"; // <-- import your form

type Member = {
  name: string;
  avatarInitial: string;
  online: boolean;
};

type Board = {
  id: string;
  name: string;
  lastUpdated: string;
  shareLink: string;
  members: Member[];
};

export default function BoardsGalleryPage() {
  const { user } = useClerk();
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showNewBoard, setShowNewBoard] = useState(false); // <-- modal toggle

  // Load boards
  useEffect(() => {
    (async () => {
      setLoadingBoards(true);
      try {
        if (user?.id) await createUser(user.id);
        const data = await getALlBoard();

        const mapped: Board[] =
          data?.whiteboards?.map((wb: any) => ({
            id: wb.id,
            name: wb.name,
            lastUpdated: new Date(wb.updatedAt).toLocaleString(),
            shareLink: `/board/${wb.id}`,
            members: [],
          })) ||
          (Array.isArray(data)
            ? (data[0]?.whiteboards || []).map((wb: any) => ({
                id: wb.id,
                name: wb.name,
                lastUpdated: new Date(wb.updatedAt).toLocaleString(),
                shareLink: `/board/${wb.id}`,
                members: [],
              }))
            : []);

        setBoards(mapped);
      } finally {
        setLoadingBoards(false);
      }
    })();
  }, [user?.id]);

  // Load collaborators for each board
  useEffect(() => {
    if (!boards.length) return;
    (async () => {
      for (const b of boards) {
        setLoadingMembers((m) => ({ ...m, [b.id]: true }));
        try {
          const res = await getAllUsers(b.id);
          const members: Member[] = res.users.map((u: any) => ({
            name: u.id,
            avatarInitial: (u.id?.[0] || "U").toUpperCase(),
            online: true,
          }));
          setBoards((prev) => prev.map((x) => (x.id === b.id ? { ...x, members } : x)));
        } finally {
          setLoadingMembers((m) => ({ ...m, [b.id]: false }));
        }
        await new Promise((r) => setTimeout(r, 80));
      }
    })();
  }, [boards.length]);

  const handleCopy = async (board: Board) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + board.shareLink);
      setCopiedId(board.id);
      setTimeout(() => setCopiedId((id) => (id === board.id ? null : id)), 1200);
    } catch {
      // noop
    }
  };

  const hasBoards = useMemo(() => boards.length > 0, [boards.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b0f1a] via-[#0a0c14] to-[#0c0f1a] text-white">
      {/* Floating aurora blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #5b8cff, transparent)" }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0], opacity: [0.25, 0.35, 0.3, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(closest-side, #a855f7, transparent)" }}
        animate={{ x: [0, -15, 10, 0], y: [0, 15, -10, 0], opacity: [0.2, 0.35, 0.25, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50 bg-slate-900/70 border-b border-white/10">
        <div className="mx-auto w-full max-w-6xl px-5 py-4 flex items-center justify-between">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400"
          >
            Dreamboard
          </motion.h1>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowNewBoard(true)} // <-- open modal
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600/90 px-3 py-2 text-xs font-semibold hover:bg-indigo-500 transition"
              whileTap={{ scale: 0.97 }}
            >
              <PlusCircle size={14} />
              New Board
            </motion.button>
            <motion.span
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs md:text-sm text-slate-300"
            >
              {loadingBoards ? "Syncing..." : `${boards.length} board${boards.length === 1 ? "" : "s"}`}
            </motion.span>
          </div>
        </div>
      </header>

      {/* Boards */}
      <main className="mx-auto w-full max-w-6xl px-5 py-6">
        {!hasBoards && loadingBoards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 h-44 animate-pulse"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
        )}

        {!loadingBoards && !hasBoards && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-xl font-semibold text-white/90">No boards yet</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              Click <b>New Board</b> above to start your first one.
            </p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {hasBoards && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {boards.map((board, idx) => (
                <motion.article
                  key={board.id}
                  layout
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.06] p-4 shadow-2xl"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white/95">
                        {board.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                        Updated {board.lastUpdated}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => router.push(board.shareLink)}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-indigo-600/90 px-3 py-2 text-xs font-semibold hover:bg-indigo-500 transition"
                      whileTap={{ scale: 0.97 }}
                    >
                      Open <ExternalLink size={14} />
                    </motion.button>
                  </div>

                  <div className="relative mt-4 flex items-center justify-between">
                    <motion.button
                      onClick={() => handleCopy(board)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-xs transition"
                      whileTap={{ scale: 0.97 }}
                    >
                      <Copy size={14} />
                      {copiedId === board.id ? "Copied!" : "Copy link"}
                    </motion.button>
                    <div className="text-[11px] text-slate-400">
                      ID: <span className="text-slate-300">{board.id.slice(0, 8)}…</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* New Board Modal */}
      <NewBoardForm
        open={showNewBoard}
        onClose={() => setShowNewBoard(false)}
        onBoardCreated={(newBoard) =>
          setBoards((prev) => [
            {
              id: newBoard.id,
              name: newBoard.name,
              lastUpdated: new Date().toLocaleString(),
              shareLink: `/board/${newBoard.id}`,
              members: [],
            },
            ...prev,
          ])
        }
      />
    </div>
  );
}
