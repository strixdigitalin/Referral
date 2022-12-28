const mongoose = require("mongoose");
const PostModel = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    amount: {
      type: Number,
      required: true,
    },
    cashBack: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// userdata.createIndex({ location_1: "2dsphere" });
// userdata.createIndex({ location_1: "2dsphere" });

module.exports = new mongoose.model("transaction", PostModel);
