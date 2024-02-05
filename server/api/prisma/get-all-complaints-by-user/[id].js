import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  const userId = event.context.params.id;

  const complaints = await prisma.complaint.findMany({
    where: {
      userId: userId,
    },
  });

  return complaints;
});
