const { getApplicationTitles } = require("../applications/registry");

const courtTypes = ["Jinoyat", "Iqtisodiy", "Fuqarolik"];

const courtsByType = {
  Jinoyat: [
    "Toshkent shaxar sudi",
    "Bektemir",
    "Chilonzor",
    "Mirobod",
    "Mirzo Ulug‘bek",
    "Olmazor",
    "Sergeli",
    "Shayxontohur",
    "Uchtepa",
    "Yakkasaroy",
    "Yashnobod",
    "Yunusobod",
    "Yangihayot"
  ],

  Fuqarolik: [
    "Yakkasaroy tumanlararo sudi",
    "Uchtepa tumanlararo sudi",
    "Mirobod tumanlararo sudi",
    "Mirzo Ulug‘bek tumanlararo sudi",
    "Shayxontohur tumanlararo sudi"
  ],

  Iqtisodiy: [
    "Toshkent shahar iqtisodiy sudi",
    "Toshkent viloyati iqtisodiy sudi"
  ]
};

const menuButtons = {
  appeal: "📨 Murojaat yuborish",
  application: "📝 Ariza yuborish",
  courtsInfo: "🏛 Sudlar haqida ma'lumot",
  back: "⬅️ Orqaga",
  finishPhotos: "✅ Rasmlar yuborib bo‘ldim",
  openSignature: "✍️ Imzo qo‘yish",
  finishApplication: "📄 PDF tayyorlash"
};

const applicationCourtTypes = ["Jinoyat", "Iqtisodiy", "Fuqarolik"];
const applicationTypes = getApplicationTitles();

module.exports = {
  courtTypes,
  courtsByType, // 🔥 MUHIM
  menuButtons,
  applicationCourtTypes,
  applicationTypes
};