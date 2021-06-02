const mongoose = require("mongoose");
const session_db = new mongoose.Schema({
  expires: Date,
  session: {
    cookie: Object,
    passport: Object,
    cookieVal: String,
  },
});

module.exports = mongoose.model("Session", session_db);
