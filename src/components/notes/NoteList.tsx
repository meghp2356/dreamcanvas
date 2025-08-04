import React from "react";

export default function NoteList() {
  return (
    <div className="flex-grow overflow-y-auto px-5 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-medium">My Notes</span>
        <span className="text-sm text-gray-400">1 note</span>
      </div>

      {/* static example; replace with dynamic mapping later */}
      <ul className="space-y-3">
        <li className="bg-neutral-800 border border-gray-700 rounded-xl p-3 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <p className="whitespace-pre-wrap flex-grow text-base leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
              fugit perspiciatis, atque corporis facilis!
            </p>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>Aug 1, 2025 10:23 AM</span>
            <div className="flex gap-3 ml-2 shrink-0 text-sm">
              <button
                aria-label="Edit note"
                className="text-indigo-400 mx-2  hover:text-white focus:outline-none"
              >
                Edit
              </button>
              <button
                aria-label="Delete note"
                className="text-red-500 mx-2 hover:text-white focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
