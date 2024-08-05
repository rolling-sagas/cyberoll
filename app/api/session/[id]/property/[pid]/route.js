import prisma from "@/prisma/client";
import { Upload } from "@/components/images/cloudflare_upload";
export const runtime = "edge";

export async function GET(_, { params }) {
  const id = parseInt(params.pid);

  try {
    const res = await prisma.property.findUnique({
      where: { id },
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
    return Response.json(
      {
        message: "Error get property",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}

export async function POST(req, { params }) {
  const id = parseInt(params.pid);
  const sid = parseInt(params.id);
  // console.log("update id", sid, id);
  try {
    const { data, include } = await req.json();
    const res = await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          update: {
            data: data,
            where: { id: id },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        ...include,
        properties: true,
      },
    });
    // const res = await prisma.message.update({
    //   data: data,
    //   include: include || null,
    //   where: {
    //     id: id,
    //   },
    // });
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

export async function DELETE(req, { params }) {
  const sid = parseInt(params.id);
  const id = parseInt(params.pid);
  try {
    await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          delete: {
            id: id,
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
  const sid = parseInt(params.id);
  const id = parseInt(params.pid);
  try {
    const data = await req.formData();
    const file = data.get("file");

    let imageId = null;

    if (file) {
      const uploadForm = new FormData();
      uploadForm.append("file", file, "session-image");

      const upload = await Upload(uploadForm);
      if (!upload.success && upload.errors) {
        throw new Error(upload.errors[0].message);
      }
      imageId = upload.result.id;
    }

    const name = data.get("name");
    let desc = data.get("desc");

    if (!desc) {
      desc = JSON.parse(data.get("value")).desc;
    }

    if (!imageId) {
      imageId = JSON.parse(data.get("value")).id;
    }
    // const { data, include } = await req.json();
    // // console.log("new message", data.role, data.content);
    const res = await prisma.session.update({
      where: { id: sid },
      data: {
        properties: {
          update: {
            data: {
              name: name,
              type: "image",
              value: JSON.stringify({ id: imageId, desc }),
            },
            where: { id: id },
          },
        },
        updatedAt: new Date(),
      },
      include: {
        properties: true,
      },
    });
    console.log(res);
    return Response.json({ ok: true, id: res.id });
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
