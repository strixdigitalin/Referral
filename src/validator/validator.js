const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const validString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const validatePassWord = (pass) => {
  let regex =
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/;
  const matchIt = pass.match(regex);
  console.log(matchIt, "<<<<this is matchit");
  return matchIt;
};

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  validString,
  validatePassWord,
};
