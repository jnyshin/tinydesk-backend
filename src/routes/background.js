const express = require("express");
const User = require("../schemas/user");

//Router
const router = express.Router();
//route to /home/background
router.put("/", (req, res) => {
  try {
    const userId = req.user._id; //using this session variable, we can get current user's _id directly
    User.updateOne(
      { _id: userId },
      {
        $set: {
          backgroundImg: {
            url: req.body.url,
          },
        },
      }
    ).exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("changed background pic");
        res.send(doc);
      }
    });
  } catch (error) {
    console.log("There was an error");
    res.send("Could not save change");
    console.log(error);
  }
  // User.findOne({ _id: tmp._id }, async (err, doc) => {
  //   if (err) throw err;
  //   if (doc) {
  //     // doc.backgroundImg.url = req.body.url;
  //     // doc.save();
  //     console.log(req._parsedOriginalUrl.query);
  //     console.log(doc.backgroundImg.url);
  //     console.log(req.body.uri);
  //     res.send(doc);
  //   }
  // });
});

module.exports = router;
