const express = require("express");
const router = express.Router();

const {
  UploadPost,
  getPosts,
  deletePost,
  commentOnPost,
  LikeUnlike,
} = require("../controller/PostControl");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  upload.fields([{ name: "image", maxCount: 1 }]),
  UploadPost
);
router.get("/get", getPosts);
router.delete("/delete/:postId", upload.none(), deletePost);
router.post("/comment", upload.none(), commentOnPost);
router.post("/like-unlike", upload.none(), LikeUnlike);

const PostRouter = router;
module.exports = PostRouter;
