const SendError = (field, res) => {
  res.status(400).send({ status: false, message: `${field} is required` });
};

const SendSuccess = (data = [], message = "success", res) => {
  res.status(200).send({ status: true, message, data });
};

module.exports = {
  SendError,
  SendSuccess,
};
