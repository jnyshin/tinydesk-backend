const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const flash = require("connect-flash");

const User = require("./schemas/user");
const Folder = require("./schemas/folder_db");
// mongoose.connect(
//   "mongodb+srv://yejin:teamkgb@commandtbackend.4toiz.mongodb.net/commandTMainDev?retryWrites=true&w=majority",
//   // "mongodb://localhost:27017/test",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("Mongoose Is Connected!");
//   }
// );
mongoose
  .connect(
    "mongodb+srv://yejin:teamkgb@commandtbackend.4toiz.mongodb.net/commandTMainDev?retryWrites=true&w=majority",
    // "mongodb://localhost:27017/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log("Mongoose Is Connected!");
  })
  .catch((err) => {
    console.error("Failed to connect with MongoDB", err);
  });

//Some necessary code
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8000", // gatsby localhost location
    credentials: true,
  })
);

// Create a cookie
app.use(
  session({
    secret: "unicorncookie",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("unicorncookie"));
app.use(flash());
// Initialize Passport
const passportConfig = require("./passport");
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("user Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newFolder = new Folder({ title: "New Folder", bookmarks: [] });
      await newFolder.save();
      console.log(newFolder);
      const newUser = new User({
        email: req.body.email,
        location: req.body.city,
        password: hashedPassword,
        notes: [],
        todolists: [],
        folders: [newFolder.id],
        backgroundImg: {
          unsplashID: "pic1",
          url:
            "https://images.unsplash.com/photo-1481414981591-5732874c7193?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMjAyNzR8MHwxfHNlYXJjaHw1fHxvcmFuZ2V8ZW58MHwwfHx8MTYxODU1NjAxNQ&ixlib=rb-1.2.1&q=85",
          author: "someone",
        },
        name: req.body.name,
        username: req.body.username,
        keepUnicorn: true,
      });
      await newUser.save();
      res.send("New user created");
    }
  });
});

// Alternative you might want to do something like this, Yejin
// Also, see the code on lines 27 - 34 of the master branch in the
// front end repo to see the front end interacting with this part of the API

// app.get("/home", (req, res) => {
//   req.send(req.user);
// });

app.get("/", (req, res) => {
  res.send(
    "Hi, we are Team KGB! This website is for our web application, Command T."
  );
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        req.session.userInfo = req.user;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

app.get("/home", (req, res) => {
  res.send(req.session.userInfo);
});

// This code starts the express server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server started successfully");
});
