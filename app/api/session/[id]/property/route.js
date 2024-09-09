import prisma from "@/prisma/client";
export const runtime = "edge";

import { Upload } from "@/components/images/cloudflare_upload";

const LIST_LIMIT = 512;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  try {
    const res = await prisma.property.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error list property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.id);
  const { data, update } = await req.json();
  console.log("data", data)
  try {
    if (data) {
      const res = await prisma.session.update({
        where: { id: id },
        data: {
          properties: {
            create: { ...data },
          },
          updatedAt: new Date(),
        },
        include: {
          properties: true,
        },
      });
    } else if (update) {
      console.log("update", update)
      await prisma.$transaction(update.map(u => {
        return prisma.property.update({
          where: { name_sessionId: { sessionId: id, name: u.name } },
          data: {
            value: String(u.value) // TODO:value type check
          }
        })
      }))
    }
    // const res = await prisma.message.create({
    //   data: { ...data, sessionId: id },
    //   include: include || null,
    // });
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error create property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  try {
    const data = await req.formData();
    const file = data.get("file");

    const uploadForm = new FormData();
    uploadForm.append("file", file, "session-image");

    const upload = await Upload(uploadForm);

    if (!upload.success && upload.errors) {
      throw new Error(upload.errors[0].message);
    }

    const imageId = upload.result.id;

    const name = data.get("name");
    const desc = data.get("desc");
    // const { data, include } = await req.json();
    // // console.log("new message", data.role, data.content);
    const res = await prisma.session.update({
      where: { id: id },
      data: {
        properties: {
          create: {
            name: name,
            type: "img",
            value: JSON.stringify({ id: imageId, desc }),
          },
        },
        updatedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
    console.log(res);
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error create image property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
