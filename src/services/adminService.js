const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addAdmin(telegramId) {
  return prisma.admin.upsert({
    where: { telegramId: String(telegramId) },
    update: {},
    create: { telegramId: String(telegramId) }
  });
}

async function removeAdmin(telegramId) {
  return prisma.admin.deleteMany({
    where: { telegramId: String(telegramId) }
  });
}

async function isAdmin(telegramId) {
  const admin = await prisma.admin.findUnique({
    where: { telegramId: String(telegramId) }
  });

  return !!admin;
}

async function getAdmins() {
  return prisma.admin.findMany({
    orderBy: { createdAt: "desc" }
  });
}

module.exports = {
  addAdmin,
  removeAdmin,
  isAdmin,
  getAdmins
};