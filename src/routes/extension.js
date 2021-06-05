const express = require("express");
const Session = require("../schemas/session_db");
const mongoose = require("mongoose");
const User = require("../schemas/user");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const cookie = require("cookie");

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
  const pickFn = (sizes, pickDefault) => {
    const appleTouchIcon = sizes.find((item) => item.rel.includes("apple"));
    return appleTouchIcon || pickDefault(sizes);
  };
  const metascraper = require("metascraper")([
    require("metascraper-logo-favicon")({
      pickFn,
    }),
  ]);
  const got = require("got");
  (async () => {
    try {
      const { html, url } = await got(obj.data.url);
      const metadata = await metascraper({ html, url });
      if (metadata.logo !== null) {
        thumbnail = metadata.logo;
      }
    } catch (err) {
      console.error(err);
    }
    const cookieValue = cookie.parse(req.headers.cookie)[
      process.env.COOKIE_NAME
    ];
    console.log(cookieValue);
    try {
      Session.findOne(
        { "session.cookieVal": cookieValue },
        async (err, doc) => {
          if (err) console.error(err);
          else {
            const passportId = mongoose.Types.ObjectId(
              doc.session.passport.user
            );
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
        }
      );
    } catch (error) {
      res.send({ result: "not login" });
    }
  })();
});

module.exports = router;
