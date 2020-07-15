const express = require("express");
const app = express();
const passport = require("passport");
const passportSetup = require("./config/passport");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cluster = require("cluster");
const os = require("os");
const cookie = require("cookie-session");

if (cluster.isMaster) {
  const cpu = os.cpus().length;
  for (let i = 0; i < cpu; i++) {
    cluster.fork();
  }
} else {
  (async function makeDb() {
    await mongoose.connect(keys.mongoDB.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected ");
  })().then(() => app.listen(3000, () => console.log("listening.")));

  app.set("view engine", "ejs");
  app.use(
    cookie({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [keys.session.cookieKey],
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/", (req, res) => {
    res.render("home", { user: req.user });
  });

  app.use("/auth", require("./routes/auth"));
  app.use("/profile", require("./routes/profile"));
}

cluster.on("exit", (worker) => {
  console.log("worker dying with id", worker.id);
});
