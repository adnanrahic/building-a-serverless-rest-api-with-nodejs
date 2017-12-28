const mongoose = require('mongoose');
var NoteSchema = new mongoose.Schema({  
  title: String,
  description: String
});
mongoose.model('Note', NoteSchema);
module.exports = mongoose.model('Note');