// APP SETUP
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
// const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
// const crypto = require("crypto");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const passport = require("passport");
// const GitHubStrategy = require("passport-github2").Strategy;
require("./middleware/auth.js");

const app = express();

// ROUTES FILES
const authRoutes = require("./routes/auth.js");
const dashboardRoutes = require("./routes/dashboard.js");
const employmentRoutes = require("./routes/employment.js");
const educationRoutes = require("./routes/education.js");
const profileRoutes = require("./routes/profile.js");
const projectsRoutes = require("./routes/projects.js");
const settingsRoutes = require("./routes/settings.js");

// DATABASE SETUP
const MONGODB_URI = config.CONNECTION_URL;
// Session store with mongo
// const mongoStore = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: "sessions",
// });

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

// APP CONFIG
app.use(passport.initialize());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(
  cookieSession({
    name: "github-session", //name of the cookie containing access token in the //browser
    secret: "asdfgh",
    httpOnly: true,
  })
);

// ROUTES
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/employment", employmentRoutes);
app.use("/profile", profileRoutes);
app.use("/education", educationRoutes);
app.use("/projects", projectsRoutes);
app.use("/settings", settingsRoutes);

// ERROR HANDLERS
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401);
    res.json({ message: err.name + ": " + err.message });
  }
  console.log(err);
});

// LISTENING
app.listen(process.env.PORT || 3000, () => {
  console.log("Serving on port 3000");
});
