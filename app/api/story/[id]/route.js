import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

export async function DELETE(_, { params }) {
  const id = parseInt(params.id);
  try {
    await prisma.story.delete({
      where: { id: id },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
