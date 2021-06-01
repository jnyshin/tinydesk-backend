const express = require("express");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const mongoose = require("mongoose");

const router = express.Router();

// Routes = /home/folder
router.post("/", (req, res) => {
  try {
    //changed from const tmp = req.session.user
    const userId = req.user._id; //using this session variable, we can get current user's _id directly
    console.log(req.body.title);
    const newFolder = new Folder({ title: req.body.title, bookmarks: [] });
    newFolder.save();
    const newId = newFolder._id;
    User.updateOne({ _id: userId }, { $push: { folders: newFolder._id } }).exec(
      (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("New Folder's id is", newId);
          res.send(newId);
        }
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

router.delete("/", (req, res) => {
  try {
    //changed from const tmp = req.session.user
    const userId = req.user._id;

    console.log("Folder to delete in back: ", req.body.remove);
    const folderId = mongoose.Types.ObjectId(req.body.remove);
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
    res.send("Checked");
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

//arrange folder order
router.put("/order", (req, res) => {
  try {
    const userId = req.user._id;
    const folderId = req.body._id;
    const newIndex = req.body.newIndex;
    console.log("change to position ", newIndex);
    //remove the original
    User.updateOne({ _id: userId }, { $pull: { folders: folderId } }).exec(
      (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("folder pulled ", folderId);
        }
        //put the todolist into new index position
        User.updateOne(
          { _id: userId },
          { $push: { folders: { $each: [folderId], $position: newIndex } } }
        ).exec((err, doc) => {
          if (err) throw err;
          if (doc) {
            //User.save();
            console.log("folder pushed into ", newIndex);
            res.send(doc);
          }
        });
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

//Change folder title
router.put("/", (req, res) => {
  try {
    const folderId = mongoose.Types.ObjectId(req.body._id);
    Folder.updateOne(
      { _id: folderId },
      { $set: { title: req.body.title } }
    ).exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        res.send(doc);
      }
    });
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

module.exports = router;
