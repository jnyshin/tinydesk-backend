const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  const data = Object.keys(req.body)[0];
  const obj = JSON.parse(data);
  console.log(obj);
  // const folderId = req.body._id;
  // const newBookmark = new Bookmark({ title: req.body.title, url: req.body.url, color: req.body.color, thumbnail: req.body.thumbnail });
  // newBookmark.save();
  // const newId = newBookmark._id;
  // Folder.updateOne({ _id: folderId }, { $push: { bookmarks: newId } },
  //   async (err, doc) => {
  //       if (err) throw err;
  //       if (doc) {
  //         console.log("New Bookmark's id is", newId);
  //         res.send(newId);
  //       }
  //   });
  // try {
  //   Session.findOne({ "session.cookieVal": cookieVal }, async (err, doc) => {
  //     if (err) throw err;
  //     else {
  //       console.log(doc);
  //       // console.log(doc.session.passport.user);
  //       const passportId = mongoose.Types.ObjectId(doc.session.passport.user);
  //       User.findOne({ _id: passportId })
  //         .populate("folders")
  //         .exec((err, doc) => {
  //           if (err) throw err;
  //           else {
  //             console.log(doc);
  //             res.send(doc.folders);
  //           }
  //         });
  //     }
  //   });
  // } catch (error) {
  //   res.send("error");
  // }
});

module.exports = router;
