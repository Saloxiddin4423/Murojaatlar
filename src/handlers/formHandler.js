const { courtTypes, districts } = require("../config/constants");
const { districtKeyboard, mainMenu } = require("../keyboards/keyboards");
const { saveAppeal } = require("../services/appealService");
const { resetForm } = require("../utils/helpers");
const { getGroupId } = require("../config/routes");

function registerForm(bot) {
    bot.hears(courtTypes, (ctx) => {
        if (ctx.session.form.step !== "courtType") return;
        ctx.session.form.courtType = ctx.message.text;
        ctx.session.form.step = "district";
        ctx.reply("Tumanni tanlang:", districtKeyboard());
    });

    bot.hears(districts, (ctx) => {
        if (ctx.session.form.step !== "district") return;
        ctx.session.form.district = ctx.message.text;
        ctx.session.form.step = "fullName";
        ctx.reply("F.I.O kiriting:");
    });

    bot.on("text", async (ctx) => {
        const form = ctx.session.form;
        const text = ctx.message.text;

        if (
            text === "/start" ||
            text === "📨 Murojaat yuborish" ||
            text === "⬅️ Orqaga" ||
            courtTypes.includes(text) ||
            districts.includes(text)
        ) {
            return;
        }

        if (!form.step) return;

        if (form.step === "fullName") {
            form.fullName = text;
            form.step = "phone";
            return ctx.reply("Telefon kiriting:");
        }

        if (form.step === "phone") {
            form.phone = text;
            form.step = "address";
            return ctx.reply("Manzil kiriting:");
        }

        if (form.step === "address") {
            form.address = text;
            form.step = "message";
            return ctx.reply("Murojaat yozing:");
        }

        if (form.step === "message") {
            form.message = text;

            try {
                const appealNumber = await saveAppeal(form, String(ctx.from.id));

                const groupText = `
🆕 Yangi murojaat

ID: ${appealNumber}
Sud turi: ${form.courtType}
Tuman: ${form.district}

F.I.O: ${form.fullName}
Tel: ${form.phone}

Manzil: ${form.address}

Murojaat:
${form.message}
`;

                const targetGroupId = getGroupId(form.district, form.courtType);

                if (targetGroupId) {
                    await bot.telegram.sendMessage(targetGroupId, groupText);
                } else {
                    console.log("Group ID topilmadi:", form.district, form.courtType);
                }

                await ctx.reply(
                    `✅ Murojaatingiz qabul qilindi.\n\nID: ${appealNumber}`,
                    mainMenu()
                );

                resetForm(ctx);
            } catch (error) {
                console.error("Xatolik:", error);
                await ctx.reply("Xatolik yuz berdi.", mainMenu());
                resetForm(ctx);
            }
        }
    });
}
console.log("District:", form.district);
console.log("CourtType:", form.courtType);

const targetGroupId = getGroupId(form.district, form.courtType);
console.log("Target group id:", targetGroupId);
module.exports = { registerForm };