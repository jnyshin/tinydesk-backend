const mongoose = require("mongoose");
const folder = new mongoose.Schema({
  // folder title, array of bookmarks in the folder
  title: String,
  bookmarks: Array,
});

module.exports = mongoose.model("Folder", folder);
