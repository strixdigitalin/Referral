const mongoose = require("mongoose");
const otp = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    emailId: {
      type: String,
      require: true,
    },
    otp: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("otp", otp);
