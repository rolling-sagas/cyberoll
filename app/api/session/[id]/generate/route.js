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
  try {
    const { cache, llm, messages, update } = await req.json()

    const res = await prisma.message.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { id: "asc" },
    });

    // console.log("context:", res)

    let newMessages = []
    if (messages && messages.length > 0) {
      newMessages = messages.map(msg => (
        { sessionId: id, role: msg.role, content: JSON.stringify(msg.content) }
      ))

      res.push(...newMessages)
    }

    console.log("added messages:", res)

    const props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { createdAt: "desc" },
    })

    // console.log("props:", props)

    if (update && update.length > 0) {
      props.map((prop) => {
        const found = update.find(up => up.name === prop.name)
        if (found) {
          if (prop.type === "num") {
            prop.value = String(found.value)
          } else if (prop.type = "raw") {
            prop.value = JSON.stringify(found.value)
          } else {
            prop.value = found.value
          }
        }

        return prop
      })
    }

    const view = ArrayToKeyValue(props)

    const message = await generate(
      res.map((m) => ({
        role: m.role,
        content: mustache.render(m.content, view)
      })),
      { cache: cache, llm: llm },
    );

    if (message.error) {
      throw message;
    }

    await prisma.message.createMany({
      data: [...newMessages, {
        sessionId: id,
        role: message.role,
        content: message.content,
      }]
    });

    if (update && update.length > 0) {
      await prisma.$transaction(update.map(u => {
        return prisma.property.update({
          where: { name_sessionId: { sessionId: id, name: u.name } },
          data: {
            value: String(u.value) // TODO:value type check
          }
        })
      }))

    }
    return Response.json({
      ok: true, newMessages: newMessages.length > 0,
      update: update && update.length > 0
    });
  } catch (e) {
    // console.log(e)
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
