const express = require("express");
const { sendMail } = require("../middleware/nodemailer");
const CustomerModel = require("../model/CustomerModel");
const Otp = require("../model/Otp");
const { SendError, SendSuccess } = require("../router/Response");
const router = express.Router();
const bcrypt = require("bcrypt");
const { validatePassWord } = require("../validator/validator");

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
    const data = await CustomerModel.findOneAndUpdate(
      { emailId },
      { isEmailVerified: true },
      { new: true }
    );
    res.status(200).send({
      status: true,
      data,
      message: "Email has been successfully verified",
    });
  } else {
    res.status(200).send({ status: true, message: "Verification failed" });
  }
};

const forgotPassword = async (req, res, next) => {
  const { currPass, newPass, userId } = req.body;

  if (!currPass) {
    res
      .status(200)
      .send({ status: false, message: "Current password is required" });
    return null;
  }
  if (!userId) {
    res.status(200).send({ status: false, message: "userId is required" });
    return null;
  }
  if (!newPass) {
    res
      .status(200)
      .send({ status: false, message: "New Password is required" });
    return null;
  }
  const user = await CustomerModel.findById(userId);
  const checkPassword = await bcrypt.compare(currPass, user.password);
  const validatePass = validatePassWord(newPass);
  if (validatePass == null) {
    return res.status(200).send({
      success: false,
      message:
        "Password must be 8-16 characters long, must have at least one uppercase, at least one lowercase, at least one digit and at least on special symbol",
    });
  }
  if (checkPassword) {
    if (currPass == newPass) {
      return res.status(400).send({
        success: false,
        message: "Current password and new password must be different",
      });
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await CustomerModel.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).send({
      success: false,
      message: "Password Changed",
    });
  } else {
    res.status(400).send({
      success: false,
      message: "Incorrect password",
      validatePass,
    });
  }
};

module.exports = { verify, SendOtp, forgotPassword };
