const meetingPermission = require("./types/meetingPermission");
const documentCopyRequest = require("./types/documentCopyRequest");
const aiApplication = require("./types/aiApplication");

const applications = [
  meetingPermission,
  documentCopyRequest,
  aiApplication,
];

function getApplicationTitles() {
  return applications.map((app) => app.title);
}

function getApplicationByTitle(title) {
  return applications.find((app) => app.title === title);
}

module.exports = {
  applications,
  getApplicationTitles,
  getApplicationByTitle,
};