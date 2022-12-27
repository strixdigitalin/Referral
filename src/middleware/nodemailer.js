const nodemailer = require("nodemailer");
const { callbackPromise } = require("nodemailer/lib/shared");
const { MAIEL_ID, PASSWORD } = require("../../GlobalConstants");

let mailTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: MAIEL_ID,
    pass: PASSWORD,
  },
});

let mailDetails = (otp) => {
  return {
    from: MAIEL_ID,
    to: "",
    subject: "Vefiy your account",
    text: "This is your otp" + otp,
  };
  // html: "",
};
let ForgetPAsswordDetails = (data) => {
  console.log(data._id);
  link = `${process.env.FRONTEND_URL}/` + data._id + "/" + data.jwtToken;
  return {
    from: process.env.MAIEL_ID,
    to: "lakheraakshay1@gmail.com",
    subject: "Vefiy your account",
    //   text: "Node.js testing mail for GeeksforGeeks",
    html:
      "<div style='color:white;display:flex;justify-content:center;width:100%'><a href=" +
      link +
      "> <button style='width:300px;padding:10px'>Reset Password</button></a></div>",
  };
};

const sendMail = (email, otp, callBack) => {
  mailTransporter.sendMail(
    {
      ...mailDetails(otp),
      to: email,
    },
    function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
        callBack(false);
      } else {
        console.log("Email sent successfully");
        callBack(true);
      }
    }
  );
};
const ForgetPasswordMail = (data) => {
  mailTransporter.sendMail(
    {
      ...ForgetPAsswordDetails(data),
      to: data.email,
    },
    function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent successfully");
      }
    }
  );
};

module.exports = { sendMail, ForgetPasswordMail };
