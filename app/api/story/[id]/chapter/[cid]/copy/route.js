import { isKnownError } from '@/app/api/common';
import prisma from '@/prisma/client';

export const runtime = 'edge';
const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const cid = parseInt(params.cid);
  const sid = parseInt(params.id);
  // console.log("duplicate this chapter - id:", params.id);
  // get the 'refresh' search params
  let reset = req.nextUrl.searchParams.get('reset');
  if (reset && reset === 'true') {
    // console.log("reset the template")
    reset = true;
  } else {
    reset = false;
  }

  try {
    const { data } = await req.json();
    data.storyId = sid;

    let messages = [];
    if (reset) {
      const prevEntry = await prisma.message.findFirst({
        where: { chapterId: cid, entry: true },
        orderBy: { createdAt: 'asc' },
      });

      if (!prevEntry) {
        throw { type: 'not-found', message: 'Entry point not found' };
      }

      messages = await prisma.message.findMany({
        take: LIST_LIMIT,
        where: { chapterId: cid, id: { lte: prevEntry.id } },
        orderBy: { id: 'asc' },
      });
    } else {
      messages = await prisma.message.findMany({
        take: LIST_LIMIT,
        where: { chapterId: cid },
        orderBy: { id: 'asc' },
      });
    }

    messages = messages.map((msg) => {
      delete msg.id;
      delete msg.chapterId;
      return msg;
    });

    let props = await prisma.property.findMany({
      skip: 0, // always start from 0
      take: LIST_LIMIT,
      where: { chapterId: cid },
      orderBy: { createdAt: 'desc' },
    });

    props = props.map((prop) => {
      delete prop.chapterId;
      delete prop.id;

      if (reset) {
        prop.value = prop.initial;
      }
      return prop;
    });

    const sess = await prisma.chapter.create({
      data: {
        ...data,
        messages: {
          createMany: { data: messages },
        },
        properties: {
          createMany: { data: props },
        },
      },

      include: { messages: true, properties: true },
    });

    return Response.json({ ok: true, id: sess.id });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 });
  }
}
