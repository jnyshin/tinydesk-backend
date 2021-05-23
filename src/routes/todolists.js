const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Todolist = require("../schemas/todolist_db");

//Router
const router = express.Router();

// Routes = /home/todolist
router.post("/", (req, res) => {
  const userId = req.user._id; //using this session variable, we can get current user's _id directly
  const newTodolist = new Todolist({ title: "", bookmarks: [] });
  newTodolist.save();
  const newId = newTodolist._id;
  User.updateOne(
    { _id: userId },
    { $push: { todolists: newTodolist._id } }
  ).exec((err, doc) => {
    if (err) throw err;
    if (doc) {
      //User.save();
      console.log("New Todolist's id is", newId);
      res.send(newId);
    }
  });
});

router.put("/", (req, res) => {
  //USE const userId = req.userId to get ID

  //const tmp = req.session.userInfo; //using this session variable, we can get current user's _id directly
  // const newTodolist = new Todolist({ title: "", bookmarks: [] });
  // newTodolist.save();
  // const newId = newTodolist._id;
  const todolistId = mongoose.Types.ObjectId(req.body._id);
  console.log("Which todolsit to update in back: ", todolistId);
  Todolist.updateOne(
    { _id: todolistId },
    { $set: { title: req.body.title } }
  ).exec((err, doc) => {
    if (err) throw err;
    if (doc) {
      //User.save();
      console.log("Updated Todolist's title");
      res.send(doc);
    }
  });
});

router.delete("/", (req, res) => {
  //changed from const tmp = req.session.user
  const userId = req.user._id;
  console.log(req.body.removeId);
  const todolistId = mongoose.Types.ObjectId(req.body.removeId);
  Todolist.deleteOne({ id: todolistId }, async (err, doc) => {
    if (err) throw err;
    if (doc) console.log(doc);
  });
  //Changed tmp._id
  User.updateOne({ _id: userId }, { $pull: { todolists: todolistId } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("todolist deleted");
        //no more tmp
        res.send(doc);
      }
    }
  );
});

router.put("/order", (req, res) => {
  const userId = req.user._id;
  const todolistId = req.body._id;
  const newIndex = req.body.newIndex;
  console.log("change to position ", newIndex);
  //remove the original
  User.updateOne({ _id: userId }, { $pull: { todolists: todolistId } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("todolist pulled ", todolistId);
        res.send(doc);
      }
    }
  );
  //put the todolist into new index position
  User.updateOne(
    { _id: userId },
    { $push: { todolists: { $each: [todolistId], $position: newIndex } } }
  ).exec((err, doc) => {
    if (err) throw err;
    if (doc) {
      //User.save();
      console.log("todolist pushed into ", newIndex);
      res.send();
    }
  });
});

module.exports = router;
