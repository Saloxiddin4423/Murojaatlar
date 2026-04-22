const {
  courtKeyboard,
  districtKeyboard,
  mainMenu,
  applicationCourtKeyboard,
  criminalDistrictKeyboard,
  applicationTypesKeyboard,
  finishPhotosKeyboard
} = require("../keyboards/keyboards");

const { resetForm, resetApplicationForm } = require("../utils/helpers");
const { menuButtons } = require("../config/constants");

function registerNavigation(bot) {
  bot.hears(menuButtons.appeal, (ctx) => {
    resetApplicationForm(ctx);
    resetForm(ctx);
    ctx.session.form.step = "courtType";
    ctx.reply("Sud turini tanlang:", courtKeyboard());
  });

  bot.hears(menuButtons.application, (ctx) => {
    resetForm(ctx);
    resetApplicationForm(ctx);
    ctx.session.applicationForm.step = "courtType";
    ctx.reply("Qaysi sud turiga ariza yubormoqchisiz?", applicationCourtKeyboard());
  });

  bot.hears(menuButtons.courtsInfo, (ctx) => {
    ctx.reply("Bu bo‘lim hozircha tayyor emas.", mainMenu());
  });

  bot.hears(menuButtons.back, (ctx) => {
    const appStep = ctx.session.applicationForm?.step;
    const formStep = ctx.session.form?.step;

    if (appStep) {
      if (appStep === "courtType") {
        resetApplicationForm(ctx);
        return ctx.reply("Bosh menyu", mainMenu());
      }

      if (appStep === "district") {
        ctx.session.applicationForm.step = "courtType";
        return ctx.reply("Qaysi sud turiga ariza yubormoqchisiz?", applicationCourtKeyboard());
      }

      if (appStep === "applicationType") {
        ctx.session.applicationForm.step = "district";
        return ctx.reply("Jinoyat ishlari bo‘yicha tuman sudini tanlang:", criminalDistrictKeyboard());
      }

      if (["applicantFullName", "defendantFullName", "relationship", "meetingDate", "reviewReason", "passportPhotos"].includes(appStep)) {
        ctx.session.applicationForm.step = "applicationType";
        return ctx.reply("Ariza turini tanlang:", applicationTypesKeyboard());
      }
    }

    if (formStep) {
      if (formStep === "district") {
        ctx.session.form.step = "courtType";
        return ctx.reply("Qaysi sud turiga murojaat qilmoqchisiz?", courtKeyboard());
      }

      if (["fullName", "phone", "address", "message"].includes(formStep)) {
        ctx.session.form.step = "district";
        return ctx.reply("Tumanni tanlang:", districtKeyboard());
      }
    }

    resetApplicationForm(ctx);
    resetForm(ctx);
    return ctx.reply("Bosh menyu", mainMenu());
  });
}

module.exports = { registerNavigation };