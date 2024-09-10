import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

export async function POST(req, { params }) {
  const sid = parseInt(params.id);
  const mid = parseInt(params.mid);

  try {
    // find existing message which entry field is true
    const prevEntry = await prisma.message.findFirst({
      where: { sessionId: sid, entry: true },
      orderBy: { createdAt: "asc" },
    });

    if (!prevEntry) {
      throw { type: "not-found", message: "thread entry point not found" }
    }

    await prisma.message.deleteMany({
      where: { sessionId: sid, id: { gt: prevEntry.id } }
    })

    return Response.json({ ok: true });
  } catch (e) {
    console.log(e);
    return Response.json(isKnownError(e), { status: 400 })
  }
}
