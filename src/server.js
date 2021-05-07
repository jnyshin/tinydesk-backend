const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const User = require("./schemas/user");

mongoose.connect(
  "mongodb+srv://yejin:Jnysh1nE%23@commandtbackend.4toiz.mongodb.net/commandTMainDev?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected!");
  }
);

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

app.use(cookieParser("unicorncode"));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

const initialLocation = {
  id: 1843564,
  name: "Incheon",
  state: "",
  country: "KR",
  coord: {
    lon: 126.731667,
    lat: 37.453609,
  },
};

// Routes
app.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("user Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        email: req.body.email,
        location: initialLocation,
        password: hashedPassword,
        notes: [],
        todolists: [],
        folders: [],
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

//Authentication should be done.
//(1)check our User collection
app.post("/login", (req, res) => {
  User.findOne(
    { email: req.body.email }, //dummy data
    async (err, doc) => {
      if (err) throw err;
      if (!doc) res.send("User does not exist");
      if (doc) {
        req.session.userInfo = doc;
        res.send(doc);
      }
    }
  );
});

// or (2) using passport
// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) throw err;
//     if (!user) res.send("No User Exists");
//     else {
//       req.logIn(user, (err) => {
//         if (err) throw err;
//         res.send("Successfully Authenticated");
//         console.log(req.user);
//       });
//     }
//   })(req, res, next);
// });

//this query works now
app.get("/home", (req, res) => {
  const userInfo = req.session.userInfo;
  req.session.userInfo = null; //reset session variable after
  //res.send(userInfo);
  res.send("This page should be our Command T homepage");
});

app.get("/", (req, res) => {
  res.send(
    "Hi, we are Team KGB! This website is for our web application, Command T."
  );
});

app.get("/login", (req, res) => {
  res.send("This is Command T Log in page");
});

app.get("/signup", (req, res) => {
  res.send("This is Command T Sign Up page");
});

// This code starts the express server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server started successfully");
});
