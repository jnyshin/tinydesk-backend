const express = require("express");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const mongoose = require("mongoose");

const router = express.Router();

// Routes = /home/folder
router.post("/", (req, res) => {
  //changed from const tmp = req.session.user
  const userId = req.user._id; //using this session variable, we can get current user's _id directly
  console.log(req.body.title);
  const newFolder = new Folder({ title: req.body.title, bookmarks: [] });
  newFolder.save();
  // console.log(tmp.name);

  //Changed tmp._id
  User.updateOne({ _id: userId }, { $push: { folders: newFolder._id } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.send(doc);
      }
    }
  );
});

router.delete("/", (req, res) => {
  //changed from const tmp = req.session.user
  const userId = req.user._id;
  const folderId = mongoose.Types.ObjectId(req.body.removeId);
  Folder.deleteOne({ id: folderId }, async (err, doc) => {
    if (err) throw err;
    if (doc) console.log(doc);
  });
  //Changed tmp._id
  User.updateOne({ _id: userId }, { $pull: { folders: folderId } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("folder deleted");
      }
    }
  );
});
module.exports = router;
