import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";
import { isKnownError } from "@/app/api/common";

import mustache from "mustache"

export function ArrayToKeyValue(list) {
  const result = {}
  for (const item of list) {
    if (item.type === "obj" || item.type === "img") {
      try {
        result[item.name] = JSON.parse(item.value)
      } catch (e) {
        console.error("template render error")
      }
    } else if (item.type === "num") {
      result[item.name] = Number(item.value)
    } else {
      result[item.name] = item.value
    }
  }
  // console.log("key value:", list, result)
  return result
}

export const runtime = "edge";

const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const id = parseInt(params.id);

  let llm = "azure";
  let cache = true

  try {
    const data = await req.json();
    llm = data.llm ? data.llm : llm;
    cache = data.cache ? data.cache : cache
  } catch (e) {
    console.log("no post body");
  }

  try {
    const res = await prisma.message.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { id: "asc" },
    });

    const props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { createdAt: "desc" },
    })

    const view = ArrayToKeyValue(props)

    const message = await generate(
      res.map((m) => ({
        role: m.role,
        content: mustache.render(m.content, view)
      })),
      { cache: true, llm: llm },
    );

    if (message.error) {
      throw message;
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
    // console.log(e)
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
