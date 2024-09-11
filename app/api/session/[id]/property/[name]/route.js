import prisma from "@/prisma/client";
import { Upload } from "@/components/images/cloudflare_upload";
export const runtime = "edge";

export async function GET(_, { params }) {
  const name = params.name;
  const sid = parseInt(params.id)

  try {
    const res = await prisma.property.findUnique({
      where: { name_sessionId: { name: name, sessionId: sid } }
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
  const name = params.name;
  const sid = parseInt(params.id);
  try {
    const { data, include } = await req.json();
    console.log("update:", sid, name, data);
    const res = await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          update: {
            data: data,
            where: { name_sessionId: { name: name, sessionId: sid } },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        ...include,
        properties: true,
      },
    });
    return Response.json({ ok: true });
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

export async function DELETE(req, { params }) {
  const name = params.name;
  const sid = parseInt(params.id);
  try {
    await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          delete: {
            name_sessionId: { name: name, sessionId: sid }
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
  const name = params.name;
  const sid = parseInt(params.id);
  try {
    const data = await req.formData();
    const value = JSON.parse(data.get("value"))

    const isInitial = data.get("isInitial") === "true"

    const file = data.get("file");

    let imageId = value.id;
    const desc = data.get("desc") || value.desc

    if (file) {
      const uploadForm = new FormData();
      uploadForm.append("file", file, "session-image-" + name);

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
    const res = await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          update: {
            data: update,
            where: {
              name_sessionId: { name: name, sessionId: sid }
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
