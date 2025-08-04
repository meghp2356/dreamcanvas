// app/actions/createWhiteboard.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export default async function getWhiteBoard(id : string) {
   const {userId} = await auth()

   if(!userId) throw Error("unauthorized user")

   const board = await prisma.whiteboard.findUnique({
    where : {
        id ,
        userId
    },
   })

   if(!board) throw Error("board doesnt exists")

    return board
}
