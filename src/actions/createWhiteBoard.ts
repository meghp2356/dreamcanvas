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

  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in DB
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  try {
    return await prisma.whiteboard.create({
      data: {
        name: name.trim(),
        data: project,
        users: {
          connect: { id: userId }, // link the creator to the board
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new Error("A board with this name already exists.");
    }
    throw e;
  }
}
