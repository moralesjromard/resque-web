import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const res = await prisma.complaint.create({
    data: {
      userId: body.userId,
      respondentName: body.respondent,
      crimeType: body.crimeType,
      crimeOverview: body.crimeOverview,
    },
  });

  return res;
});
