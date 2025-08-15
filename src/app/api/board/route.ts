import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Lazy import server action — won't run during build
    const { default: getWhiteBoard } = await import("@/actions/getWhiteBoardData");

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
    const userId = url.searchParams.get("userId");

    if (!roomId || !userId) {
      return new Response("Missing roomId or userId", { status: 400 });
    }

    const { data } = await getWhiteBoard(roomId, userId);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching whiteboard:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Lazy import if needed in the future — safe to keep consistent
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
    const data = await request.json();

    if (!roomId) {
      return new Response("Missing roomId", { status: 400 });
    }

    await prisma.whiteboard.update({
      where: {
        id: roomId,
      },
      data: data,
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error updating whiteboard:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
