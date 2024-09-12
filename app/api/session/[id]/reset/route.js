import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

const LIST_LIMIT = 512;

export const runtime = "edge";

export async function POST(req, { params }) {
  const sid = parseInt(params.id);

  try {
    // find existing message which entry field is true
    const prevEntry = await prisma.message.findFirst({
      where: { sessionId: sid, entry: true },
      orderBy: { createdAt: "asc" },
    });

    if (!prevEntry) {
      throw { type: "not-found", message: "Entry point not found" }
    }

    const props = await prisma.property.findMany({
      take: LIST_LIMIT,
      where: { sessionId: sid },
      orderBy: { createdAt: "desc" },
    });

    const update = [
      ...props
        .filter(r => r.initial !== r.value)
        .map(r => {
          return prisma.property.update({
            where: { name_sessionId: { sessionId: sid, name: r.name } },
            data: {
              value: r.initial,
            }
          })
        }),
      prisma.message.deleteMany({
        where: { sessionId: sid, id: { gt: prevEntry.id } }
      })
    ]

    await prisma.$transaction(update)
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
