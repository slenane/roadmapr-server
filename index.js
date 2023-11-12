// APP SETUP
const express = require("express");
const session = require("express-session");
const User = require("./models/User");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");
const passport = require("passport");
const {
  logError,
  logErrorMiddleware,
  returnError,
  isOperationalError,
} = require("./errorHandler");
require("./middleware/passport-authenticate.js");

const app = express();

// ROUTES FILES
const authRoutes = require("./routes/auth.js");
const roadmapRoutes = require("./routes/roadmap.js");
const experienceRoutes = require("./routes/experience.js");
const educationRoutes = require("./routes/education.js");
const profileRoutes = require("./routes/profile.js");
const projectsRoutes = require("./routes/projects.js");
const settingsRoutes = require("./routes/settings.js");
const recommendationsRoutes = require("./routes/recommendations.js");

// DATABASE SETUP
const MONGODB_URI = config.DB_CONNECTION_URL;
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
    name: "github-session", // name of the cookie containing access token in the //browser
    secret: process.env.DB_SECRET,
    httpOnly: true,
  })
);
app.use(
  session({
    secret: config.DB_SECRET, // You should use a secure, random secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/recommendations", recommendationsRoutes);

// ERROR HANDLERS
app.use(logErrorMiddleware);
app.use(returnError);

process.on("unhandledRejection", (error) => {
  throw error;
});

process.on("uncaughtException", (error) => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});

// LISTENING
app.listen(process.env.PORT || 3000, () => {
  console.log("Serving on port 3000");
});
