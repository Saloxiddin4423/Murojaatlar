const { Markup } = require("telegraf");

function adminMenu(isSuper = false) {
  const buttons = [
    ["📊 Murojaatlar soni"],
    ["📥 Excel yuklab olish"]
  ];

  if (isSuper) {
    buttons.push(["➕ Admin qo‘shish", "➖ Admin o‘chirish"]);
    buttons.push(["👥 Adminlar ro‘yxati"]);
  }

  buttons.push(["⬅️ Orqaga"]);

  return Markup.keyboard(buttons).resize();
}

module.exports = { adminMenu };