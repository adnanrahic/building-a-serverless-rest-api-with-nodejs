const Report = require('../models/Report');
function createReport(content) {
  Report.create({ content: content });
}
module.exports = createReport;