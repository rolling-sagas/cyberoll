import prisma from "@/prisma/client";

export const runtime = "edge";

const LIST_LIMIT = 12;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  console.log("session id:", params.id);

  try {
    const res = await prisma.message.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { updatedAt: "desc" },
    });
    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error list session",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { data, include } = await req.json();
    const res = await prisma.session.create({
      data: data,
      include: include,
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error create session",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
