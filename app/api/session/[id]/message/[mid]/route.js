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
    return Response.json(
      {
        message: "Error get message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.mid);
  console.log("update id", params.mid);
  try {
    const { data, include } = await req.json();
    const res = await prisma.message.update({
      data: data,
      include: include || null,
      where: {
        id: id,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error update message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_, { params }) {
  const id = parseInt(params.mid);
  try {
    await prisma.message.delete({
      where: { id: id },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error delete message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
