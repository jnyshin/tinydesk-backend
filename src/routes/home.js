const express = require("express");
require("dotenv").config();
const cookie = require("cookie");
const User = require("../schemas/user");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      res.send("no uid");
    } else {
      const userId = req.user._id;
      const cookieValue = cookie.parse(req.headers.cookie)[
        process.env.COOKIE_NAME
      ];
      req.session.cookieVal = cookieValue;
      User.findOne({ _id: userId })
        .populate({
          path: "folders",
          model: "Folder",
          populate: {
            path: "bookmarks",
            model: "Bookmark",
          },
        })
        .populate("notes")
        .populate({
          path: "todolists",
          model: "Todolist",
          populate: { path: "todos", model: "Todo" },
        })
        .populate("events")
        .exec((err, doc) => {
          if (err) throw err;
          if (doc) {
            console.log(doc);
            res.send(doc);
          }
        });
    }
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});
module.exports = router;
