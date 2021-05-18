const express = require("express");
const User = require("../schemas/user");
const Todo = require("../schemas/todo_db");
const mongoose = require("mongoose");

//Router
const router = express.Router();

//Routes = /home/todolists

// @desc    Add todo
// @route   POST /home/users/<String: username>/todolists/<String: todolistId>/todos
router.post("/todos", (req, res) => {
  // code here
});

// @desc    Remove a completed todo
// @route   DELETE /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
router.delete("/todos", (req, res) => {
  // code here
});

// @desc    Change todo name
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
router.put("/todos", (req, res) => {
  // code here
});

// @desc    Change todo's position
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos
router.put("/todos", (req, res) => {
  // code here
});
module.exports = router;
