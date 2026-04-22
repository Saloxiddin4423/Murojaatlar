const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function saveAppeal(form, telegramId) {
  let user = await prisma.user.findUnique({
    where: { telegramId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId,
        fullName: form.fullName,
        phone: form.phone
      }
    });
  } else {
    user = await prisma.user.update({
      where: { telegramId },
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

module.exports = { saveAppeal };