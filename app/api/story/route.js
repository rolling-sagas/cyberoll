import prisma from "@/prisma/client";

export const runtime = "edge";

const LIST_LIMIT = 12;

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
    return Response.json(
      {
        message: "Error list stories",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
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
    return Response.json(
      {
        message: "Error create story",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
