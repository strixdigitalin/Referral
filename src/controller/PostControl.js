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
    let limit = 100;
    let page = 0;
    if (req.query.limit) {
      limit = req.query.limit;
    }

    if (req.query.page) {
      page = +req.query.page - 1;
    }
    const data = await POST.find(req.query)
      .populate({
        path: "comments.from",
        select: { firstName: 1, lastName: 1, avatar: 1 },
      })
      .populate({
        path: "likes",
        select: { firstName: 1, lastName: 1, avatar: 1 },
      })
      .skip(page * limit)
      .limit(limit);

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
const commentOnPost = async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;
    const text = req.body.text;

    if (!validator.isValidRequestBody(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "post Id (postId) is required" });
    }
    if (!validator.isValidRequestBody(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId (userId) is required" });
    }
    if (!validator.isValidRequestBody(text)) {
      return res
        .status(400)
        .send({ status: false, message: "Text (text) is required" });
    }
    await POST.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            from: userId,
            text,
            time: new Date(),
          },
        },
      },
      { new: true }
    );
    res.status(200).send({ success: true, message: "Comment Added" });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};
const LikeUnlike = async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const userId = req.body.userId;

    if (!validator.isValidRequestBody(postId)) {
      return res
        .status(400)
        .send({ status: false, message: "post Id (postId) is required" });
    }
    if (!validator.isValidRequestBody(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId (userId) is required" });
    }
    const post = await POST.findById(postId);
    if (post.likes.includes(userId)) {
      post.likes.pop(userId);
      await post.save();
      res.status(200).send({ success: true, message: "Post Unliked" });
      return null;
    } else {
      post.likes.push(userId);

      await post.save();
      res.status(200).send({ success: true, message: "Post liked" });
      return null;
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  UploadPost,
  getPosts,
  deletePost,
  commentOnPost,
  LikeUnlike,
};

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
