import prisma from "@/prisma/client";
export const runtime = "edge";

const LIST_LIMIT = 512;
const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/cyberoll/openai`;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const { limit, skip } = req.nextUrl.searchParams;

  try {
    const res = await prisma.message.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { sessionId: id },
      orderBy: { createdAt: "asc" },
    });

    const chatCompletion = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-4o-mini",
        messages: res.map((m) => ({ role: m.role, content: m.content })),
      },
    });

    console.log(chatCompletion);
    return Response.json(chatCompletion);
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error list message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
