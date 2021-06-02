const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const Todolist = require("../schemas/todolist_db");
const Todo = require("../schemas/todo_db");
const Note = require("../schemas/notes_db");
const Calendar = require("../schemas/calendar_db");

//Router
const router = express.Router();

//change location and keepUnicorn
router.put("/", (req, res) => {
  try {
    const userId = req.user._id;
    console.log(req.body.city, req.body.keepUnicorn);
    User.updateOne(
      { _id: userId },
      { $set: { location: req.body.city, keepUnicorn: req.body.keepUnicorn } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          //User.save();
          console.log("Updated user Info");
          res.send(doc);
        }
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

//delete account
router.delete("/", (req, res) => {
  try {
    const userId = req.user._id;
    console.log("remove user with this _id: ", userId);

    User.findOne({ _id: userId }, async (err, doc) => {
      if (err) throw err;
      else {
        const folders = doc.folders;
        const todolists = doc.todolists;
        const notes = doc.notes;
        const events = doc.events;
        User.deleteOne({ _id: userId }).exec((err, doc) => {
          if (err) throw err;
          if (doc) {
            console.log(doc);
            res.send("Successfully deleted the account");
            deleteFromFolders(folders);
            deleteFromTodolists(todolists);
            deleteFromNotes(notes);
            deleteFromEvents(events);
          }
        });
      }
    });
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});
async function deleteFromFolders(folders) {
  try {
    let bookmarkDeleted = false;
    bookmarkDeleted = await deleteFromBookmarks(folders);
    console.log(bookmarkDeleted);
    if (bookmarkDeleted) {
      Folder.deleteMany({ _id: { $in: folders } }, async (err, doc) => {
        if (err) throw err;
        else {
          console.log("deleted folders");
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
}

const deleteFromBookmarks = (folders) => {
  console.log("delete from folders", folders);
  const promise = new Promise((resolve) => {
    for (let folder of folders) {
      //console.log(folder);
      const folderId = mongoose.Types.ObjectId(folder);
      Folder.find({ _id: folderId }, async (err, doc) => {
        if (err) throw err;
        else {
          console.log(doc[0].bookmarks);
          let bk = doc[0].bookmarks;
          Bookmark.deleteMany({ _id: { $in: bk } }, async (err, doc) => {
            console.log("deleted bookmarks");
            resolve(true);
          });
        }
      });
    }
  });
  return promise;
};

async function deleteFromTodolists(todolists) {
  let todosDeleted = false;
  todosDeleted = await deleteFromTodos(todolists);
  console.log(todosDeleted);
  if (todosDeleted) {
    Todolist.deleteMany({ _id: { $in: todolists } }, async (err, doc) => {
      if (err) throw err;
      else {
        console.log("deleted todolists");
      }
    });
  }
}

const deleteFromTodos = (todolists) => {
  console.log("delete from todolists", todolists);
  const promise = new Promise((resolve) => {
    for (let todolist of todolists) {
      //console.log(folder);
      const todolistId = mongoose.Types.ObjectId(todolist);
      Todolist.find({ _id: todolistId }, async (err, doc) => {
        if (err) throw err;
        else {
          console.log(doc[0].todos);
          let todos = doc[0].todos;
          Todo.deleteMany({ _id: { $in: todos } }, async (err, doc) => {
            console.log("deleted todos");
            resolve(true);
          });
        }
      });
    }
  });
  return promise;
};
const deleteFromNotes = (notes) => {
  console.log("delete from notes", notes);
  Note.deleteMany({ _id: { $in: notes } }, async (err, doc) => {
    if (err) throw err;
    else {
      console.log("deleted notes");
    }
  });
};

const deleteFromEvents = (events) => {
  console.log("delete from events", events);
  Calendar.deleteMany({ _id: { $in: events } }, async (err, doc) => {
    if (err) throw err;
    else {
      console.log("deleted events");
    }
  });
};

module.exports = router;
