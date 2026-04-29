const ExcelJS = require("exceljs");
const path = require("path");

async function createAppealsExcel(appeals) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Murojaatlar");

  sheet.columns = [
    { header: "№", key: "id", width: 8 },
    { header: "Murojaat ID", key: "appealNumber", width: 22 },
    { header: "F.I.Sh", key: "fullName", width: 30 },
    { header: "Telefon", key: "phone", width: 18 },
    { header: "Manzil", key: "address", width: 30 },
    { header: "Tuman", key: "district", width: 25 },
    { header: "Sud turi", key: "courtType", width: 20 },
    { header: "Murojaat matni", key: "message", width: 50 },
    { header: "Sana", key: "createdAt", width: 22 }
  ];

  appeals.forEach((appeal, index) => {
    sheet.addRow({
      id: index + 1,
      appealNumber: appeal.appealNumber,
      fullName: appeal.fullName,
      phone: appeal.phone,
      address: appeal.address || "",
      district: appeal.district,
      courtType: appeal.courtType,
      message: appeal.message,
      createdAt: appeal.createdAt
        ? new Date(appeal.createdAt).toLocaleString("uz-UZ")
        : ""
    });
  });

  sheet.getRow(1).font = { bold: true };

  const filePath = path.join(__dirname, "../../murojaatlar.xlsx");
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}

module.exports = { createAppealsExcel };