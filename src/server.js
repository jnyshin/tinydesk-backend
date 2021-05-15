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
var ObjectId = require("mongodb").ObjectId;

const User = require("./schemas/user");
const Folder = require("./schemas/folder_db");
const Note = require("./schemas/notes_db");
const Todolist = require("./schemas/todolist_db");
const Bookmark = require("./schemas/bookmark_db");
const Todo = require("./schemas/todo_db");

// const mongoUri = process.env.MONGODB_URI;
mongoose
  .connect(
    "mongodb+srv://yejin:teamkgb@commandtbackend.4toiz.mongodb.net/commandTMainDev?retryWrites=true&w=majority",
    // ||
    // "mongodb://localhost:27017/test",
    // mongoUri,
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

// Use these when you pass cors
const whilelist = [
  "http://localhost:8000",
  "https://commandt.herokuapp.com",
  "https://janarosmonaliev.github.io",
];
const corsOptions = {
  origin: "http://localhost:8000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

//Some necessary code
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
      //make an initial bookmark
      const newBookmark = new Bookmark({
        title: "Command T Repository",
        url: "https://github.com/janarosmonaliev/project-416",
        color: "green",
        thumbnail:
          "https://github.githubassets.com/apple-touch-icon-180x180.png",
      });
      await newBookmark.save();
      //make initial todo
      const newTodo = new Todo({ title: "New Todo", isComplete: false });
      await newTodo.save();
      //make an initial folder
      const newFolder = new Folder({
        title: "New Folder",
        bookmarks: [newBookmark._id],
      });
      await newFolder.save();
      //make an initial todolist
      const newTodolist = new Todolist({
        title: "New Todolist",
        todos: [newTodo._id],
      });
      await newTodolist.save();
      //make an initial note
      const newNote = new Note({
        title: "New Npte",
        content: "Welcome to Command T!",
      });
      await newNote.save();
      const newUser = new User({
        email: req.body.email,
        location: req.body.city,
        password: hashedPassword,
        notes: [newNote._id],
        todolists: [newTodolist._id],
        folders: [newFolder._id],
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

app.get("/", (req, res) => {
  res.send(
    "Hi, we are Team KGB! This website is for our web application, Command T."
  );
});
app.post("/login", cors(corsOptions), (req, res, next) => {
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

  //This code is just to figure out the problem of Heroku connection.
  // User.findOne({ email: req.body.email }, async (err, doc) => {
  //   if (err) throw err;
  //   if (doc) {
  //     req.session.userInfo = doc;
  //     res.send(doc);
  //   }
  // });
});

app.get('/logout', function(req, res){
  req.logout();
  res.send("Successful logout");
});

app.get("/home", (req, res) => {
  const tmp = req.session.userInfo;
  User.findOne({ email: tmp.email })
    .populate({
      path: "folders",
      model: "Folder",
      populate: {
        path: "bookmarks",
        model: "Bookmark",
      },
    })
    .populate("notes")
    .populate({
      path: "todolists",
      model: "Todolist",
      populate: { path: "todos", model: "Todo" },
    })
    .exec((err, doc) => {
      if (err) throw err;
      if (doc) {
        //console.log(doc);
        res.send(doc);
      }
    });
});

app.post("/home/folder", (req, res) => {
  const tmp = req.session.userInfo; //using this session variable, we can get current user's _id directly
  console.log(req.body.title);
  const newFolder = new Folder({ title: req.body.title, bookmarks: [] });
  newFolder.save();
  console.log(tmp.name);
  User.updateOne({ _id: tmp._id }, { $push: { folders: newFolder._id } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        res.send(doc);
      }
    }
  );
});

app.delete("/home/folder", (req, res) => {
  const tmp = req.session.userInfo;
  const folderId = mongoose.Types.ObjectId(req.body.removeId);
  Folder.deleteOne({ id: folderId }, async (err, doc) => {
    if (err) throw err;
    if (doc) console.log(doc);
  });
  User.updateOne({ _id: tmp._id }, { $pull: { folders: folderId } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("folder deleted");
        res.send(tmp.folders);
      }
    }
  );
});

app.post("/home/todolist", (req, res) => {
  const tmp = req.session.userInfo; //using this session variable, we can get current user's _id directly
  const newTodolist = new Todolist({ title: "", bookmarks: [] });
  newTodolist.save();
  const newId = newTodolist._id;
  User.updateOne(
    { _id: tmp._id },
    { $push: { todolists: newTodolist._id } }
  ).exec((err, doc) => {
    if (err) throw err;
    if (doc) {
      //User.save();
      console.log("New Todolist's id is", newId);
      res.send(newId);
    }
  });
});

app.put("/home/todolist", (req, res) => {
  //const tmp = req.session.userInfo; //using this session variable, we can get current user's _id directly
  // const newTodolist = new Todolist({ title: "", bookmarks: [] });
  // newTodolist.save();
  // const newId = newTodolist._id;
  const todolistId = mongoose.Types.ObjectId(req.body._id);
  console.log("Which todolsit to update: ", todolistId);
  Todolist.updateOne(
    { _id: todolistId },
    { $set: { title: req.body.title } }
  ).exec((err, doc) => {
    if (err) throw err;
    if (doc) {
      //User.save();
      console.log("Updated Todolist's title");
      res.send(doc);
    }
  });
});

app.delete("/home/todolist", (req, res) => {
  const tmp = req.session.userInfo;
  console.log(req.body.removeId);
  const todolistId = mongoose.Types.ObjectId(req.body.removeId);
  Todolist.deleteOne({ id: todolistId }, async (err, doc) => {
    if (err) throw err;
    if (doc) console.log(doc);
  });
  User.updateOne({ _id: tmp._id }, { $pull: { todolists: todolistId } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log("todolist deleted");
        res.send(tmp.todolists);
      }
    }
  );
});

app.post("/home/note", (req, res) => {
  const tmp = req.session.userInfo; //using this session variable, we can get current user's _id directly
  const newNote = new Note({ title: "", content: "" });
  newNote.save();
  User.updateOne({ _id: tmp._id }, { $push: { notes: newNote._id } }).exec(
    (err, doc) => {
      if (err) throw err;
      if (doc) {
        //User.save();
        console.log("note added");
        res.send(doc);
      }
    }
  );
});

// --------------------------------------------------
// Fabio's API routes

// @desc    Removes a note
// @route   DELETE /home/users/<String: username>/notes/
app.delete("/home/notes", (req, res) => {
  // code here
});

// @desc    Update note
// @route   PUT /home/users/<String: username>/notes/<String: noteId>
app.put("/home/notes", (req, res) => {
  // code here
});

// @desc    Change note position
// @route   PUT /home/users/<String: username>/notes/
app.put("/home/todolist", (req, res) => {
  // code here
});

// @desc    Add a widget
// @route   POST /home/users/<String: username>/widgets/
app.post("/home/widgets", (req, res) => {
  // code here
});

// @desc    Removes a widget
// @route   DELETE /home/users/<String: username>/widgets/
app.delete("/home/widgets", (req, res) => {
  // code here
});

// @desc    Change widget's position
// @route   PUT /home/users/<String: username>/widgets/
app.put("/home/widgets", (req, res) => {
  // code here
});

// @desc    Add a bookmark
// @route   POST /home/users/<String: username>/folders/<String: folderId>/bookmarks
app.post("/home/folders/bookmarks", (req, res) => {
  // code here
});

// @desc    Remove a bookmark
// @route   DELETE /home/users/<String: username>/folders/<String: folderId>/bookmarks/<String: bookmarkId>
app.delete("/home/folders/bookmarks", (req, res) => {
  // code here
});

// @desc    Change bookmark's position
// @route   PUT /home/users/<String: username>/folders/<String: folderId>/bookmarks
app.put("/home/folders/bookmarks", (req, res) => {
  // code here
});

// @desc    Add todo
// @route   POST /home/users/<String: username>/todolists/<String: todolistId>/todos
app.post("/home/todolists/todos", (req, res) => {
  // code here
});

// @desc    Remove a completed todo
// @route   DELETE /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
app.delete("/home/todolists/todos", (req, res) => {
  // code here
});

// @desc    Change todo name
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos/<String: todoId>
app.put("/home/todolists/todos", (req, res) => {
  // code here
});

// @desc    Change todo's position
// @route   PUT /home/users/<String: username>/todolists/<String: todolistId>/todos
app.put("/home/todolists/todos", (req, res) => {
  // code here
});

// This code starts the express server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server started successfully");
});
