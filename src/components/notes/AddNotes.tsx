import { useClerk } from "@clerk/nextjs";
import {useState} from "react";


export default function AddNotes() {
  const [label , setLabel] = useState("")
  const {user} = useClerk()

  const handleNoteSumbit = async  ( formData: FormData) => {
    const label = formData.get("note-input")
    if(typeof label === "string") {
      setLabel(label)
      console.log(label)
    }
  }

  return (
    <form className="px-5 py-4 flex flex-col gap-3" action={handleNoteSumbit}>
      <label htmlFor="note-input" className="sr-only">
        Add note
      </label>
      <textarea
        id="note-input"
        placeholder="Add your notes..."
        className="bg-neutral-800 w-full min-h-[100px] resize-none rounded-xl text-base p-3 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        aria-multiline="true"
        name="note-input"
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 w-full rounded-xl py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-semibold transition"
      >
        + Add Note
      </button>
    </form>
  );
}
