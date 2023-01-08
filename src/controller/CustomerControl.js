const c_models = require("../model/CustomerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../validator/validator");
const { generateJWt } = require("../middleware/auth");

const createUser = async function (req, res) {
  try {
    let userDetails = req.body;
    console.log(req.body, "<<<<<this is body");
    if (!validator.isValidRequestBody(userDetails)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid user Details" });
    }
    //firstname
    if (!validator.isValid(userDetails.firstName)) {
      return res
        .status(400)
        .send({ status: false, message: "first name is required" });
    }
    //lastname
    if (!validator.isValid(userDetails.lastName)) {
      return res
        .status(400)
        .send({ status: false, message: "last name is required" });
    }
    //mobile
    if (!validator.isValid(userDetails.mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });
    }
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(userDetails.mobile))
      return res.status(400).send({
        status: false,
        message: "Phone number must be a valid a number.",
      });

    const checkPhoneFromDb = await c_models.findOne({
      mobile: userDetails.mobile,
    });

    if (checkPhoneFromDb) {
      return res.status(400).send({
        status: false,
        message: `${userDetails.mobile} is already in use, Please try a new phone number.`,
      });
    }
    //emailId
    if (!validator.isValid(userDetails.emailId)) {
      return res
        .status(400)
        .send({ status: false, message: "Email-ID is required" });
    }

    if (!/\S+@\S+\.\S+/.test(userDetails.emailId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Email id." });

    const checkEmailFromDb = await c_models.findOne({
      emailId: userDetails.emailId,
    });

    if (checkEmailFromDb) {
      return res.status(400).send({
        status: false,
        message: `emailId is Exists. Please try another email Id.`,
      });
    }

    if (!validator.isValid(userDetails.city)) {
      return res
        .status(400)
        .send({ status: false, message: "city is required" });
    }

    if (!validator.isValid(userDetails.postcode)) {
      return res
        .status(400)
        .send({ status: false, message: "passcode is required" });
    }

    if (!validator.isValid(userDetails.age)) {
      return res
        .status(400)
        .send({ status: false, message: "passcode is required" });
    }

    if (!validator.isValid(userDetails.password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    if (!validator.isValid(userDetails.role)) {
      return res
        .status(400)
        .send({ status: false, message: "role is required" });
    }
    if (!validator.isValid(userDetails.lat)) {
      return res
        .status(400)
        .send({ status: false, message: "latitude is required" });
    }
    if (!validator.isValid(userDetails.long)) {
      return res
        .status(400)
        .send({ status: false, message: "longitude is required" });
    }
    const validatePass = validator.validatePassWord(userDetails.password);
    if (validatePass == null) {
      return res.status(200).send({
        success: false,
        message:
          "Password must be 8-16 characters long, must have at least one uppercase, at least one lowercase, at least one digit and at least on special symbol",
      });
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = hashedPassword;

    const coordinates = [
      parseFloat(userDetails.long),
      parseFloat(userDetails.lat),
    ];

    const saveUserInDb = await c_models.create({
      ...userDetails,
      location_1: {
        type: "Point",
        coordinates,
      },
    });

    return res.status(201).send({
      status: true,
      message: "user created successfully!!",
      data: saveUserInDb,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};
const createUser2 = async function (req, res) {
  try {
    let userDetails = req.body;
    console.log(req.body, "<<<<<this is body");
    if (!validator.isValidRequestBody(userDetails)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid user Details" });
    }
    //firstname
    if (!validator.isValid(userDetails.firstName)) {
      return res
        .status(400)
        .send({ status: false, message: "first name is required" });
    }
    //lastname
    if (!validator.isValid(userDetails.lastName)) {
      return res
        .status(400)
        .send({ status: false, message: "last name is required" });
    }
    //mobile
    if (!validator.isValid(userDetails.mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "phone number is required" });
    }
    if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(userDetails.mobile))
      return res.status(400).send({
        status: false,
        message: "Phone number must be a valid a number.",
      });

    const checkPhoneFromDb = await c_models.findOne({
      mobile: userDetails.mobile,
    });

    if (checkPhoneFromDb) {
      return res.status(400).send({
        status: false,
        message: `${userDetails.mobile} is already in use, Please try a new phone number.`,
      });
    }
    //emailId
    if (!validator.isValid(userDetails.emailId)) {
      return res
        .status(400)
        .send({ status: false, message: "Email-ID is required" });
    }

    if (!/\S+@\S+\.\S+/.test(userDetails.emailId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Email id." });

    const checkEmailFromDb = await c_models.findOne({
      emailId: userDetails.emailId,
    });

    if (checkEmailFromDb) {
      return res.status(400).send({
        status: false,
        message: `emailId is Exists. Please try another email Id.`,
      });
    }

    if (!validator.isValid(userDetails.city)) {
      return res
        .status(400)
        .send({ status: false, message: "city is required" });
    }

    if (!validator.isValid(userDetails.postcode)) {
      return res
        .status(400)
        .send({ status: false, message: "passcode is required" });
    }

    if (!validator.isValid(userDetails.age)) {
      return res
        .status(400)
        .send({ status: false, message: "passcode is required" });
    }

    if (!validator.isValid(userDetails.password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    if (!validator.isValid(userDetails.role)) {
      return res
        .status(400)
        .send({ status: false, message: "role is required" });
    }

    if (userDetails.password.length < 8) {
      return res
        .status(400)
        .send({ status: false, message: "Password must be of 8-15 letters." });
    } //confrom password

    const validatePass = validator.validatePassWord(userDetails.password);
    if (validatePass == null) {
      return res.status(200).send({
        success: false,
        message:
          "Password must be 8-16 characters long, must have at least one uppercase, at least one lowercase, at least one digit and at least on special symbol",
      });
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = hashedPassword;

    const saveUserInDb = await c_models.create(userDetails);

    return res.status(201).send({
      status: true,
      message: "user created successfully!!",
      data: saveUserInDb,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

/**********************************************************User LogIn************************************************/

const userLogin = async function (req, res) {
  try {
    const loginDetails = req.body;

    const { emailId, password } = loginDetails;

    if (!validator.isValidRequestBody(loginDetails)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide login details" });
    }

    if (!validator.isValid(emailId)) {
      return res
        .status(400)
        .send({ status: false, message: "Email-Id is required" });
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }

    const userData = await c_models.findOne({ emailId });

    if (!userData) {
      return res.status(401).send({
        status: false,
        message: `Login failed!! Email-Id is incorrect!`,
      });
    }

    const checkPassword = await bcrypt.compare(password, userData.password);

    if (!checkPassword)
      return res.status(401).send({
        status: false,
        message: `Login failed!! password is incorrect.`,
      });
    let userId = userData._id;
    const token = generateJWt({
      _id: userData._id,
      role: userData.role,
      email: userData.emailId,
    });
    const {
      firstName,
      lastName,
      mobile,
      _id,
      city,
      postcode,
      age,
      role,
      isEmailVerified,
      gstNumber,
      isGstVerified,
      businessDescription,
      gender,
    } = userData;
    let sendThis =
      role == "user"
        ? {
            firstName,
            lastName,
            mobile,
            _id,
            city,
            postcode,
            emailId,
            age,
            role,
            isEmailVerified,
            gender,
            token: token,
          }
        : {
            firstName,
            lastName,
            mobile,
            _id,
            city,
            emailId,
            postcode,
            age,
            role,
            isEmailVerified,
            gstNumber,
            isGstVerified,
            businessDescription,
            gender,
            token: token,
          };

    return res.status(200).send({
      status: true,
      message: "LogIn Successful!!",
      data: sendThis,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// /****************************************************************Get User Data********************************************/

const getUserDetails = async function (req, res) {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;

    const findUserDetails = await c_models.find(req.query).populate("post");

    if (!findUserDetails) {
      return res
        .status(404)
        .send({ status: false, message: "User Not Found!!" });
    }

    // if (findUserDetails._id.toString() != userIdFromToken) {
    //     return res.status(403).send({ status: false, message: "You Are Not Authorized!!" });
    // }

    if (findUserDetails.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Data not found",
        // data: findUserDetails,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Profile Fetched Successfully!!",
      data: findUserDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};
const getUserDetails2 = async function (req, res) {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    let findUserDetails = [];

    if (req.query.lat && req.query.long) {
      console.log(req.query);
      let location_1 = [parseFloat(req.query.long), parseFloat(req.query.lat)];
      findUserDetails = await c_models.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: location_1 },
            distanceField: "dist.calculated",
            includeLocs: "dist.location",
            spherical: true,
            //  maxDistance: 1000,
          },
        },
      ]);
    } else {
      findUserDetails = await c_models.find(req.query);
    }

    if (!findUserDetails) {
      return res
        .status(404)
        .send({ status: false, message: "User Not Found!!" });
    }

    if (findUserDetails.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Data not found",
        // data: findUserDetails,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Profile Fetched Successfully!!",
      data: findUserDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// /************************************************************Update User Details*********************************************/

const updateUserDetails = async function (req, res) {
  try {
    let userDetails = req.body;
    let userId = req.params.userId;
    // const uploadedFile = req.files.avatar[0];
    // console.log(req.files.avatar);

    if (userDetails.password) {
      delete userDetails.password;
    }
    if (userDetails._id) {
      delete userDetails._id;
    }

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid UserId" });
    }

    if (userDetails.emailId) {
      const checkUserEmail = await c_models.find({
        emailId: userDetails.emailId,
      });
      console.log(checkUserEmail);
      if (checkUserEmail.length) {
        res.status(400).send({
          message: "User already exist with this email.",
          status: false,
        });
        return null;
      }
    }

    if (req.files.avatar) {
      userDetails.avatar = req.files.avatar[0].filename;
    }

    let updateProfileDetails = await c_models.findOneAndUpdate(
      { _id: userId },
      userDetails,
      { new: true }
    );

    return res.status(200).send({
      status: true,
      msg: "User Update Successful!!",
      data: updateProfileDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  if (!validator.isValidObjectId(userId)) {
    return res.status(400).send({ status: false, message: "Invalid UserId" });
  }
  const deleteIt = await c_models.findByIdAndDelete(userId);
  return res.status(200).send({ message: "User successfully deleted" });
};

const forgetPass = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    res.status(200).send({
      success: true,
      body: { ...req.body },
      mesage: "Passowrd changes",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

module.exports = {
  createUser,
  userLogin,
  getUserDetails,
  createUser2,
  getUserDetails2,
  updateUserDetails,
  deleteUser,
  forgetPass,
};

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
