const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Bookmark = require("../schemas/bookmark_db");

const router = express.Router();
// @desc    Add a bookmark
// @route   POST /home/users/<String: username>/folders/<String: folderId>/bookmarks
router.post("/bookmarks", (req, res) => {
  // code here
});

// @desc    Remove a bookmark
// @route   DELETE /home/users/<String: username>/folders/<String: folderId>/bookmarks/<String: bookmarkId>
router.delete("/bookmarks", (req, res) => {
  // code here
});

// @desc    Change bookmark's position
// @route   PUT /home/users/<String: username>/folders/<String: folderId>/bookmarks
router.put("/bookmarks", (req, res) => {
  // code here
});
module.exports = router;
