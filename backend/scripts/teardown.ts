import { prisma } from "src/infrastructure/database";

export default async function () {
  await prisma.$disconnect();
}
