import {useState} from 'react'
import { motion } from "framer-motion";
import createWhiteboard from '@/actions/createWhiteBoard';
import { useRouter } from 'next/navigation';


export default function CreateBoard() {
    const [boardName , setBoardName] = useState("") 
    const nav = useRouter()

    const handleSubmit = async() => {
      const board = await createWhiteboard({name : boardName , project : {}})
      nav.push(`/board/${board.id}`)
    }
  return (
    <div>
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
                      <div className="flex flex-col gap-2">
                        <input
                          autoFocus
                          value={boardName}
                          onChange={(e : React.ChangeEvent<HTMLInputElement> ) => setBoardName(e.target.value)}
                          placeholder="Board name"
                          className="w-full bg-slate-800 px-3 py-2 rounded-lg text-sm placeholder:text-gray-500 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            //   createBoard();
                            }
                            if (e.key === "Escape") {
                              
                            }
                          }}
                        />
                        <button
                          onClick={handleSubmit}
                          className="w-full px-3 py-2 bg-indigo-500 rounded-lg text-sm font-semibold disabled:opacity-50"
                        >
                          Create
                        </button>
                        <div className="text-xs text-gray-400">Enter to create, Esc to cancel.</div>
                      </div>
        </motion.div>
    </div>
  )
}
