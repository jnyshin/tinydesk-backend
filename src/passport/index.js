const passport = require("passport");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/user");
const Bookmark = require("../schemas/bookmark_db");
const Folder = require("../schemas/folder_db");
const Note = require("../schemas/notes_db");
const Todolist = require("../schemas/todolist_db");
const Todo = require("../schemas/todo_db");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV } = process.env;

let callback_url;
if (NODE_ENV == "development") {
  callback_url = "http://localhost:4000/google/callback";
} else {
  callback_url = "https://commandt-backend.herokuapp.com/google/callback";
}

module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ _id: id });
      return done(null, user);
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "No such user exists " });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          done(null, false, { message: "Wrong password" });
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: callback_url,
      },
      async (accessToken, refreshToken, profile, cb) => {
        User.findOne({ googleId: profile.id }, async (err, doc) => {
          try {
            if (doc) {
              return cb(null, doc);
            } else {
              var user = new User();

              // ------------
              const newBookmark = new Bookmark({
                title: "Google",
                url: "https://www.google.com",
                color: "clear",
                thumbnail: "https://www.google.com/favicon.ico",
              });
              const newBookmarkApple = new Bookmark({
                title: "Apple",
                url: "https://www.apple.com",
                color: "clear",
                thumbnail: "https://www.apple.com/favicon.ico",
              });

              await newBookmark.save();
              await newBookmarkApple.save();
              //make initial todo
              const newTodo = new Todo({
                title: "New Todo",
                isComplete: false,
              });
              await newTodo.save();
              //make an initial folder
              const newFolder = new Folder({
                title: "New Folder",
                bookmarks: [newBookmark._id, newBookmarkApple._id],
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
                title: "New Note",
                content: "{\"blocks\":[{\"key\":\"csign\",\"text\":\"Welcome to Command T!\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
              });
              await newNote.save();
              // ------------

              user.googleId = profile.id;
              user.email = profile.emails[0].value;
              user.location = {
                id: 1843561,
                name: "Incheon",
                state: "",
                country: "KR",
                coord: {
                  lon: 126.416107,
                  lat: 37.450001,
                },
              };
              user.notes = [newNote._id];
              user.todolists = [newTodolist._id];
              user.folders = [newFolder._id];
              user.backgroundImg = {
                unsplashID: "pic1",
                url: "https://images.unsplash.com/photo-1513735718075-2e2d37cb7cc1?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzU0MzZ8MHwxfHNlYXJjaHwzfHxsaWdodGhvdXNlfGVufDB8fHx8MTYyMjU1MjkyNA&ixlib=rb-1.2.1&q=85",
                author: "someone",
              };
              user.name = profile.displayName;
              user.username = profile.emails[0].value;
              user.keepUnicorn = true;
              user.events = [];

              await user.save();

              console.log("User successfully saved into the database!");

              return cb(null, user);
            }
          } catch (error) {
            console.error(error);
            cb(error);
          }
          // if (err) {
          //   return cb(err, null);
          // }

          // if (!doc) {
          //     const newBookmark = new Bookmark({
          //         title: "Command T Repository",
          //         url: "https://github.com/janarosmonaliev/project-416",
          //         color: "green",
          //         thumbnail: "https://github.githubassets.com/apple-touch-icon-180x180.png",
          //     });
          //     await newBookmark.save();
          //     //make initial todo
          //     const newTodo = new Todo({ title: "New Todo", isComplete: false });
          //     await newTodo.save();
          //     //make an initial folder
          //     const newFolder = new Folder({
          //         title: "New Folder",
          //         bookmarks: [newBookmark._id],
          //     });
          //     await newFolder.save();
          //     //make an initial todolist
          //     const newTodolist = new Todolist({
          //         title: "New Todolist",
          //         todos: [newTodo._id],
          //     });
          //     await newTodolist.save();
          //     //make an initial note
          //     const newNote = new Note({
          //         title: "New Npte",
          //         content: "Welcome to Command T!",
          //     });
          //     await newNote.save();

          //     const newUser = new User({
          //         googleId: profile.id,
          //         email: profile.emails[0].value,
          //         location: {id: 1843702, name: 'Icheon-si', state: '', country: 'KR', coord: {lon: 127.442497, lat: 37.279171}},
          //         notes: [newNote._id],
          //         todolists: [newTodolist._id],
          //         folders: [newFolder._id],
          //         backgroundImg: {
          //             unsplashID: "pic1",
          //             url: "https://images.unsplash.com/photo-1481414981591-5732874c7193?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMjAyNzR8MHwxfHNlYXJjaHw1fHxvcmFuZ2V8ZW58MHwwfHx8MTYxODU1NjAxNQ&ixlib=rb-1.2.1&q=85",
          //             author: "someone",
          //         },
          //         name: profile.name.givenName,
          //         username: profile.name.givenName,
          //         keepUnicorn: true,
          //     });

          //   await newUser.save();
          //   cb(null, newUser);
          // }
          // cb(null, doc);
        });
      }
    )
  );
};
