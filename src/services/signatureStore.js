const signatures = new Map();

function saveSignature(image) {
  const id = Date.now().toString() + Math.random().toString(36).slice(2);
  signatures.set(id, image);
  return id;
}

function getSignature(id) {
  return signatures.get(id);
}

function removeSignature(id) {
  signatures.delete(id);
}

module.exports = {
  saveSignature,
  getSignature,
  removeSignature,
};