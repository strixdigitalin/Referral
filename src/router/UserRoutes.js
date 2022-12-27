const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/auth");
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
router.post("/signup", createUser2);
router.post("/login", userLogin);
// router.get("/user", getUserDetails);
router.get("/user", getUserDetails2);
router.put("/user/:userId", updateUserDetails);
router.delete("/user/:userId", deleteUser);
router.post("/sendotp", SendOtp);
router.post("/verifyotp", verify);
router.post("/change-pass", forgotPassword);

// app.get("/user/:userId",userAuthentication,getUserDetails)

module.exports = router;
