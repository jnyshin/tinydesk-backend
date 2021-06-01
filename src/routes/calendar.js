const express = require("express");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Calendar = require("../schemas/calendar_db");

//Router
const router = express.Router();

// Routes = /home/calendar
router.post("/", (req, res) => {
  try {
    const userId = req.user._id; //using this session variable, we can get current user's _id directly
    const newEvent = new Calendar({
      title: req.body.title,
      allDay: req.body.allDay,
      start: req.body.start,
      end: req.body.end,
    });
    newEvent.save();
    const newId = newEvent._id;
    User.updateOne({ _id: userId }, { $push: { events: newId } }).exec(
      (err, doc) => {
        if (err) throw err;
        if (doc) {
          //User.save();
          console.log("New event added with id ", newId);
          res.send(newId);
        }
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("Could not add the event");
    console.log(error);
  }
});

//change title, home/calendar/title
router.put("/title", (req, res) => {
  try {
    const eventId = mongoose.Types.ObjectId(req.body._id);
    console.log("Which event to update in back: ", eventId);
    Calendar.updateOne(
      { _id: eventId },
      { $set: { title: req.body.title } }
    ).exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("Updated event's title to ", req.body.title);
        res.send(doc);
      }
    });
  } catch (error) {
    console.log("There was an error");
    res.send("Could not change the event's title");
    console.log(error);
  }
});

//change date according to start or end
router.put("/dates", (req, res) => {
  try {
    const eventId = mongoose.Types.ObjectId(req.body._id);
    const whichDate = req.body.when; //start or end
    console.log(
      "Which event to update in back: ",
      eventId,
      "with ",
      req.body.date,
      whichDate
    );
    if (whichDate === "start") {
      Calendar.updateOne(
        { _id: eventId },
        { $set: { start: req.body.date } },
        async (err, doc) => {
          if (err) throw err;
          if (doc) {
            //User.save();
            console.log("Updated event");
            res.send(doc);
          }
        }
      );
    } else if (whichDate === "end") {
      Calendar.updateOne(
        { _id: eventId },
        { $set: { end: req.body.date } },
        async (err, doc) => {
          if (err) throw err;
          if (doc) {
            //User.save();
            console.log("Updated event");
            res.send(doc);
          }
        }
      );
    }
  } catch (error) {
    console.log("There was an error");
    res.send("Could not change event's dates");
    console.log(error);
  }
});

//change start and end dates, /home/calendar/date
router.delete("/", (req, res) => {
  try {
    //changed from const tmp = req.session.user
    const userId = req.user._id;
    const eventId = req.body.removeId;
    console.log("got this event's id: ", eventId);
    Calendar.deleteOne({ _id: eventId }).exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc);
      }
    });
    //Changed tmp._id
    User.updateOne({ _id: userId }, { $pull: { events: eventId } }).exec(
      (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log("event deleted");
          //no more tmp
          res.send(doc);
        }
      }
    );
  } catch (error) {
    console.log("There was an error");
    res.send("Could not delete event");
    console.log(error);
  }
});

module.exports = router;
