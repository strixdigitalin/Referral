const Notification = require("../model/Notification");

const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find(req.query);
    if (data.length == 0) {
      res.status(200).send({ success: true, message: "data not found" });
    } else {
      res.status(200).send({ success: true, data });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
module.exports = { getNotifications };
