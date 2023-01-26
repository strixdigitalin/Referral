const express = require("express");
const router = express.Router();
const {
  createUser,
  createUser2,
  userLogin,
  getUserDetails,
  updateUserDetails,
  deleteUser,
  getUserDetails2,
} = require("../controller/CustomerControl");
const { SendOtp, verify, forgotPassword } = require("../controller/Otp");
const multer = require("multer");
const { userAuthentication, verifyAdminRole } = require("../middleware/auth");
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
// const { verify } = ;

//importing module
// const userController=require('../controller/CustomerControl')

router.post("/register", upload.none(), createUser);
router.post("/signup", upload.none(), createUser2);
router.post("/login", upload.none(), userLogin);
router.get("/user", getUserDetails);
router.get("/user/near", upload.none(), getUserDetails2);
router.get("/user-near", upload.none(), getUserDetails2);
router.put(
  "/user/:userId",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUserDetails
);
router.delete("/user/:userId", upload.none(), verifyAdminRole, deleteUser);
router.post("/sendotp", upload.none(), SendOtp);
router.post("/verifyotp", upload.none(), verify);
router.post("/change-pass", upload.none(), userAuthentication, forgotPassword);

// app.get("/user/:userId", userAuthentication, getUserDetails);

module.exports = router;
