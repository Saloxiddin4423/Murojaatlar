const { isSuperAdmin } = require("../config/admin");
const { adminMenu } = require("../keyboards/adminKeyboard");
const {
  addAdmin,
  removeAdmin,
  isAdmin,
  getAdmins
} = require("../services/adminService");

const {
  getAppealsCount,
  getAllAppeals
} = require("../services/appealService");

const { createAppealsExcel } = require("../services/excelService");

function adminHandler(bot) {
  bot.command("admin", async (ctx) => {
    const userId = ctx.from.id;

    const superAdmin = isSuperAdmin(userId);
    const admin = await isAdmin(userId);

    if (!superAdmin && !admin) {
      return ctx.reply("❌ Siz admin emassiz.");
    }

    return ctx.reply("Admin panelga xush kelibsiz.", adminMenu(superAdmin));
  });

  bot.hears("📊 Murojaatlar soni", async (ctx) => {
    const userId = ctx.from.id;

    if (!isSuperAdmin(userId) && !(await isAdmin(userId))) return;

    const count = await getAppealsCount();
    return ctx.reply(`📊 Jami murojaatlar: ${count} ta`);
  });

  bot.hears("📥 Excel yuklab olish", async (ctx) => {
    const userId = ctx.from.id;

    if (!isSuperAdmin(userId) && !(await isAdmin(userId))) return;

    const appeals = await getAllAppeals();

    if (!appeals.length) {
      return ctx.reply("Hozircha murojaatlar yo‘q.");
    }

    const filePath = await createAppealsExcel(appeals);

    return ctx.replyWithDocument({
      source: filePath,
      filename: "murojaatlar.xlsx"
    });
  });

  bot.hears("➕ Admin qo‘shish", async (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    ctx.session.adminAction = "add";
    return ctx.reply("Admin qilinadigan odam ID sini yubor:");
  });

  bot.hears("➖ Admin o‘chirish", async (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    ctx.session.adminAction = "remove";
    return ctx.reply("O‘chiriladigan admin ID sini yubor:");
  });

  bot.hears("👥 Adminlar ro‘yxati", async (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const admins = await getAdmins();

    if (!admins.length) {
      return ctx.reply("Adminlar yo‘q.");
    }

    const text = admins
      .map((a, i) => `${i + 1}. ${a.telegramId}`)
      .join("\n");

    return ctx.reply(`👥 Adminlar:\n\n${text}`);
  });

  bot.on("text", async (ctx, next) => {
    if (!isSuperAdmin(ctx.from.id)) return next();

    const action = ctx.session.adminAction;
    if (!action) return next();

    const telegramId = ctx.message.text;

    if (!telegramId) {
      return ctx.reply("❌ ID noto‘g‘ri");
    }

    if (action === "add") {
      await addAdmin(telegramId);
      ctx.session.adminAction = null;
      return ctx.reply("✅ Admin qo‘shildi");
    }

    if (action === "remove") {
      await removeAdmin(telegramId);
      ctx.session.adminAction = null;
      return ctx.reply("✅ Admin o‘chirildi");
    }

    return next();
  });
}

module.exports = { adminHandler };