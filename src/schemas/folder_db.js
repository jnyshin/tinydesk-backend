const mongoose = require("mongoose");
const folder = new mongoose.Schema({
  // folder title, array of bookmarks in the folder
  title: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bookmark" }],
});

module.exports = mongoose.model("Folder", folder);
