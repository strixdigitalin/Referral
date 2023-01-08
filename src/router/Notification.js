const express = require("express");
const router = express.Router();

const {
  UploadPost,
  getPosts,
  deletePost,
} = require("../controller/PostControl");
const multer = require("multer");
const {
  getNotifications,
  updateNotification,
} = require("../controller/NotificationControl");

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

router.get("/get", upload.none(), getNotifications);
router.post("/update", upload.none(), updateNotification);

const NotificationRouter = router;
module.exports = NotificationRouter;
