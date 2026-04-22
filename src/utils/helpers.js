function resetForm(ctx) {
  ctx.session.form = {
    step: null,
    courtType: "",
    district: "",
    fullName: "",
    phone: "",
    address: "",
    message: ""
  };
}

module.exports = { resetForm };