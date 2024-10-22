import prisma from "@/prisma/client";
import { Upload } from "@/components/images/cloudflare_upload";
import { isKnownError } from "@/app/api/common";
export const runtime = "edge";

export async function GET(_, { params }) {
  const pid = parseInt(params.pid);

  try {
    const res = await prisma.property.findUnique({
      where: { id: pid }
    });
    if (!res) {
      return Response.json(
        {
          message: "property not found",
        },
        { status: 404 },
      );
    }

    return Response.json(res);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}

export async function POST(req, { params }) {
  const pid = parseInt(params.pid);
  const cid = parseInt(params.id);
  try {
    const { data } = await req.json();
    const res = await prisma.chapter.update({
      where: { id: cid },
      data: {
        properties: {
          update: {
            data: data,
            where: { id: pid },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error update property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_, { params }) {
  const pid = parseInt(params.pid);
  try {
    await prisma.chapter.update({
      where: { id: sid },
      data: {
        properties: {
          delete: {
            id: pid
          },
        },
        updatedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error delete property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function PUT(req, { params }) {
  const cid = parseInt(params.id);
  const pid = parseInt(params.pid);

  try {
    const data = await req.formData();
    const value = JSON.parse(data.get("value"))

    const isInitial = data.get("isInitial") === "true"

    const file = data.get("file");

    let imageId = value.id;
    const desc = data.get("desc") || value.desc

    if (file) {
      const uploadForm = new FormData();
      uploadForm.append("file", file, "chapter-image-" + name);

      const upload = await Upload(uploadForm);
      if (!upload.success && upload.errors) {
        throw new Error(upload.errors[0].message);
      }
      imageId = upload.result.id;
      console.log(" new image:", imageId)
    }

    const newName = data.get("name");
    const update = { name: newName, type: "img" }

    console.log("is initial:", isInitial)

    if (isInitial) {
      update.initial = JSON.stringify({ id: imageId, desc });
    } else {
      update.value = JSON.stringify({ id: imageId, desc });
    }
    // const { data, include } = await req.json();
    // // console.log("new message", data.role, data.content);
    const res = await prisma.chapter.update({
      where: { id: cid },
      data: {
        properties: {
          update: {
            data: update,
            where: {
              id: pid
            },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
    return Response.json({ ok: true, id: res.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
