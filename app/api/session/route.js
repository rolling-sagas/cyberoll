import prisma from "@/prisma/client";

export const runtime = "edge";

const LIST_LIMIT = 12;

export async function GET(req) {
  const { limit } = req.nextUrl.searchParams;

  try {
    const res = await prisma.session.findMany({
      take: limit ? parseInt(limit) : LIST_LIMIT,
      orderBy: { updatedAt: "desc" },
    });
    return Response.json({ sessions: res });
  } catch (e) {
    console.log(e);
    return Response.error({ message: "Error listing sessions" });
  }
}

export async function POST(req) {
  try {
    const session = await req.json();
    const res = await prisma.session.create({
      data: session,
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    // console.log(e.message);
    return Response.json({ ok: false, message: "Error create session" });
  }
}
