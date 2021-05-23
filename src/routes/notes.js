const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Note = require("../schemas/todolist_db");

//Router
const router = express.Router();

//Router = /home/notes
router.post("/", (req, res) => {
  //changed from const tmp = req.session.user
  const userId = req.user._id;
  const newNote = new Note({ title: "", content: "" });
  newNote.save();
  //Changed tmp._id
  User.updateOne({ _id: userId }, { $push: { notes: newNote._id } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("note added");
        res.send(newNote._id);
      }
    }
  );
});

// --------------------------------------------------
// Fabio's API routes

// @desc    Removes a note
// @route   DELETE /home/users/<String: username>/notes/
router.delete("/", (req, res) => {
  // code here
});

// @desc    Update note
// @route   PUT /home/users/<String: username>/notes/<String: noteId>
router.put("/", (req, res) => {
  // code here
});

// @desc    Change note position
// @route   PUT /home/users/<String: username>/notes/
router.put("/", (req, res) => {
  // code here
});
module.exports = router;
