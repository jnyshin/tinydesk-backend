const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const cookie = require("cookie");
const fetchFavicons = require("@getstation/fetch-favicon").fetchFavicons;
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

  await fetchFavicons(obj.data.url)
    .then((icons) => {
      const apple = icons.filter(
        (icon) => icon.name == "apple-touch-icon" && icon.size != null
      );
      const faviconsWithSize = icons.filter(
        (icon) => icon.name == "icon" && icon.size != null
      );
      const favicons = icons.filter((icon) => icon.name == "icon");
      if (apple.length !== 0) {
        apple.sort((a, b) => {
          if (a.size > b.size) return 1;
          else if (a.size < b.size) return -1;
          else return 0;
        });
        thumbnail = apple[apple.length - 1].href;
      } else if (faviconsWithSize.length !== 0) {
        faviconsWithSize.sort((a, b) => {
          if (a.size > b.size) return 1;
          else if (a.size < b.size) return -1;
          else return 0;
        });
        thumbnail = faviconsWithSize[faviconsWithSize.length - 1].href;
      } else if (favicons.length !== 0) {
        thumbnail = favicons[0].href;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  try {
    Session.findOne({ "session.cookieVal": cookieValue }, (err, doc) => {
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
  } catch (err) {
    res.send({ result: "not login" });
  }
});

module.exports = router;
