const User = require("../schemas/user");
const local = require("./localStrategy.js");

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
