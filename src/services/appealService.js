const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function saveAppeal(form, telegramId) {
  let user = await prisma.user.findUnique({
    where: { telegramId: String(telegramId) }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: String(telegramId),
        fullName: form.fullName,
        phone: form.phone
      }
    });
  } else {
    user = await prisma.user.update({
      where: { telegramId: String(telegramId) },
      data: {
        fullName: form.fullName,
        phone: form.phone
      }
    });
  }

  const appealNumber = `MUR-${Date.now()}`;

  await prisma.appeal.create({
    data: {
      appealNumber,
      userId: user.id,
      courtType: form.courtType,
      district: form.district,
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      message: form.message
    }
  });

  return appealNumber;
}

// 🔥 YANGI FUNKSIYALAR

async function getAppealsCount() {
  return prisma.appeal.count();
}

async function getAllAppeals() {
  return prisma.appeal.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}

module.exports = {
  saveAppeal,
  getAppealsCount,
  getAllAppeals
};