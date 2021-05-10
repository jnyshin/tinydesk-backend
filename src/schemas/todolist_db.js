const mongoose = require("mongoose");
const todolist = new mongoose.Schema({
  // todolist title, array of Todos in the list
  title: String,
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

module.exports = mongoose.model("Todolist", todolist);
