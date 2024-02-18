// APP SETUP
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");
const passport = require("passport");
const helmet = require("helmet");
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
const mongoStore = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

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
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      scriptSrc: [
        "'self'",
        "https://www.googletagmanager.com",
        config.ENVIRONMENT.apiUrl,
      ],
      connectSrc: ["'self'", "https://region1.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://www.roadmapr.dev",
        "https://roadmapr-s3-bucket.s3.eu-north-1.amazonaws.com",
        "https://ghchart.rshah.org",
        "https://avatars.githubusercontent.com",
        "blob:",
      ],
    },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client")));
app.use(
  cors({
    origin: [config.ENVIRONMENT.apiUrl],
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
    store: mongoStore,
  })
);

// ROUTES
// Redirect HTTP requests to HTTPS
app.use((req, res, next) => {
  if (!req.secure && req.get("X-Forwarded-Proto") !== "https") {
    return res.redirect("https://" + req.get("Host") + req.url);
  }
  next();
});

// Handle www and non-www redirection
app.use((req, res, next) => {
  const host = req.get("Host");
  if (host.startsWith("www.")) {
    const redirectHost = host.substring(4); // Remove 'www.' from the beginning
    return res.redirect(301, "https://" + redirectHost + req.url);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

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
