const mongoose = require("mongoose");
const PostModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    filePath: String,
    fileName: String,
    title: String,
  },
  { timestamps: true }
);

// userdata.createIndex({ location_1: "2dsphere" });
// userdata.createIndex({ location_1: "2dsphere" });

module.exports = new mongoose.model("post", PostModel);
