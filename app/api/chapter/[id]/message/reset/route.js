import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

export async function POST(req, { params }) {
  const sid = parseInt(params.id);
  const mid = parseInt(params.mid);

  try {
    // find existing message which entry field is true
    const prevEntry = await prisma.message.findFirst({
      where: { chapterId: sid, entry: true },
      orderBy: { createdAt: "asc" },
    });

    if (!prevEntry) {
      throw { type: "not-found", message: "chapter entry point not found" }
    }

    const res = await prisma.message.deleteMany({
      where: { chapterId: sid, id: { gt: prevEntry.id } }
    })
    console.log("delete result", res)

    return Response.json({ ok: true });
  } catch (e) {
    console.log(e);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
