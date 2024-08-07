import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";

export const runtime = "edge";

const LIST_LIMIT = 512;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const mid = parseInt(params.mid);

  const { limit, skip } = req.nextUrl.searchParams;

  // console.log("regenerate message:", mid);
  try {
    const prevMessages = await prisma.message.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { AND: [{ sessionId: id }, { id: { lt: mid } }] },
      orderBy: { createdAt: "asc" },
    });

    console.log("prev messages:", prevMessages.length);

    const message = await generate(prevMessages, false);

    if (message.error) {
      throw new Error(message.error);
    }

    const update = await prisma.message.update({
      data: {
        content: message.content,
      },
      where: {
        id: mid,
      },
    });

    return Response.json({ ok: true, id: update.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error regenerate message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
