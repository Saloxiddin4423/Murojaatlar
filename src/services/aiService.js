const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateApplication(userText) {
  const response = await client.responses.create({
    model: "gpt-5.5",
    input: `
Sen O'zbekiston sudlariga murojaat arizasi yozuvchi yordamchisan.

Foydalanuvchi yozgan mazmun:
"${userText}"

Shu mazmun asosida rasmiy, sodda va tushunarli ariza yoz.
Ariza quyidagi ko'rinishda bo'lsin:

ARIZA

Men, [F.I.Sh], quyidagi holat yuzasidan murojaat qilaman:
...

So‘rayman:
1. Ushbu murojaatimni ko‘rib chiqishingizni;
2. Qonuniy tartibda chora ko‘rishingizni.

Sana: __________
Imzo: __________

Muhim:
- yolg‘on fakt qo‘shma
- qonun moddasini aniq bilmasang yozma
- matn o‘zbek tilida bo‘lsin
`,
  });

  return response.output_text;
}

module.exports = { generateApplication };