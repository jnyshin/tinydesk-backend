const express = require("express");
const mongoose = require("mongoose");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");

const router = express.Router();
// @desc    Add a bookmark
// @route   POST /bookmarks
router.post("/", (req, res) => {
  // code here
  const folderId = req.body._id;
  const newBookmark = new Bookmark({ title: req.body.title, url: req.body.url, color: req.body.color, thumbnail: req.body.thumbnail });
  newBookmark.save();
  const newId = newBookmark._id;
  Folder.updateOne({ _id: folderId }, { $push: { bookmarks: newId } }, 
    async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("New Bookmark's id is", newId);
          res.send(newId);
        }      
    });    
});

// @desc    Remove a bookmark
// @route   DELETE /bookmarks
router.delete("/", (req, res) => {
  const folderId = req.body._id;
    const bookmarkId = req.body.removeId;
    console.log("got this bookmark's id: ", bookmarkId);
    Bookmark.deleteOne({ _id: bookmarkId }, async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
      }
    });
    Folder.updateOne(
      { _id: folderId },
      { $pull: { bookmarks: bookmarkId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("Bookmark deleted");
          //no more tmp
          res.send(doc);
        }
      }
    );
});

// @desc    Change bookmark's position
// @route   PUT /bookmarks/order
router.put("/order", (req, res) => {
  const folderId = req.body._id;
    const bookmarkId = req.body.removeId;
    const newIndex = req.body.newIndex;
    console.log("change to position ", newIndex);
    //remove the original
    Folder.updateOne(
      { _id: folderId },
      { $pull: { bookmarks: bookmarkId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("bookmark pulled ", bookmarkId);
        }
        //put the note into new index position
        Folder.updateOne(
          { _id: folderId },
          { $push: { bookmarks: { $each: [bookmarkId], $position: newIndex } } },
          async (err, doc) => {
            if (err) throw err;
            if (doc) {
              console.log("Bookmark moved to ", newIndex);
              res.send();
            }
          }
        );
      }
    );
});

// @desc Edit a bookmark
// @route PUT /bookmarks
router.put("/", (req, res) => {
  const bookmarkId = mongoose.Types.ObjectId(req.body._id);
  console.log("Which bookmark to update in back: ", bookmarkId);
  Bookmark.updateOne(
    { _id: bookmarkId },
    { $set: { title: req.body.title, url: req.body.url, color: req.body.color, thumbnail: req.body.thumbnail } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("Updated Bookmark");
        res.send(doc);
      }
    }
  );
});

module.exports = router;
