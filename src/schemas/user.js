const mongoose = require("mongoose");
const user = new mongoose.Schema({
  // Email, Location, Password, name, username
  googleId: {type: String, required: false},
  email: { type: String, required: true },
  location: Object,
  password: { type: String, required: false },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  todolists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todolist" }],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  backgroundImg: Object,
  name: { type: String, required: true },
  username: { type: String, required: true },
  keepUnicorn: Boolean,
  
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Calendar" }],
});

module.exports = mongoose.model("User", user);
