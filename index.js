require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const userRoute = require("./routes/user.js");
const blogRoute = require("./routes/blog.js");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { checkAuthenticationToken } = require("./middlewares/checkAuth.js");

const Blog = require("./models/blog.js");

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(express.json()); // For JSON payloads
app.use(checkAuthenticationToken("token"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: "desc" });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.get("/src/output.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "src", "output.css"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
