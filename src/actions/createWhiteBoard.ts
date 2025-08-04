// app/actions/createWhiteboard.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type WhiteBoardData = {
  name: string;
  project: any;
};

export default async function createWhiteboard(data: WhiteBoardData) {
  const { name, project } = data;
  const { userId } = await auth();

  if (!userId) throw new Error("unauthorized");

  const board = await prisma.whiteboard.findFirst({
    where: { name, userId },
    select: { id: true },
  });

  if (board) throw new Error("project exits");

  try {
    return await prisma.whiteboard.create({
      data: { name: name.trim(), userId, data: project },
      select: { id: true, name: true, createdAt: true },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new Error("A board with this name already exists.");
    }
    throw e;
  }
}
