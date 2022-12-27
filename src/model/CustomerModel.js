const mongoose = require("mongoose");
const userdata = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
    },
    mobile: {
      type: Number,
      require: true,
      unique: true,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
    },
    city: {
      type: String,
      require: true,
    },
    postcode: {
      type: Number,
      require: true,
    },
    age: {
      type: Number,
      require: true,
    },
    role: {
      type: String,
      require: true,
      enum: ["user", "admin", "vendor"],
    },

    password: {
      type: "String",
      require: true,
    },
    gstNumber: {
      type: "String",
    },
    businessName: {
      type: "String",
    },
    businessAddress: {
      type: "String",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lat: {
      type: String,
    },
    long: {
      type: String,
    },
    post: [],
    location_1: {
      type: {
        type: String,
        default: "Point",
      },
      // coordinates: { type: [Number] },
      coordinates: [],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);
userdata.index({ location_1: "2dsphere" });
// userdata.createIndex({ location_1: "2dsphere" });
// userdata.createIndex({ location_1: "2dsphere" });

module.exports = new mongoose.model("user", userdata);
