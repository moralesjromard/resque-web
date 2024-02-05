import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  let count = await prisma.documentRequest.count({
    where: { userId: event.context.params.id },
  });

  return count;
});
