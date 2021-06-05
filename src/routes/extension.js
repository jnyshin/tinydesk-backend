const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const cookie = require("cookie");
const getFavicons = require("get-website-favicon");
//Router
const router = express.Router();

router.post("/", async (req, res) => {
  const obj = req.body;

  const thumbnails = [
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/6_swmitf.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724486/1_gbw5js.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/2_dzq3ab.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/7_kjri0t.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/4_k8qnmd.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/3_nwf6nx.png",
    "https://res.cloudinary.com/commandt/image/upload/v1622724485/5_fdgne3.png",
  ];
  const rand = Math.floor(Math.random() * 7);
  var thumbnail = thumbnails[rand];

  const cookieValue = cookie.parse(req.headers.cookie)[process.env.COOKIE_NAME];
  console.log(cookieValue);
  await getFavicons(req.body.url)
    .then((faviconData) => {
      console.log(faviconData);
      if (faviconData.icons.length !== 0) {
        thumbnail = faviconData.icons[faviconData.icons.length - 1].src;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  try {
    Session.findOne({ "session.cookieVal": cookieValue }, async (err, doc) => {
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
                title: obj.data.title,
                url: obj.data.url,
                color: obj.data.color,
                thumbnail: thumbnail,
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
