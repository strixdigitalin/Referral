const express = require("express");
const { sendMail } = require("../middleware/nodemailer");
const CustomerModel = require("../model/CustomerModel");
const Otp = require("../model/Otp");
const { SendError, SendSuccess } = require("../router/Response");
const router = express.Router();
const bcrypt = require("bcrypt");

const SendOtp = async (req, res, next) => {
  try {
    const { emailId, _id } = req.body;

    // console.log(req.body, "<<<this is body");
    if (!emailId) {
      SendError("emailId", res);
      return null;
    }
    if (!_id) {
      SendError("_id (userId)", res);
      return null;
    }
    let otp = 78459;
    sendMail(emailId, otp, async (result) => {
      console.log(result);
      if (result) {
        const sendOtp = await Otp.create({ userId: _id, emailId, otp });

        console.log(sendOtp);
        res.status(200).send({
          status: true,
          message: "Otp successfully send to registered email address",
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const verify = async (req, res, next) => {
  const { emailId, otp, _id } = req.body;
  if (!emailId) {
    SendError("emailId", res);
    return null;
  }

  if (!otp) {
    SendError("otp", res);
    return null;
  }
  if (!_id) {
    SendError("_id (userID)", res);
    return null;
  }
  const checkOtp = await Otp.find({ emailId: emailId });
  if (checkOtp.length == 0) {
    res.status(200).send({ status: true, message: "Data not found" });
    return true;
  }
  console.log(checkOtp);
  if (checkOtp[0].otp == otp) {
    // await Otp.find(checkOtp[0]._id);
    const deleteIt = await Otp.findByIdAndDelete(checkOtp[0]._id);
    await CustomerModel.findOneAndUpdate(
      { emailId },
      { isEmailVerified: true },
      { new: true }
    );
    res
      .status(200)
      .send({ status: true, message: "Email has been successfully verified" });
  } else {
    res.status(200).send({ status: true, message: "Verification failed" });
  }
};

const forgotPassword = async (req, res, next) => {
  const { currPass, newPass } = req.body;

  if (!currPass) {
    res
      .status(200)
      .send({ status: false, message: "Current password is required" });
    return null;
  }
  if (!newPass) {
    res
      .status(200)
      .send({ status: false, message: "New Password is required" });
    return null;
  }
  const checkPassword = await bcrypt.compare(password, userData.password);
  if (!checkPassword) {
    res.status(200).send({ success: false, message: "Current password" });
  }
};

module.exports = { verify, SendOtp, forgotPassword };
