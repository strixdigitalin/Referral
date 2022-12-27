const express = require("express");
const router = express.Router();
const multer = require("multer");
const { UploadPost } = require("../controller/PostControl");
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

const PostRouter = router;
module.exports = PostRouter;
