const express = require("express");
const router = express.Router();

const {
  UploadPost,
  getPosts,
  deletePost,
} = require("../controller/PostControl");
const multer = require("multer");
const {
  createOrder,
  getOrders,
  ApproveOrder,
  getOrdersStatistic,
} = require("../controller/Walletcontroler");
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

router.post("/pay", upload.none(), createOrder);
router.get("/get", upload.none(), getOrders);
router.get("/statistic", upload.none(), getOrdersStatistic);
router.post("/approve/:id", upload.none(), ApproveOrder);

const WalletRouter = router;
module.exports = WalletRouter;
