// regenerate

import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";

const LIST_LIMIT = 512;

export async function POST(req, { params }) {
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

    let llm = "azure";

    try {
      const data = await req.json();
      llm = data.llm ? data.llm : "azure";
    } catch (e) {
      console.log("no body");
    }

    const message = await generate(prevMessages, { cache: false, llm });

    if (message.error) {
      throw message;
    }

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
    console.log(e.code);
    return Response.json(isKnownError(e), { status: 400 })
  }
}
