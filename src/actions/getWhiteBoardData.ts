// app/actions/createWhiteboard.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export default async function getWhiteBoard(id : string , userId? : string) {
   if(!userId){
     const clerkAuth = await auth();
     if(!clerkAuth.userId) throw Error("unauthorized user")

     userId = clerkAuth.userId;
   }

   console.log(userId)

   const board = await prisma.whiteboard.findUnique({
    where : {
        id 
    },
    select : {
        data : true,
        users : true,
        name : true
    }
   })

   if (!board?.users.find(user => user.id === userId)) throw new Error("unauthorized user");


   console.log(board)

   if(!board) throw Error("board doesnt exists")

    return board
}


export  async function getAllUsers(id : string , userId? : string) {
   if(!userId){
     const clerkAuth = await auth();
     if(!clerkAuth.userId) throw Error("unauthorized user")

     userId = clerkAuth.userId;
   }

   console.log(userId)

   const board = await prisma.whiteboard.findUnique({
    where : {
        id 
    },
    select : {
        users : true, 
    }
   })

   console.log(board)

   if(!board) throw Error("board doesnt exists")

    return board
}

export async function getALlBoard() {
    const clerkAuth = await auth();
    if(!clerkAuth.userId) throw Error("unauthorized user")
    const userId = clerkAuth.userId;

    const boards = await prisma.user.findMany({
        where: {
            id : userId,
        },
        select: {
            whiteboards : {
                orderBy : {
                    createdAt : "desc"
                }
            }
        },
    });

    return boards;
}
