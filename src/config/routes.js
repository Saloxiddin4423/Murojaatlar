function getGroupId(district, courtType) {
  const routes = {
    Bektemir: {
      Jinoyat: -1003566113931,
      Iqtisodiy: -1003566113931,
      Fuqarolik: -1003566113931,
      "Ma'muriy": -1003566113931
    },
    Chilonzor: {
      Jinoyat: -1002222222211,
      Iqtisodiy: -1002222222212,
      Fuqarolik: -1002222222213,
      "Ma'muriy": -1002222222214
    }
    // qolganlarini ham qo‘shib chiqasan
  };

  return routes[district]?.[courtType] || null;
}

module.exports = { getGroupId };