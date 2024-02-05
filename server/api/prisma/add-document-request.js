import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const res = await prisma.documentRequest.create({
    data: {
      userId: body.userId,
      documentType: body.documentType,
      purpose: body.purpose,
    },
  });

  return res;
});
