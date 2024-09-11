import prisma from "@/prisma/client";
import { isKnownError } from "../../common";

export const runtime = "edge";

export async function GET(_, { params }) {
  const id = parseInt(params.id);

  try {
    const res = await prisma.session.findUniqueOrThrow({
      where: { id },
    },);
    return Response.json(res);
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  console.log("update id", params.id);
  try {
    const { data, include } = await req.json();
    const res = await prisma.session.update({
      data: data,
      include: include || null,
      where: {
        id: id,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function DELETE(_, { params }) {
  const id = parseInt(params.id);
  try {
    await prisma.session.delete({
      where: { id: id },
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
