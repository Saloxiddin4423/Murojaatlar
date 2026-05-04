const { generateApplication } = require("../services/aiService");

async function handleAI(ctx) {
  const text = ctx.message.text;

  if (text.startsWith("/")) return;

  try {
    await ctx.reply("⏳ Arizangiz tayyorlanmoqda...");

    const applicationText = await generateApplication(text);

    await ctx.reply(applicationText);
  } catch (error) {
    console.error(error);
    await ctx.reply("❌ AI orqali ariza tayyorlashda xatolik yuz berdi.");
  }
}

module.exports = { handleAI };