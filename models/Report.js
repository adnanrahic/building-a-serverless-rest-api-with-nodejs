const mongoose = require('mongoose');
var ReportSchema = new mongoose.Schema({ 
  content: String, 
  createdAt: { type: Date, default: Date.now } 
});
mongoose.model('Report', ReportSchema);
module.exports = mongoose.model('Report');