const passport = require("passport");
const User = require("../schemas/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ _id: id });
      return done(null, user);
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "No such user exists " });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          done(null, false, { message: "Wrong password" });
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
