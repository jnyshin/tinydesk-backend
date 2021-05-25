const mongoose = require("mongoose");
const calendar = new mongoose.Schema({
  // folder title, array of bookmarks in the folder
  title: String,
  allDay: Boolean,
  start: Date,
  end: Date,
});

module.exports = mongoose.model("Calendar", calendar);
