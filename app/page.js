import Messages from "@/components/play/messages";
import PinnedColumns from "@/components/play/pinned-columns";

import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export const runtime = "edge";

export default async function Page() {
  const adapter = new PrismaD1(process.env.rsDb);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();
  console.log(users);

  return (
    <>
      <Messages />
      <PinnedColumns />
    </>
  );
}
