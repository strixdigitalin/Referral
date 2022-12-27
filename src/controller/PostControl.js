const POST = require("../model/Post");
const USER = require("../model/CustomerModel");
const validator = require("../validator/validator");

const UploadPost = async (req, res, next) => {
  const { userId } = req.body;
  const uploadedFile = req.files.image[0];

  if (!validator.isValidRequestBody(userId)) {
    return res
      .status(400)
      .send({ status: false, message: "User Id  (userId) is required" });
  }
  const saveInDb = await POST.create({
    userId,
    fileName: uploadedFile.filename,
    title: req.body.title ? req.body.title : null,
    filePath: uploadedFile.path,
  });
  await USER.updateOne({ _id: userId }, { $push: { post: saveInDb._id } });

  res.status(200).send({
    success: true,
    message: "Send it",
    data: saveInDb,
  });
};

const getPosts = async (req, res, next) => {
  try {
    const data = await POST.find(req.query);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { UploadPost };

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
