import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  try {
    const res = await prisma.property.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { chapterId: id },
      orderBy: { createdAt: "desc" },
    });

    await prisma.$transaction(res
      .filter(r => r.initial !== r.value)
      .map(r => {
        return prisma.property.update({
          where: { name_chapterId: { chapterId: id, name: r.name } },
          data: {
            value: r.initial,
          }
        })
      }))
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e)
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
