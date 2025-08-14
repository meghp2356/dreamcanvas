// app/actions/joinWhiteboard.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

/**
 * Ensures the current authenticated user is linked to the given whiteboard.
 * Creates the user if not present, and connects them to the board.
 */
export default async function joinWhiteboard(boardId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Make sure the board exists
  const board = await prisma.whiteboard.findUnique({
    where: { id: boardId },
    select: { id: true },
  });
  if (!board) throw new Error("Board not found");

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  // Check if already connected
  const alreadyConnected = await prisma.whiteboard.findFirst({
    where: {
      id: boardId,
      users: {
        some: { id: userId },
      },
    },
    select: { id: true },
  });

  if (!alreadyConnected) {
    await prisma.whiteboard.update({
      where: { id: boardId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  return { success: true, boardId };
}
