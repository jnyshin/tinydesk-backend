const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("EHLLO");
  // const cookieVal = Object.keys(req.body)[0];
  // s:pmdpAXKkIcYZTLRGhLW7m8oQ1lSXZ2G_.UMsUe51vfY+JDAyCHH58TKR11OzX14zD8pk3J1/S6Zc
  // const id = mongoose.Types.ObjectId(req.body.id);
  const cookieVal =
    "s:pmdpAXKkIcYZTLRGhLW7m8oQ1lSXZ2G_.UMsUe51vfY+JDAyCHH58TKR11OzX14zD8pk3J1/S6Zc";
  try {
    Session.findOne({ "session.cookieVal": cookieVal }, async (err, doc) => {
      if (err) throw err;
      else {
        //console.log(doc);
        console.log(doc.session.passport.user);
        const passportId = mongoose.Types.ObjectId(doc.session.passport.user);
        User.findOne({ _id: passportId })
          .populate("folders")
          .exec((err, doc) => {
            if (err) throw err;
            else {
              console.log(doc);
              res.send(doc.folders);
            }
          });
      }
    });
  } catch (error) {
    res.send("error");
  }
});

module.exports = router;
