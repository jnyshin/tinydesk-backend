//Required
//Frameworks goes here
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
//Routers
const authRouter = require("./routes/auth.js");
const folderRouter = require("./routes/folder.js");
const homeRouter = require("./routes/home.js");
const todolistRouter = require("./routes/todolists");
const noteRouter = require("./routes/notes");
const widgetRouter = require("./routes/widgets");
const bookmarkRouter = require("./routes/bookmarks");
const todoRouter = require("./routes/todos");
const backgroundRouter = require("./routes/background");
const accountRouter = require("./routes/account");
const calendarRouter = require("./routes/calendar");
const extensionRouter = require("./routes/extension");
//Passport
const passport = require("passport");
const passportConfig = require("./passport");
//Others
const session = require("express-session");
const MongoStore = require("connect-mongo");
const corsMiddleware = require("./cors");
const app = express();

//------------------------------------------------------------
//Middleware goes here
//Keep it order please
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log("Mongoose Is Connected!");
  })
  .catch((err) => {
    console.error("Failed to connect with MongoDB", err);
  });

app.use(corsMiddleware);

const sessionStore = new MongoStore({
  mongoUrl: MONGO_URI,
  collectionName: "sessions",
  stringify: false,
});
// //Passport Configuration
//Need to be in order!
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: process.env.COOKIE_NAME,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
      // httpOnly: true,
      httpOnly: false,

      // 2nd change.
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "",
    },
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig();

//-------------------------------------------------------
//Routers Middleware goes here
app.use("/", authRouter);
app.use("/home", homeRouter);
app.use("/home/folder", folderRouter);
app.use("/home/todolists", todolistRouter);
app.use("/home/notes", noteRouter);
app.use("/home/widgets", widgetRouter);
app.use("/home/bookmarks", bookmarkRouter);
app.use("/home/todos/", todoRouter);
app.use("/home/background/", backgroundRouter);
app.use("/home/account/", accountRouter);
app.use("/home/calendar", calendarRouter);
app.use("/extension/", extensionRouter);
//code to get thumbnail image of bookmark
app.post("/bookmark", async (req, res) => {
  try {
    const url =
      "https://www3.cs.stonybrook.edu/~alexkuhn/cse416-spring2021/schedule.html"; //replace this with request body
    const { hostname } = new URL(url);
    const faviconUrl = "chrome://favicon/https://" + hostname;
    console.log(faviconUrl);
    res.send(faviconUrl);
  } catch (e) {
    console.log(e);
  }
});

//Listen
app.listen(process.env.PORT || 4000, () => {
  console.log("Server started successfully");
});
