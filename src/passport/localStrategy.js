const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const User = require("../schemas/user");
module.exports = (passport) =>{
passport.use(
  new localStrategy({
    usernameField:'email',
    passwordField:'password',
  },async (email,password,done) =>{
    try{
      let exUser;
      await User.findOne({ "email": email}).then(r =>{ exUser =r});
      console.log(exUser);
      if(exUser){
        let result;
         await bcrypt.compare(password,exUser.password).then( r =>{ result = r;console.log("the result is " + r )});
        if(result){
          done(null,exUser);
        }else{
          done(null,false,{message:"Wrong password"})
        }
      }else{
        done(null,false,{message: "Wrong Email"})
      }
    }catch(error){
      console.error(error);
      done(error);
    }
  }));
};
