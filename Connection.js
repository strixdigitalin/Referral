const mongoose = require("mongoose");

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
