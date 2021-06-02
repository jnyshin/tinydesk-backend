const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("EHLLO");
  // const cookieVal = Object.keys(req.body)[0];
  // s:pmdpAXKkIcYZTLRGhLW7m8oQ1lSXZ2G_.UMsUe51vfY+JDAyCHH58TKR11OzX14zD8pk3J1/S6Zc
  // const id = mongoose.Types.ObjectId(req.body.id);
  const cookieVal =
    "s:pmdpAXKkIcYZTLRGhLW7m8oQ1lSXZ2G_.UMsUe51vfY+JDAyCHH58TKR11OzX14zD8pk3J1/S6Zc";
  Session.findOne({ _id: id }, async (req, doc) => {
    console.log(doc);
  });
  // console.log(cookieVal);
});

module.exports = router;
