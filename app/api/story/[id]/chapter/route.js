import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

const LIST_LIMIT = 24;

export async function GET(req, { params }) {
  try {
    const { limit, skip } = req.nextUrl.searchParams;
    const storyId = parseInt(params.id);

    const res = await prisma.chapter.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      include: {
        _count: {
          select: { messages: true },
        },
      },
      where: { storyId: storyId },
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  try {
    const storyId = parseInt(params.id);
    const { data } = await req.json();

    const res = await prisma.story.update({
      where: { id: storyId },
      data: {
        chapters: {
          create: data,
        },
        updatedAt: new Date(),
      },
      include: {
        chapters: true,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
