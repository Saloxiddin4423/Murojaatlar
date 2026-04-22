const { Markup } = require("telegraf");
const {
  districts,
  menuButtons,
  applicationCourtTypes,
  applicationTypes
} = require("../config/constants");

// ... eski funksiyalar qoladi

function signatureKeyboard() {
  return Markup.keyboard([
    [Markup.button.webApp(menuButtons.openSignature, process.env.WEB_APP_URL)],
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