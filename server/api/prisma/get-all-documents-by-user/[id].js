import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  let documents = await prisma.documentRequest.findMany({
    where: { userId: event.context.params.id },
  });

  return documents;
});
