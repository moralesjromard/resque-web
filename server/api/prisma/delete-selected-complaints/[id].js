import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async event => {
  try {
    const complaintsIds = event.context.params.id;
    const convertIds = complaintsIds.split(',').map(id => parseInt(id, 10));

    const deletedComplaints = await prisma.complaint.deleteMany({
      where: {
        id: {
          in: convertIds
        }
      },
    });

    return deletedComplaints;
  } catch (error) {
    console.log(error);
  }
});
