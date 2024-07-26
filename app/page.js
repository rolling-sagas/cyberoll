import Messages from "@/components/play/messages";
import PinnedColumns from "@/components/play/pinned-columns";

import prisma from "@/prisma/client";

export const runtime = "edge";

export default async function Page() {
  const res = await prisma.session.findMany();
  console.log(res);

  return (
    <>
      <Messages />
      <PinnedColumns />
    </>
  );
}
