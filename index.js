// APP SETUP
const mod = require("./modules").module;
const app = mod.express();
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
const MONGODB_URI = mod.config.CONNECTION_URL;
// Session store with mongo
// const mongoStore = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: "sessions",
// });

mod.mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mod.mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

// APP CONFIG
app.use(mod.passport.initialize());
app.use(mod.bodyParser.json({ limit: "30mb", extended: true }));
app.use(mod.bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(mod.cors());
app.use(mod.logger("dev"));
app.use(mod.express.json());
app.use(mod.express.urlencoded({ extended: false }));
app.use(mod.cookieParser());
app.use(mod.express.static(mod.path.join(__dirname, "public")));
app.use(
  mod.cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);
app.use(
  mod.cookieSession({
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
