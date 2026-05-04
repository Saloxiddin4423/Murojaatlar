const { Markup } = require("telegraf");
const {
  courtsByType,
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
    ["Fuqarolik"],
    [menuButtons.back]
  ]).resize();
}

function districtKeyboard(courtType) {
  const list = courtsByType[courtType] || [];

  const rows = [];
  let tempRow = [];

  list.forEach((item) => {
    // Matn uzun bo‘lsa — alohida qator
    if (item.length > 22) {
      if (tempRow.length) {
        rows.push(tempRow);
        tempRow = [];
      }

      rows.push([item]);
      return;
    }

    // Matn qisqa bo‘lsa — 2 tadan qator
    tempRow.push(item);

    if (tempRow.length === 2) {
      rows.push(tempRow);
      tempRow = [];
    }
  });

  if (tempRow.length) {
    rows.push(tempRow);
  }

  rows.push([menuButtons.back]);

  return Markup.keyboard(rows).resize();
}
function applicationCourtKeyboard() {
  return Markup.keyboard([
    ["Jinoyat"],
    ["Iqtisodiy", "Fuqarolik"],
    [menuButtons.back]
  ]).resize();
}

function criminalDistrictKeyboard() {
  return districtKeyboard("Jinoyat");
}

function applicationTypesKeyboard() {
  return Markup.keyboard([
    [applicationTypes[0]],
    [applicationTypes[1]],
    [applicationTypes[2]],
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
        web_app: {
          url: process.env.WEB_APP_URL
        }
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