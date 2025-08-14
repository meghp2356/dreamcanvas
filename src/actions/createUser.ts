"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

/**
 * Ensures the current authenticated user exists in the database.
 * If not, creates a new user record.
 * Returns the user record.
 */
export default async function createUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { id: userId },
    });
  }

  return  user; 
}