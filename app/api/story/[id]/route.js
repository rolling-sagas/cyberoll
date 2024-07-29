import prisma from "@/prisma/client";

export const runtime = "edge";

export async function GET(_, { params }) {
  const id = parseInt(params.id);

  try {
    const res = await prisma.story.findUnique({
      where: { id },
      include: { chapters: true, system: true },
    });
    if (!res) {
      return Response.json(
        {
          message: "Story not found",
        },
        { status: 404 },
      );
    }

    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error get story",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  try {
    const { data, include } = await req.json();
    const res = await prisma.story.update({
      data: data,
      include: include,
      where: {
        id: id,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error update story",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_, { params }) {
  const id = parseInt(params.id);
  try {
    await prisma.story.delete({
      where: { id: id },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error delete story",
        code: e.code ?? "UNKNOWN",
      },
      { status: 500 },
    );
  }
}
