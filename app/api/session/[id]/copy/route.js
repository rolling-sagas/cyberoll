import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";
import Properties from "@/components/columns/properties/properties";

export const runtime = "edge";
const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const sid = parseInt(params.id);
  console.log("update id", params.id);
  try {
    const { data } = await req.json();

    let messages = await prisma.message.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: sid },
      orderBy: { id: "asc" },
    });

    messages = messages.map(msg => {
      delete msg.id
      delete msg.sessionId
      return msg
    })

    let props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { sessionId: sid },
      orderBy: { createdAt: "desc" },
    })

    props = props.map(prop => {
      delete prop.sessionId
      return prop
    })

    const sess = await prisma.session.create({
      data: {
        ...data,
        messages: {
          createMany: { data: messages }
        },
        properties: {
          createMany: { data: props }
        }
      },

      include: { messages: true, properties: true },
    });

    return Response.json({ ok: true, id: sess.id });
  } catch (e) {
    return Response.json(isKnownError(e), { status: 400 })
  }
}
