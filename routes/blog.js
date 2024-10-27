require("dotenv").config();

const { Router } = require("express");
const router = Router();

const Blog = require("../models/blog");
const Comment = require("../models/comments");

const multer = require("multer");
const path = require("path");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    format: async (req, file) => "jpg", // supports promises as well
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    transformation: [
      { width: 1200, height: 1200, crop: "fill", gravity: "auto" },
      {
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

const upload = multer({ storage: storage });

router.get("/add", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const createdBy = req.user.id;
  // console.log(createdBy);
  const blog = await Blog.create({
    title,
    body,
    coverImageURL: req.file.path,
    createdBy,
  });
  res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  const comment = await Comment.create({
    content: req.body.commentBody,
    blogId: req.params.blogId,
    createdBy: req.user.id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});
module.exports = router;
