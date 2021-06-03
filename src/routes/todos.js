const express = require("express");
const User = require("../schemas/user");
const Todo = require("../schemas/todo_db");
const Todolist = require("../schemas/todolist_db");
const mongoose = require("mongoose");

//Router
const router = express.Router();

//Routes = /home/todolists

// @desc    Add todo
// @route   POST /home/users/todos
router.post("/", (req, res) => {
  const todolistId = req.body._id;
  const newTodo = new Todo({ title: req.body.title, isComplete: false });
  newTodo.save();
  const newId = newTodo._id;
  Todolist.updateOne(
    { _id: todolistId },
    { $push: { todos: newId } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("New Todo's id is", newId);
        console.log(doc);
        res.send(newId);
      }
    }
  );
});

// @desc    Remove a completed todo
// @route   DELETE /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
router.delete("/", (req, res) => {
  //changed from const tmp = req.session.user
  const todolistId = req.body._id;
  const todoId = req.body.removeId;
  console.log("got this todo's id: ", todoId);
  Todo.deleteOne({ _id: todoId }, async (err, doc) => {
    if (err) throw err;
    if (doc) {
      console.log(doc);
    }
  });
  //Changed tmp._id
  Todolist.updateOne(
    { _id: todolistId },
    { $pull: { todos: todoId } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("deleted from todolist ", todolistId);
        res.send(doc);
      }
    }
  );
});

// @desc    Change todo name
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
router.put("/", (req, res) => {
  const todoId = mongoose.Types.ObjectId(req.body._id);
  console.log("Which todo to update in back: ", todoId);
  Todo.updateOne(
    { _id: todoId },
    { $set: { title: req.body.title } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("Updated Todo's title");
        res.send(doc);
      }
    }
  );
});

// @desc    Change todo's position
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos
router.put("/order", (req, res) => {
  const todolistId = req.body._id;
  const todoId = req.body.removeId;
  const newIndex = req.body.newIndex;
  console.log("change to position ", newIndex);
  //remove the original
  Todolist.updateOne(
    { _id: todolistId },
    { $pull: { todo: todoId } },
    async (err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("todo pulled ", todoId);
      }
      //put the todolist into new index position
      Todolist.updateOne(
        { _id: todolistId },
        { $push: { todo: { $each: [todoId], $position: newIndex } } },
        async (err, doc) => {
          if (err) throw err;
          if (doc) {
            //User.save();
            console.log("todolist pushed into ", todoListId);
            res.send();
          }
        }
      );
    }
  );
});
module.exports = router;
