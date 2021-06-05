const express = require("express");
const mongoose = require("mongoose");
const Folder = require("../schemas/folder_db");
const Bookmark = require("../schemas/bookmark_db");
const getFavicons = require("get-website-favicon");

const router = express.Router();
// @desc    Add a bookmark
// @route   POST /bookmarks
router.post("/", async (req, res) => {
  // code here
  var thumbnail = req.body.thumbnail;

  (async () => {
    try {
      const { body: html, url } = await got(req.body.url);
      const metadata = await metascraper({ html, url });
      if (metadata.logo !== null) {
        thumbnail = metadata.logo;
      }
    } catch (err) {
      console.error(err);
    }
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
  })();
});

// @desc    Remove a bookmark
// @route   DELETE /bookmarks
router.delete("/", (req, res) => {
  const folderId = req.body._id;
  const bookmarkId = req.body.removeId;
  console.log("got this bookmark's id: ", bookmarkId);
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
  var thumbnail = req.body.thumbnail;
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
  Bookmark.updateOne(
    { _id: bookmarkId },
    {
      $set: {
        title: req.body.title,
        url: req.body.url,
        color: req.body.color,
        thumbnail: thumbnail,
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
