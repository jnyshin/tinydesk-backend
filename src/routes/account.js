const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");

//Router
const router = express.Router();

//change location and keepUnicorn
router.put("/", (req, res) => {
  const userId = req.user._id;
  console.log(req.body.city, req.body.keepUnicorn);
  User.updateOne(
    { _id: userId },
    { $set: { location: req.body.city, keepUnicorn: req.body.keepUnicorn } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("Updated user Info");
        res.send(doc);
      }
    }
  );
});

module.exports = router;
