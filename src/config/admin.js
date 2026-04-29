const SUPER_ADMIN_IDS = process.env.SUPER_ADMIN_IDS
  ? process.env.SUPER_ADMIN_IDS.split(",").map(id => id.trim())
  : [];

function isSuperAdmin(userId) {
  return SUPER_ADMIN_IDS.includes(String(userId));
}

module.exports = {
  isSuperAdmin
};