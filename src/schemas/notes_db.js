const mongoose = require("mongoose");
const note = new mongoose.Schema({
  // Note title and content
  title: String,
  content: String,
});

module.exports = mongoose.model("Note", note);
