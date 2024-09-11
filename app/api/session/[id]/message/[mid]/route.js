import prisma from "@/prisma/client";

export const runtime = "edge";

export async function GET(_, { params }) {
  const id = parseInt(params.mid);

  try {
    const res = await prisma.message.findUnique({
      where: { id },
    });
    if (!res) {
      return Response.json(
        {
          message: "Message not found",
        },
        { status: 404 },
      );
    }

    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.mid);
  const sid = parseInt(params.id);
  // console.log("update id", sid, id);
  try {
    const { data, include } = await req.json();
    const res = await prisma.session.update({
      where: { id: sid },
      data: {
        messages: {
          update: {
            data: data,
            where: { id: id },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        ...include,
        messages: true,
      },
    });
    // const res = await prisma.message.update({
    //   data: data,
    //   include: include || null,
    //   where: {
    //     id: id,
    //   },
    // });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(isKnownError(e), { status: 400 })
  }
}

export async function DELETE(req, { params }) {
  const sid = parseInt(params.id);
  const id = parseInt(params.mid);

  const url = new URL(req.url);
  const below = new URLSearchParams(url.search).get("below") === "true";

  if (below) {
    console.log("delete below", id);
    try {
      await prisma.session.update({
        where: { id: sid },
        data: {
          messages: {
            deleteMany: {
              id: { gt: id },
            },
          },
          updatedAt: new Date(),
        },
        include: {
          messages: true,
        },
      });
      // await prisma.message.deleteMany({
      //   where: { AND: [{ sessionId: sid }, { id: { gt: id } }] },
      // });
      return Response.json({ ok: true });
    } catch (e) {
      console.log(e.code, e.message);
      return Response.json(
        {
          message: "Error delete messages",
          code: e.code ?? "UNKNOWN",
        },
        { status: 400 },
      );
    }
  } else {
    try {
      await prisma.session.update({
        where: { id: sid },
        data: {
          messages: {
            delete: {
              id: id,
            },
          },
          updatedAt: new Date(),
        },
        include: {
          messages: true,
        },
      });
      return Response.json({ ok: true });
    } catch (e) {
      console.log(e.code, e.message);
      return Response.json({ error: isKnownError(e) }, { status: 400 })
    }
  }
}
