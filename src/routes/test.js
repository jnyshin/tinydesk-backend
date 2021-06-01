const express = require("express");
const Session = require("../schemas/session_db");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("EHLLO");
  const cookieVal = Object.keys(req.body)[0];
  // s:pmdpAXKkIcYZTLRGhLW7m8oQ1lSXZ2G_.UMsUe51vfY+JDAyCHH58TKR11OzX14zD8pk3J1/S6Zc
  console.log(cookieVal);
  Session.findOne(
    { session: { $elemMatch: { cookieVal: cookieVal } } },
    async (err, doc) => {
      console.log(doc);
    }
  );
});

module.exports = router;
