import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";
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
      orderBy: { createdAt: "asc" },
    });

    const message = await generate(
      res.map((m) => ({ role: m.role, content: m.content })),
    );

    if (message.error) {
      throw new Error(message.error);
    }

    const insert = await prisma.message.create({
      data: {
        sessionId: id,
        role: message.role,
        content: message.content,
      },
    });

    return Response.json({ ok: true, id: insert.id });
  } catch (e) {
    console.log(e);

    return Response.json(
      {
        message: "Error generate message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
