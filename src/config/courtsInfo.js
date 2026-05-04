const { map } = require("pdfkit");

const courtsInfo = {
  Jinoyat: {
    Bektemir: {
      name: "Jinoyat ishlari bo‘yicha Bektemir tumani sudi",
      address: "Toshkent shahri, Bektemir tumani",
      phone: "+998 71 295-XX-XX",
      email: "bektemir@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Bektemir tumani"
    },
    Chilonzor: {
      name: "Jinoyat ishlari bo‘yicha Chilonzor tumani sudi",
      address: "Toshkent shahri, Chilonzor tumani",
      phone: "+998 71 273-XX-XX",
      email: "chilonzor@sud.uz",
        mapUrl: "https://maps.google.com/?q=Toshkent shahri, Chilonzor tumani"
    },
    Mirobod: {
      name: "Jinoyat ishlari bo‘yicha Mirobod tumani sudi",
      address: "Toshkent shahri, Mirobod tumani",
      phone: "+998 71 256-XX-XX",
      email: "mirobod@sud.uz",
        mapUrl: "https://maps.google.com/?q=Toshkent shahri, Mirobod tumani"
    },
    "Mirzo Ulug‘bek": {
      name: "Jinoyat ishlari bo‘yicha Mirzo Ulug‘bek tumani sudi",
      address: "Toshkent shahri, Mirzo Ulug‘bek tumani",
      phone: "+998 71 262-XX-XX",
      email: "mugbek@sud.uz",
        mapUrl: "https://maps.google.com/?q=Toshkent shahri, Mirzo Ulug‘bek tumani"
    },
    Olmazor: {
      name: "Jinoyat ishlari bo‘yicha Olmazor tumani sudi",
      address: "Toshkent shahri, Olmazor tumani",
      phone: "+998 71 246-XX-XX",
      email: "olmazor@sud.uz",
    mapUrl: "https://maps.google.com/?q=Toshkent shahri, Olmazor tumani"
    },
    Sergeli: {
      name: "Jinoyat ishlari bo‘yicha Sergeli tumani sudi",
      address: "Toshkent shahri, Sergeli tumani",
      phone: "+998 71 258-XX-XX",
      email: "sergeli@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Sergeli tumani"
    },
    Shayxontohur: {
      name: "Jinoyat ishlari bo‘yicha Shayxontohur tumani sudi",
      address: "Toshkent shahri, Shayxontohur tumani",
      phone: "+998 71 241-XX-XX",
      email: "shayxontohur@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Shayxontohur tumani"
    },
    Uchtepa: {
      name: "Jinoyat ishlari bo‘yicha Uchtepa tumani sudi",
      address: "Toshkent shahri, Uchtepa tumani",
      phone: "+998 71 274-XX-XX",
      email: "uchtepa@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Uchtepa tumani"
    },
    Yakkasaroy: {
      name: "Jinoyat ishlari bo‘yicha Yakkasaroy tumani sudi",
      address: "Toshkent shahri, Yakkasaroy tumani",
      phone: "+998 71 255-XX-XX",
      email: "yakkasaroy@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Yakkasaroy tumani"
    }
  },

  Fuqarolik: {
    "Fuqarolik ishlari bo‘yicha Yakkasaroy tumanlararo sudi": {
      name: "Fuqarolik ishlari bo‘yicha Yakkasaroy tumanlararo sudi",
      address: "Toshkent shahri, Yakkasaroy tumani",
      phone: "+998 71 255-XX-XX",
      email: "yakkasaroy@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Yakkasaroy tumani"
    },
    "Fuqarolik ishlari bo‘yicha Uchtepa tumanlararo sudi": {
      name: "Fuqarolik ishlari bo‘yicha Uchtepa tumanlararo sudi",
      address: "Toshkent shahri, Uchtepa tumani",
      phone: "+998 71 274-XX-XX",
      email: "uchtepa@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Uchtepa tumani"
    },
    "Fuqarolik ishlari bo‘yicha Mirobod tumanlararo sudi": {
      name: "Fuqarolik ishlari bo‘yicha Mirobod tumanlararo sudi",
      address: "Toshkent shahri, Mirobod tumani",
      phone: "+998 71 256-XX-XX",
      email: "mirobod@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Mirobod tumani"  
    },
    "Fuqarolik ishlari bo‘yicha Mirzo Ulug‘bek tumanlararo sudi": {
      name: "Fuqarolik ishlari bo‘yicha Mirzo Ulug‘bek tumanlararo sudi",
      address: "Toshkent shahri, Mirzo Ulug‘bek tumani",
      phone: "+998 71 262-XX-XX",
      email: "mugbek@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Mirzo Ulug‘bek tumani"   
    },
    "Fuqarolik ishlari bo‘yicha Shayxontohur tumanlararo sudi": {
      name: "Fuqarolik ishlari bo‘yicha Shayxontohur tumanlararo sudi",
      address: "Toshkent shahri, Shayxontohur tumani",
      phone: "+998 71 241-XX-XX",
      email: "shayxontohur@sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri, Shayxontohur tumani"
    }
  },

  Iqtisodiy: {
    "Toshkent shahar iqtisodiy sudi": {
      name: "Toshkent shahar iqtisodiy sudi",
      address: "Toshkent shahri",
      phone: "+998 71 233-XX-XX",
      email: "info@iqtisodiy.sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent shahri"
    },
    "Toshkent viloyati iqtisodiy sudi": {
      name: "Toshkent viloyati iqtisodiy sudi",
      address: "Toshkent viloyati",
      phone: "+998 71 202-XX-XX",
      email: "info@iqtisodiy.sud.uz",
      mapUrl: "https://maps.google.com/?q=Toshkent viloyati"
    }
  }
};

module.exports = { courtsInfo };