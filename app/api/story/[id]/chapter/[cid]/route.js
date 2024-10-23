import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

export async function GET(_, { params }) {
  const cid = parseInt(params.cid);

  try {
    const res = await prisma.chapter.findUniqueOrThrow({
      where: { id: cid },
    },);
    return Response.json(res);
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  const cid = parseInt(params.cid);
  const sid = parseInt(params.id)
  try {
    const { data } = await req.json();
    const res = await prisma.story.update({
      where: { id: sid },
      data: {
        chapters: {
          update: {
            where: { id: cid },
            data: data,
          }
        },
        updatedAt: new Date(),
      },
      include: {
        chapters: true
      }
    })
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function DELETE(_, { params }) {
  const cid = parseInt(params.cid);
  try {
    await prisma.story.update({
      where: { id: parseInt(params.id) },
      data: {
        chapters: {
          delete: { id: cid }
        },
        updatedAt: new Date(),
      },
      include: {
        chapters: true,
      },
    })
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
