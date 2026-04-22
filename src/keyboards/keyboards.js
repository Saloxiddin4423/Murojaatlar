const { Markup } = require("telegraf");
const { districts } = require("../config/constants");

function mainMenu() {
  return Markup.keyboard([["📨 Murojaat yuborish"]]).resize();
}

function courtKeyboard() {
  return Markup.keyboard([
    ["Jinoyat", "Iqtisodiy"],
    ["Fuqarolik", "Ma'muriy"],
    ["⬅️ Orqaga"]
  ]).resize();
}

function districtKeyboard() {
  const rows = [];
  for (let i = 0; i < districts.length; i += 2) {
    rows.push(districts.slice(i, i + 2));
  }
  rows.push(["⬅️ Orqaga"]);
  return Markup.keyboard(rows).resize();
}

module.exports = { mainMenu, courtKeyboard, districtKeyboard };