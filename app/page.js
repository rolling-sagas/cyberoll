import Messages from "@/components/play/messages";
import PinnedColumns from "@/components/play/pinned-columns";

import prisma from "@/components/prisma/client";

export const runtime = "edge";

export default async function Page() {
  const res = await prisma.session.findMany({
    include: { system: true },
  });
  console.log(res);

  return (
    <>
      <Messages />
      <PinnedColumns />
    </>
  );
}
