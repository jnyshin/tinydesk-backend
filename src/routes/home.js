const express = require("express");

const User = require("../schemas/user");
const router = express.Router();

router.get("/", async (req, res) => {
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
    .exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
        res.send(doc);
      }
    });
});
module.exports = router;
