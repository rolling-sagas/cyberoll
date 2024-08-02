import prisma from "@/prisma/client";
export const runtime = "edge";

const LIST_LIMIT = 512;

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const mid = parseInt(params.mid);

  const { limit, skip } = req.nextUrl.searchParams;

  console.log("regenerate message:", mid);
  try {
    const prevSessions = await prisma.message.findMany({
      skip: skip ? parseInt(skip) : 0,
      take:
        limit && parseInt(limit) < LIST_LIMIT ? parseInt(limit) : LIST_LIMIT,
      where: { AND: [{ sessionId: id }, { id: { lt: mid } }] },
      orderBy: { createdAt: "asc" },
    });

    console.log("prev sessions:", prevSessions.length);

    const url = `https://gateway.ai.cloudflare.com/v1/${process.env.CLOUDFLARE_ACCOUNT_ID}/rollingsagas/openai/chat/completions`;

    const chatCompletion = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: prevSessions.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      redirect: "manual",
      duplex: "half",
      signal: AbortSignal.timeout(60000),
    });

    // console.log(chatCompletion.status);
    const data = await chatCompletion.json();
    const message = data.choices[0].message;
    const update = await prisma.message.update({
      data: {
        content: message.content,
      },
      where: {
        id: mid,
      },
    });

    return Response.json({ ok: true, id: update.id });
  } catch (e) {
    console.log(e.code, e.message);
    return Response.json(
      {
        message: "Error regenerate message",
        code: e.code ?? "UNKNOWN",
      },
      { status: 400 },
    );
  }
}
