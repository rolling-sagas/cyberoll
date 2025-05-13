import { isKnownError } from '@/app/api/common';
import prisma from '@/prisma/client';

export const runtime = 'edge';

export async function GET(_, { params }) {
  try {
    const { id } = params; // story id
    const res = await prisma.story.findUnique({
      where: { id },
    });
    return Response.json(res);
  } catch (e) {
    // console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { data } = await req.json();

    await prisma.story.update({
      where: { id },
      data: data,
    });
    return Response.json({ ok: true });
  } catch (e) {
    // console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;
  try {
    await prisma.story.delete({
      where: { id },
    });
    return Response.json({ ok: true });
  } catch (e) {
    // console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 });
  }
}
