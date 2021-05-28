const express = require("express");

const User = require("../schemas/user");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
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
  } catch (error) {
    console.log("There was an error");
    res.send("no uid");
    console.log(error);
  }
});
module.exports = router;
