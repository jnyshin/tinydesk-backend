const express = require("express");
const mongoose = require("mongoose");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const router = express.Router();
const fetchFavicons = require("@getstation/fetch-favicon").fetchFavicons;
// @desc    Add a bookmark
// @route   POST /bookmarks
router.post("/", async (req, res) => {
  // code here
  var thumbnail = req.body.thumbnail;
  await fetchFavicons(req.body.url).then((icons) => {
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
  });
  // await getFavicons(req.body.url)
  //   .then((faviconData) => {
  //     console.log(faviconData);
  //     if (faviconData.icons.length !== 0) {
  //       thumbnail = faviconData.icons[faviconData.icons.length - 1].src;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  const folderId = req.body._id;
  const newBookmark = new Bookmark({
    title: req.body.title,
    url: req.body.url,
    color: req.body.color,
    thumbnail: thumbnail,
  });
  newBookmark.save();
  const newId = newBookmark._id;
  Folder.updateOne(
    { _id: folderId },
    { $push: { bookmarks: newId } },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        console.log("New Bookmark's id is", newId);
        const data = {
          newId: newId,
          thumbnail: thumbnail,
        };
        res.send(data);
      }
    }
  );
});

// @desc    Remove a bookmark
// @route   DELETE /bookmarks
router.delete("/", (req, res) => {
  const folderId = req.body._id;
  const bookmarkId = req.body.removeId;
  console.log("got this bookmark's id: ", bookmarkId);
  // Folder.find({ _id: folderId }, async (err, doc) => {
  //   if (err) throw err;
  //   else {
  //     console.log(doc[0].bookmarks);
  //     let bk = doc[0].bookmarks;
  //     Bookmark.deleteMany({ _id: { $in: bk } }, async (err, doc) => {
  //       console.log("deleted bookmarks");
  //       resolve(true);
  //     });
  //   }
  // });
  Bookmark.deleteOne({ _id: bookmarkId }, async (err, doc) => {
    if (err) console.error(err);
    if (doc) {
      console.log(doc);
    }
  });
  Folder.updateOne(
    { _id: folderId },
    { $pull: { bookmarks: bookmarkId } },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        console.log("Bookmark deleted");
        //no more tmp
        res.send(doc);
      }
    }
  );
});

// @desc    Change bookmark's position
// @route   PUT /bookmarks/order
router.put("/order", (req, res) => {
  const folderId = req.body._id;
  const bookmarkId = req.body.removeId;
  const newIndex = req.body.newIndex;
  console.log("change to position ", newIndex);
  //remove the original
  Folder.updateOne(
    { _id: folderId },
    { $pull: { bookmarks: bookmarkId } },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        console.log("bookmark pulled ", bookmarkId);
      }
      //put the note into new index position
      Folder.updateOne(
        { _id: folderId },
        { $push: { bookmarks: { $each: [bookmarkId], $position: newIndex } } },
        async (err, doc) => {
          if (err) console.error(err);
          if (doc) {
            console.log("Bookmark moved to ", newIndex);
            res.send();
          }
        }
      );
    }
  );
});

// @desc Edit a bookmark
// @route PUT /bookmarks
router.put("/", async (req, res) => {
  const bookmarkId = mongoose.Types.ObjectId(req.body._id);

  console.log("Which bookmark to update in back: ", bookmarkId);

  Bookmark.updateOne(
    { _id: bookmarkId },
    {
      $set: {
        title: req.body.title,
        url: req.body.url,
        color: req.body.color,
        thumbnail: req.body.thumbnail,
      },
    },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        console.log("Updated Bookmark");
        res.send(doc);
      }
    }
  );
});
router.post("/move", (req, res) => {
  const { oldFolderId, newFolderId, bookmarkId } = req.body;
  Folder.updateOne(
    { _id: oldFolderId },
    { $pull: { bookmarks: bookmarkId } },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        console.log(doc);
      }
    }
  );
  Folder.updateOne(
    { _id: newFolderId },
    { $push: { bookmarks: bookmarkId } },
    async (err, doc) => {
      if (err) console.error(err);
      if (doc) {
        res.send(doc);
      }
    }
  );
});

module.exports = router;
