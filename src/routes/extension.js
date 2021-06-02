const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  const data = Object.keys(req.body)[0];
  console.log(data);
  const obj = JSON.parse(data);
  console.log(obj);
  const cookieVal = obj.cookie;
  const { url, title, color } = obj.data;

  try {
    Session.findOne({ "session.cookieVal": cookieVal }, async (err, doc) => {
      if (err) console.error(err);
      else {
        const passportId = mongoose.Types.ObjectId(doc.session.passport.user);
        User.findOne({ _id: passportId })
          .populate("folders")
          .exec((err, doc) => {
            if (err) console.error(err);
            else {
              const folderId = doc.folders[0]._id;
              const newBookmark = new Bookmark({
                title: title,
                url: url,
                color: color,
                thumbnail: "",
              });
              newBookmark.save();
              const newId = newBookmark._id;
              Folder.updateOne(
                { _id: folderId },
                { $push: { bookmarks: newId } },
                async (err, doc) => {
                  if (err) res.send({ result: "failure" });
                  if (doc) {
                    res.send({ result: "success" });
                  }
                }
              );
            }
          });
      }
    });
  } catch (error) {
    res.send({ result: "not login" });
  }
});

module.exports = router;
