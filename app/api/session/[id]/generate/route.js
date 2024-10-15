import prisma from "@/prisma/client";
import { generate } from "@/app/api/common";
import { isKnownError } from "@/app/api/common";

import mustache from "mustache"

import { ArrayToKeyValue } from "@/components/utils";

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

    let newMessages = []
    if (messages && messages.length > 0) {
      newMessages = messages.map(msg => (
        { sessionId: id, role: msg.role, content: msg.content }
      ))

      res.push(...newMessages)
    }

    // console.log("new messages:", newMessages)

    const props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { createdAt: "desc" },
    })

    // update properties if any
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

    const context = res.map((m) => ({
      role: m.role,
      content: mustache.render(m.content, view)
    }))

    // console.log("context messages:", context)

    const message = await generate(
      context,
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
