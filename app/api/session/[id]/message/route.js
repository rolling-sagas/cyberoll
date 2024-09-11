import prisma from "@/prisma/client";
export const runtime = "edge";

const LIST_LIMIT = 512;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  try {
    const res = await prisma.message.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { id: "desc" },
    });
    return Response.json(res);
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  try {
    const { data, include } = await req.json();
    // console.log("new message", data.role, data.content);
    const res = await prisma.session.update({
      where: { id: id },
      data: {
        messages: {
          create: { ...data },
        },
        updatedAt: new Date(),
      },
      include: {
        ...include,
        messages: true,
      },
    });
    // const res = await prisma.message.create({
    //   data: { ...data, sessionId: id },
    //   include: include || null,
    // });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

