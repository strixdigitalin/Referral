const POST = require("../model/Post");
const USER = require("../model/CustomerModel");
const validator = require("../validator/validator");
const { post } = require("../router/UserRoutes");

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
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    console.log(postId);

    if (!validator.isValidRequestBody(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "post Id (postId) is required" });
    }
    await POST.findByIdAndDelete(postId);
    res
      .status(200)
      .send({ success: true, message: "Post successfully deleted" });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};
module.exports = { UploadPost, getPosts, deletePost };

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
