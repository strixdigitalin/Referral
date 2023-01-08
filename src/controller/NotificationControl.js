const Notification = require("../model/Notification");

const getNotifications = async (req, res) => {
  try {
    let limit = 100;
    let page = 0;
    if (req.query.limit) {
      limit = req.query.limit;
    }
    if (req.query.page) {
      page = +req.query.page - 1;
    }

    const data = await Notification.find(req.query)
      .skip(page * limit)
      .limit(limit);

    if (data.length == 0) {
      res.status(200).send({ success: true, message: "data not found" });
    } else {
      res.status(200).send({ success: true, data });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
const updateNotification = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) {
      res.status(200).send({
        success: false,
        message: "Notification id (id) is required",
      });
      return null;
    }
    if (!status) {
      res.status(200).send({
        success: false,
        message: "Status (status) is required. [true,false]",
      });
      return null;
    }
    const data = await Notification.findOneAndUpdate(
      { _id: id },
      {
        status,
      },
      { new: true }
    );
    if (!data) {
      res.status(200).send({ success: true, message: "data not found" });
    } else {
      res.status(200).send({ success: true, data });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
module.exports = { getNotifications, updateNotification };
