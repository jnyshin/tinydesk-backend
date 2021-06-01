const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Bookmark = require("../schemas/bookmark_db");

const router = express.Router();
// @desc    Add a bookmark
// @route   POST /bookmarks
router.post("/bookmarks", (req, res) => {
  // code here
  const userId = req.user._id; 
  console.log(req.body.title);
  const newBookmark = new Bookmark({ title: req.body.title, url: req.body.url, color: req.body.color, thumbnail: req.body.thumbnail });
  newBookmark.save();
  const newId = newBookmark._id;
  User.updateOne({ _id: userId }, { $push: { folders: newFolder._id } }, 
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
router.delete("/bookmarks", (req, res) => {
  
});

// @desc    Change bookmark's position
// @route   PUT /bookmarks
router.put("/bookmarks", (req, res) => {
  // code here
});
module.exports = router;
