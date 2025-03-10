import prisma from "@/prisma/client";
export const runtime = "edge";

export async function POST(_, { params }) {
  const sid = parseInt(params.id);
  const mid = parseInt(params.mid);

  try {
    // find existing message which entry field is true
    const prevEntries = await prisma.message.findMany({
      where: { chapterId: sid, entry: true },
      orderBy: { createdAt: "asc" },
    });

    const transactions = []

    if (prevEntries.length > 0) {
      transactions.push(
        prisma.message.updateMany({
          where: { id: { in: prevEntries.map(p => p.id) } },
          data: { entry: false },
        }))
    }

    transactions.push(
      prisma.message.update({
        where: { id: mid },
        data: { entry: true },
      })
    )

    await prisma.$transaction(transactions)
    // console.log("update res:", res)

    return Response.json({ ok: true });
  } catch (e) {
    console.log(e);
    return Response.json({ error: isKnownError(e) }, { status: 400 })
  }
}
