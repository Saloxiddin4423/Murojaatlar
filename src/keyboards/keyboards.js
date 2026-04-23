const { Markup } = require("telegraf");
const {
  districts,
  menuButtons,
  applicationTypes
} = require("../config/constants");

function mainMenu() {
  return Markup.keyboard([
    [menuButtons.appeal, menuButtons.application],
    [menuButtons.courtsInfo]
  ]).resize();
}

function courtKeyboard() {
  return Markup.keyboard([
    ["Jinoyat", "Iqtisodiy"],
    ["Fuqarolik", "Ma'muriy"],
    [menuButtons.back]
  ]).resize();
}

function districtKeyboard() {
  const rows = [];
  for (let i = 0; i < districts.length; i += 2) {
    rows.push(districts.slice(i, i + 2));
  }
  rows.push([menuButtons.back]);
  return Markup.keyboard(rows).resize();
}

function applicationCourtKeyboard() {
  return Markup.keyboard([
    ["Jinoyat", "Ma'muriy"],
    ["Iqtisodiy", "Fuqarolik"],
    [menuButtons.back]
  ]).resize();
}

function criminalDistrictKeyboard() {
  const rows = [];
  for (let i = 0; i < districts.length; i += 2) {
    rows.push(districts.slice(i, i + 2));
  }
  rows.push([menuButtons.back]);
  return Markup.keyboard(rows).resize();
}

function applicationTypesKeyboard() {
  return Markup.keyboard([
    [applicationTypes[0]],
    [applicationTypes[1]],
    [menuButtons.back]
  ]).resize();
}

function finishPhotosKeyboard() {
  return Markup.keyboard([
    [menuButtons.finishPhotos],
    [menuButtons.back]
  ]).resize();
}

function signatureKeyboard() {
  return Markup.keyboard([
    [
      {
        text: menuButtons.openSignature,
        web_app: { url: process.env.WEBAPP_URL } // 🔥 TO‘G‘RI FORMAT
      }
    ],
    [menuButtons.finishApplication],
    [menuButtons.back]
  ]).resize();
}

module.exports = {
  mainMenu,
  courtKeyboard,
  districtKeyboard,
  applicationCourtKeyboard,
  criminalDistrictKeyboard,
  applicationTypesKeyboard,
  finishPhotosKeyboard,
  signatureKeyboard
};