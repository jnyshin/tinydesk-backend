const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const local = require('./localStrategy');


module.exports = function (passport) {
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user);
    });
  });
  local(passport);
};

