require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const connectDB = require("./server/config/db.js");

const app = express();
const port = 5000 || process.env.PORT;

// User Model (replace with actual user Model created)
const User = require("./server/models/User");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //allows to use form values
app.use(cookieParser());

// Connect to MongoDB
connectDB();

app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);

// Templating engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Passport Configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect email or password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Registration Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, email, passowrd: hashedPassword });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "An error occured during registration" });
  }
});

// Login Route
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Logout Route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
