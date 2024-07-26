import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const prismaClientSingleton = () => {
  const adapter = new PrismaD1(process.env.rsDb);
  return new PrismaClient({ adapter });
};

const globalThis = {
  prismaGlobal: null,
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
