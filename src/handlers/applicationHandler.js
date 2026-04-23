const {
  applicationCourtTypes,
  applicationTypes,
  districts,
  menuButtons,
} = require("../config/constants");

const {
  criminalDistrictKeyboard,
  applicationTypesKeyboard,
  finishPhotosKeyboard,
  signatureKeyboard,
  mainMenu,
} = require("../keyboards/keyboards");

const { resetApplicationForm } = require("../utils/helpers");
const { generateApplicationPdf } = require("../services/applicationPdfService");
const { getSignature, removeSignature } = require("../services/signatureStore");
function registerApplication(bot) {
  bot.hears(applicationCourtTypes, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "courtType") return next();

    if (ctx.message.text !== "Jinoyat") {
      return ctx.reply("Hozircha faqat jinoyat ishlari bo‘yicha arizalar mavjud.");
    }

    form.courtType = ctx.message.text;
    form.step = "district";

    return ctx.reply(
      "Jinoyat ishlari bo‘yicha tuman sudini tanlang:",
      criminalDistrictKeyboard()
    );
  });

  bot.hears(districts, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "district") return next();

    form.district = ctx.message.text;
    form.step = "applicationType";

    return ctx.reply("Ariza turini tanlang:", applicationTypesKeyboard());
  });

  bot.hears(applicationTypes, async (ctx, next) => {
    const form = ctx.session.applicationForm;
    if (!form || form.step !== "applicationType") return next();

    form.applicationType = ctx.message.text;
    form.step = "applicantFullName";

    return ctx.reply("F.I.Sh kiriting:");
  });

  bot.on("photo", async (ctx, next) => {
    const form = ctx.session.applicationForm;

    if (!form || form.step !== "passportPhotos") return next();

    try {
      const photos = ctx.message.photo;

      if (!photos || !photos.length) {
        return ctx.reply("Rasmni qayta yuboring.");
      }

      const largestPhoto = photos[photos.length - 1];

      if (!Array.isArray(form.passportPhotos)) {
        form.passportPhotos = [];
      }

      form.passportPhotos.push(largestPhoto.file_id);

      console.log("PHOTO SAQLANDI:", largestPhoto.file_id);
      console.log("JAMI RASMLAR:", form.passportPhotos.length);

      return ctx.reply(
        `Rasm qabul qilindi. Jami: ${form.passportPhotos.length} ta\nYana rasm yuboring yoki tugmani bosing.`,
        finishPhotosKeyboard()
      );
    } catch (error) {
      console.error("Photo qabul qilishda xato:", error);
      return ctx.reply("Rasmni qabul qilishda xatolik yuz berdi.");
    }
  });

bot.on("message", async (ctx, next) => {
  const form = ctx.session.applicationForm;

  console.log("MESSAGE KELDI");
  console.log("WEB_APP_DATA:", ctx.message.web_app_data);
  console.log("SIGNATURE STEP:", form?.step);

  if (!ctx.message.web_app_data) return next();
  if (!form || form.step !== "signature") return next();

  try {
    const rawData = ctx.message.web_app_data.data;
    console.log("RAW WEBAPP DATA:", rawData);

    const data = JSON.parse(rawData);

    if (data.type === "signature" && data.signatureId) {
      const savedImage = getSignature(data.signatureId);

      if (!savedImage) {
        return ctx.reply("Imzo topilmadi yoki muddati o‘tgan.");
      }

      form.signature = savedImage;
      removeSignature(data.signatureId);

      console.log("IMZO SAQLANDI");

      return ctx.reply(
        "Imzo saqlandi. Endi PDF tayyorlash tugmasini bosing.",
        signatureKeyboard()
      );
    }

    return ctx.reply("Imzo ma'lumoti noto‘g‘ri keldi.");
  } catch (error) {
    console.error("WebApp data parse xato:", error);
    return ctx.reply("Imzoni qabul qilishda xatolik yuz berdi.");
  }
});
  bot.on("text", async (ctx, next) => {
    const form = ctx.session.applicationForm;
    const text = ctx.message.text;

    console.log("TEXT KELDI:", text);
    console.log("APPLICATION STEP:", form?.step);

    if (!form || !form.step) return next();

    if (text === menuButtons.finishPhotos) {
      if (form.step !== "passportPhotos") {
        return ctx.reply("Avval rasm yuborish bosqichiga keling.");
      }

      if (!Array.isArray(form.passportPhotos) || !form.passportPhotos.length) {
        return ctx.reply("Avval kamida bitta pasport rasmini yuboring.");
      }

      form.step = "signature";

      console.log("FINISH PHOTOS BOSILDI -> STEP signature");

      return ctx.reply(
        "Endi imzo qo‘ying. Tugmani bosib imzo oynasini oching.",
        signatureKeyboard()
      );
    }

    if (text === menuButtons.finishApplication) {
      if (form.step !== "signature") {
        return ctx.reply("Avval imzo bosqichiga o‘ting.");
      }

      if (!form.signature) {
        return ctx.reply("Avval imzo qo‘ying.");
      }

      try {
        await ctx.reply("PDF tayyorlanmoqda... ⏳");

        const filePath = await generateApplicationPdf(form, bot);

        await ctx.replyWithDocument({ source: filePath });
        await ctx.reply("Tayyor PDF yuborildi.", mainMenu());

        resetApplicationForm(ctx);
      } catch (err) {
        console.error("PDF xatolik:", err);
        await ctx.reply("PDF yaratishda xatolik yuz berdi.", mainMenu());
      }

      return;
    }

    if (
      text === "/start" ||
      text === menuButtons.appeal ||
      text === menuButtons.application ||
      text === menuButtons.courtsInfo ||
      text === menuButtons.back ||
      text === menuButtons.openSignature ||
      applicationCourtTypes.includes(text) ||
      applicationTypes.includes(text) ||
      districts.includes(text)
    ) {
      return next();
    }

    if (form.step === "applicantFullName") {
      form.applicantFullName = text;
      form.step = "phone";
      return ctx.reply("Telefon raqamingizni kiriting:");
    }

    if (form.step === "phone") {
      form.phone = text;
      form.step = "address";
      return ctx.reply("Manzilingizni kiriting:");
    }

    if (form.step === "address") {
      form.address = text;
      form.step = "defendantFullName";
      return ctx.reply("Sudlanuvchining F.I.Sh ni kiriting:");
    }

    if (form.step === "defendantFullName") {
      form.defendantFullName = text;
      form.step = "relationship";
      return ctx.reply("Sudlanuvchi sizga kim bo‘ladi?");
    }

    if (form.step === "relationship") {
      form.relationship = text;

      if (form.applicationType === "Ish hujjatlari bilan tanishish") {
        form.step = "reviewReason";
        return ctx.reply("Ish hujjatlari bilan tanishish sababini yozing:");
      }

      form.step = "meetingDate";
      return ctx.reply("Uchrashuv sanasini oddiy matn ko‘rinishida kiriting:");
    }

 if (form.step === "meetingDate") {
  try {
    console.log("MEETINGDATE BLOCKGA KIRDI");

    form.meetingDate = text;
    form.step = "passportPhotos";

    if (!Array.isArray(form.passportPhotos)) {
      form.passportPhotos = [];
    }

    console.log("STEP O'ZGARDI:", form.step);
    console.log("PASSPORT PHOTOS INIT:", form.passportPhotos);

    await ctx.reply(
      "Pasport rasmlarini yuboring. Tugatgach pastdagi tugmani bosing.",
      finishPhotosKeyboard()
    );

    console.log("PASSPORT XABARI YUBORILDI");
    return;
  } catch (error) {
    console.error("MEETINGDATE XATOLIK:", error);
    return ctx.reply("meetingDate bosqichida xatolik yuz berdi.");
  }
}

    if (form.step === "reviewReason") {
      form.reviewReason = text;
      form.step = "passportPhotos";

      if (!Array.isArray(form.passportPhotos)) {
        form.passportPhotos = [];
      }

      return ctx.reply(
        "Pasport rasmlarini yuboring. Tugatgach pastdagi tugmani bosing.",
        finishPhotosKeyboard()
      );
    }

    return next();
  });
}

module.exports = { registerApplication };