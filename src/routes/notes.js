const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Note = require("../schemas/notes_db");

//Router
const router = express.Router();

//Router = /home/notes
router.post("/", (req, res) => {
  //changed from const tmp = req.session.user
  const userId = req.user._id;
  const newNote = new Note({ title: req.body.title, content: {} });
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
    const userId = req.user._id;
    const noteId = req.body.removeId;
    console.log("got this note's id: ", noteId);
    Note.deleteOne({ _id: noteId }, async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
      }
    });
    User.updateOne(
      { _id: userId },
      { $pull: { notes: noteId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("Note deleted");
          //no more tmp
          res.send(doc);
        }
      }
    );
});

// @desc    Update note
// @route   PUT /home/users/<String: username>/notes/<String: noteId>
router.put("/", (req, res) => {
    const noteId = mongoose.Types.ObjectId(req.body._id);
    console.log("Which note to update in back: ", noteId);
    Note.updateOne(
      { _id: noteId },
      { $set: { title: req.body.title } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("Updated Note's title");
          res.send(doc);
        }
      }
    );
});

// @desc    Change note position
// @route   PUT /home/users/<String: username>/notes/
router.put("/order", (req, res) => {
    const userId = req.user._id;
    const noteId = req.body._id;
    const newIndex = req.body.newIndex;
    console.log("change to position ", newIndex);
    //remove the original
    User.updateOne(
      { _id: userId },
      { $pull: { notes: noteId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("note pulled ", noteId);
        }
        //put the note into new index position
        User.updateOne(
          { _id: userId },
          { $push: { notes: { $each: [noteId], $position: newIndex } } },
          async (err, doc) => {
            if (err) throw err;
            if (doc) {
              //User.save();
              console.log("Note moved to ", newIndex);
              res.send();
            }
          }
        );
      }
    );
});
module.exports = router;
