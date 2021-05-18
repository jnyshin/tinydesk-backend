const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Widget = require("../schemas/widget_db");

//Router
const router = express.Router();

//Routes = /home/widgets

// @desc    Add a widget
// @route   POST /home/users/<String: username>/widgets/
router.post("/", (req, res) => {
  // code here
});

// @desc    Removes a widget
// @route   DELETE /home/users/<String: username>/widgets/
router.delete("/", (req, res) => {
  // code here
});

// @desc    Change widget's position
// @route   PUT /home/users/<String: username>/widgets/
router.put("/", (req, res) => {
  // code here
});

module.exports = router;
