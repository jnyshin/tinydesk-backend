const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Todolist = require("../schemas/todolist_db");

//Router
const router = express.Router();

// Routes = /home/todolist
router.post("/", (req, res) => {
  try {
    const userId = req.user._id; //using this session variable, we can get current user's _id directly
    const newTodolist = new Todolist({ title: req.body.title, todos: [] });
    newTodolist.save();
    const newId = newTodolist._id;
    User.updateOne(
      { _id: userId },
      { $push: { todolists: newTodolist._id } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          //User.save();
          console.log("New Todolist's id is", newId);
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

//change title
router.put("/", (req, res) => {
  try {
    const todolistId = mongoose.Types.ObjectId(req.body._id);
    console.log("Which todolsit to update in back: ", todolistId);
    Todolist.updateOne(
      { _id: todolistId },
      { $set: { title: req.body.title } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          //User.save();
          console.log("Updated Todolist's title");
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

router.delete("/", (req, res) => {
  try {
    //changed from const tmp = req.session.user
    const userId = req.user._id;
    const todolistId = req.body.removeId;
    console.log("got this todolist's id: ", todolistId);
    Todolist.deleteOne({ _id: todolistId }, async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
      }
    });
    //Changed tmp._id
    User.updateOne(
      { _id: userId },
      { $pull: { todolists: todolistId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("todolist deleted");
          //no more tmp
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

//url is /home/todolists/order
router.put("/order", (req, res) => {
  try {
    const userId = req.user._id;
    const todolistId = req.body._id;
    const newIndex = req.body.newIndex;
    console.log("change to position ", newIndex);
    //remove the original
    User.updateOne(
      { _id: userId },
      { $pull: { todolists: todolistId } },
      async (err, doc) => {
        if (err) throw err;
        if (doc) {
          //User.save();
          console.log("todolist pulled ", todolistId);
        }
        //put the todolist into new index position
        User.updateOne(
          { _id: userId },
          {
            $push: { todolists: { $each: [todolistId], $position: newIndex } },
          },
          async (err, doc) => {
            if (err) throw err;
            if (doc) {
              //User.save();
              console.log("todolist pushed into ", newIndex);
              res.send();
            }
          }
        );
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("error");
    console.log(error);
  }
});

module.exports = router;
