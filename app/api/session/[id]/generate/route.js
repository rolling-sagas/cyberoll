import prisma from "@/prisma/client";
export const runtime = "edge";

const LIST_LIMIT = 512;

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

    // const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/cyberoll/openai`;
    const url =
      "https://gateway.ai.cloudflare.com/v1/542b0e9f0f5f5883ac3c5f297789bd6b/cyberoll/openai/chat/completions";

    const chatCompletion = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: res.map((m) => ({ role: m.role, content: m.content })),
      }),
      signal: AbortSignal.timeout(60000),
    });

    console.log(chatCompletion.status);
    const data = await chatCompletion.json();
    console.log(data);
    return Response.json(data);
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
