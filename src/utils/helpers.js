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

function resetApplicationForm(ctx) {
  ctx.session.applicationForm = {
    step: null,
    courtType: "",
    district: "",
    applicationType: "",
    applicantFullName: "",
    phone: "",
    address: "",
    defendantFullName: "",
    relationship: "",
    meetingDate: "",
    reviewReason: "",
    passportPhotos: [],
    signature: ""
  };
}

module.exports = { resetForm, resetApplicationForm };