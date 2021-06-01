const mongoose = require("mongoose");
const session_db = new mongoose.Schema({
  // bookmark title, url, color tag, and thumbnail
  expires: Date,
  session: {
    cookie: Object,
    passport: Object,
    cookieVal: String,
  },
});

module.exports = mongoose.model("Session", session_db);
