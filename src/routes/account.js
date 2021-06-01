const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");

//Router
const router = express.Router();

//change location and keepUnicorn
router.put("/", (req, res) => {
  try {
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
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

//delete account
router.delete("/", (req, res) => {
  try {
    const userId = req.user._id;
    console.log("remove user with this _id: ", userId);
    User.deleteOne({ _id: userId }).exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
        res.send("Successfully deleted the account");
      }
    });
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

module.exports = router;
