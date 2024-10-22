import prisma from "@/prisma/client";
import { isKnownError } from "@/app/api/common";

export const runtime = "edge";
const LIST_LIMIT = 512;

export async function POST(req, { params }) {
  const sid = parseInt(params.id)
  console.log("duplicate this story - id:", sid);
  // get the 'refresh' search params
  let reset = req.nextUrl.searchParams.get('reset')
  if (reset && reset === "true") {
    console.log("reset the template")
    reset = true
  } else {
    reset = false
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id: sid },
      include: {
        chapters: {
          include: {
            messages: true,
            properties: true
          }
        },
        properties: true
      },
    })

    // delete story's id
    delete story.id
    // delete chapter's id and storyId
    story.chapters = story.chapters.map(ch => {
      delete ch.id
      delete ch.storyId
      // delete message's id and chapterId
      ch.messages = ch.messages.map(msg => {
        delete msg.id
        delete msg.chapterId
        return msg
      })
      // delete property's id and chapterId
      ch.properties = ch.properties.map(prop => {
        delete prop.id
        delete prop.chapterId
        return prop
      })
      return ch
    })

    const { data } = await req.json()

    const chapters = story.chapters.map(ch => {
      return {
        name: ch.name,
        description: ch.description,
      }
    })

    // insert the new story
    // CAN'T nested createMany: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#create-multiple-records-and-multiple-related-records
    // So, we have to do it manually
    const res = await prisma.story.create({
      data: {
        name: data.name,
        description: data.description,
        chapters: {
          createMany: {
            data: chapters
          }
        },
        properties: {
          createMany: {
            data: story.properties
          }
        }
      },
      include: {
        chapters: true,
        properties: true
      }
    })

    console.log("create result:", res)
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
