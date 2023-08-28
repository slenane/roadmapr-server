// APP SETUP
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
// const User = require("./models/User.js");
require("./middleware/auth.js");

// ROUTES FILES
const authRoutes = require("./routes/auth.js");
const dashboardRoutes = require("./routes/dashboard.js");
const employmentRoutes = require("./routes/employment.js");
const educationRoutes = require("./routes/education.js");
const profileRoutes = require("./routes/profile.js");
const projectsRoutes = require("./routes/projects.js");
const settingsRoutes = require("./routes/settings.js");

// DATABASE SETUP
const MONGODB_URI = process.env.CONNECTION_URL;
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
const app = express();
app.use(passport.initialize());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

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
