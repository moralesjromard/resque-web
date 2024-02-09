import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    const documentsRequestIds = event.context.params.id;
    const convertIds = documentsRequestIds.split(',').map(id => parseInt(id, 10));

    const deletedDocumentsRequest = await prisma.documentRequest.deleteMany({
      where: {
        id: {
          in: convertIds
        }
      },
    });

    return deletedDocumentsRequest;
  } catch (error) {
    console.log(error);
  }
});
