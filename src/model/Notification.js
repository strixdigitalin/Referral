const mongoose = require("mongoose");
const Notification = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: { type: String, required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Read", "Unread"],
      default: "Unread",
      //   require: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Notification", Notification);
