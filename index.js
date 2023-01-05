const express = require("express");
const router = require("./src/router/UserRoutes");
const app = express();
var multer = require("multer");
var forms = multer();
app.use(express.json());
// const multer=require('multer')
// app.use(multer().any())

const mongoose = require("mongoose");

// .connect(
//   "mongodb+srv://ABHI:1rgLK1SKF60O1lEF@cluster0.skx8q.mongodb.net/strix",
//   {
mongoose
  .connect(
    "mongodb+srv://Akshay:Same4All@cluster0.6yo8k.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(async (db) => {
    console.log("connected to database");
    const cre = await db.models.user.createIndexes({ location_1: "2dsphere" });
    // console.log(cre, ">>>cre");
  })
  .catch((err) => {
    console.log(err);
  });

var bodyParser = require("body-parser");
// app.use(forms.array());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

var cors = require("cors");
const PostRouter = require("./src/router/Post");
const WalletRouter = require("./src/router/Wallet");
const NotificationRouter = require("./src/router/Notification");
app.use(cors({ origin: true, credentials: true }));

// Put these statements before you define any routes.

app.use(function (req, res, next) {
  console.log(req._parsedUrl.path, "----<<<<<<<<<<<Current ");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/user", router);
app.use("/post", PostRouter);
app.use("/order", WalletRouter);
app.use("/notification", NotificationRouter);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
