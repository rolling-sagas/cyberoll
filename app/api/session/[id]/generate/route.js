import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";
export const runtime = "edge";

const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  let llm = "azure";

  try {
    const data = await req.json();
    llm = data.llm ? data.llm : "azure";
  } catch (e) {
    console.log("no body");
  }

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
      { cache: true, llm: llm },
    );

    if (message.error) {
      console.log("error", message.error.message);
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
