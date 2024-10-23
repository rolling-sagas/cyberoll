import prisma from "@/prisma/client";
import { isKnownError } from "../common";

export const runtime = "edge";

const LIST_LIMIT = 24;

export async function GET(req) {
  const { limit, skip } = req.nextUrl.searchParams;

  try {
    const res = await prisma.story.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      orderBy: { updatedAt: "desc" },
    });
    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req) {
  try {
    const { data, include } = await req.json();
    const res = await prisma.story.create({
      data: data,
      include: include,
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

