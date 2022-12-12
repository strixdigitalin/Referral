
const c_models= require('../model/CustomerModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator= require('../validator/validator')
const createUser = async function (req, res) {

  try {
      let userDetails = req.body
      if (!validator.isValidRequestBody(userDetails)) {
          return res.status(400).send({ status: false, message: "please provide valid user Details" })
      }
//firstname
      if (!validator.isValid(userDetails.firstName)) {
          return res.status(400).send({ status: false, message: "first name is required" })
      }
//lastname
      if (!validator.isValid(userDetails.lastName)) {
          return res.status(400).send({ status: false, message: "last name is required" })
      }
//mobile
      if (!validator.isValid(userDetails.mobile)) {
        return res.status(400).send({ status: false, message: "phone number is required" })
    }
    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(userDetails.mobile))
        return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

    const checkPhoneFromDb = await c_models.findOne({ mobile: userDetails.mobile })

    if (checkPhoneFromDb) {
        return res.status(400).send({ status: false, message: `${userDetails.mobile} is already in use, Please try a new phone number.` })
    }
//emailId
      if (!validator.isValid(userDetails.emailId)) {
          return res.status(400).send({ status: false, message: "Email-ID is required" })
      }

      if (!/\S+@\S+\.\S+/.test(userDetails.emailId))
          return res.status(400).send({ status: false, message: "Invalid Email id." })

      const checkEmailFromDb = await c_models.findOne({ emailId: userDetails.emailId })

      if (checkEmailFromDb) {
          return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
      }

      if (!validator.isValid(userDetails.city)) {
          return res.status(400).send({ status: false, message: "city is required" })
      }

      if(!validator.isValid(userDetails.postcode)) {
        return res.status(400).send({ status: false, message: "passcode is required" })
      }

      if(!validator.isValid(userDetails.age)) {
        return res.status(400).send({ status:false,message:"passcode is required"})
      }
      

      

      if (!validator.isValid(userDetails.password)) {
        return res.status(400).send({ status: false, message: "password is required" })
    }
    if (!validator.isValid(userDetails.roll)) {
      return res.status(400).send({ status: false, message: "roll is required" })
  }

    if (userDetails.password.length < 8 || userDetails.password.length > 15) {
      return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
    }//confrom password
    if(!(userDetails.password.length==userDetails.confirmPassword.length)) {
      return res.status(400).send({status:false,message:"password not match"})
    }
    const hashedPassword = await bcrypt.hash(userDetails.password, 10)
    userDetails.password = hashedPassword
    const c_hashedPassword = await bcrypt.hash(userDetails.confirmPassword, 10)
    userDetails.confirmPassword = c_hashedPassword
      

      const saveUserInDb = await c_models.create(userDetails);

      return res.status(201).send({ status: true, message: "user created successfully!!", data: saveUserInDb });

  } catch (err) {

      return res.status(500).send({ status: false, error: err.message })

  }

}




/**********************************************************User LogIn************************************************/


const userLogin = async function (req, res) {

  try {

      const loginDetails = req.body;

      const { emailId, password } = loginDetails;

      if (!validator.isValidRequestBody(loginDetails)) {
          return res.status(400).send({ status: false, message: 'Please provide login details' })
      }

      if (!validator.isValid(emailId)) {
          return res.status(400).send({ status: false, message: 'Email-Id is required' })
      }


      if (!validator.isValid(password)) {
          return res.status(400).send({ status: false, message: 'Password is required' })
      }

      const userData = await c_models.findOne({ emailId });

      if (!userData) {
          return res.status(401).send({ status: false, message: `Login failed!! Email-Id is incorrect!` });
      }

      const checkPassword = await bcrypt.compare(password, userData.password)

      if (!checkPassword) return res.status(401).send({ status: false, message: `Login failed!! password is incorrect.` });
      let userId=userData._id
      const token = jwt.sign({
          userId: userId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
      }, 'BYRD87KJVUV%^%*CYTC')

      return res.status(200).send({ status: true, message: "LogIn Successful!!", data: {userId:userId,Token:token} });

  } catch (err) {

      return res.status(500).send({ status: false, error: err.message });

  }
}




// /****************************************************************Get User Data********************************************/

const getUserDetails = async function (req, res) {

  try {

      const userId = req.params.userId
      const userIdFromToken = req.userId

        
      // res.status(200).send({message:"done"})
      // return null
      if (!validator.isValidObjectId(userId)) {
          return res.status(400).send({ status: false, message: "Invalid userId" })
      }

      const findUserDetails = await c_models.findById(userId)

      if (!findUserDetails) {
          return res.status(404).send({ status: false, message: "User Not Found!!" })
      }

      // if (findUserDetails._id.toString() != userIdFromToken) {
      //     return res.status(403).send({ status: false, message: "You Are Not Authorized!!" });
      // }

      return res.status(200).send({ status: true, message: "Profile Fetched Successfully!!", data: findUserDetails })

  } catch (err) {

      return res.status(500).send({ status: false, error: err.message })

  }
}


// /************************************************************Update User Details*********************************************/

const updateUserDetails = async function (req, res) {

  try {

      
      let userDetails = req.body
      let userId = req.params.userId
      

      if (!validator.isValidObjectId(userId)) {
          return res.status(400).send({ status: false, message: "Invalid UserId" })
      }

      const findUserData = await c_models.findById(userId)

      if (!findUserData) {
          return res.status(404).send({ status: false, message: "user not found" })
      }


      let {firstName,lastName,mobile,emailId,city,postcode,age,gender} = userDetails

      
      if (!validator.isValidRequestBody(userDetails)) {
          return res.status(400).send({ status: false, message: "Please provide user's details to update." })
      }

      if (!validator.validString(firstName)) {
          return res.status(400).send({ status: false, message: 'first name is Required' })
      }

      if (!validator.validString(lastName)) {
          return res.status(400).send({ status: false, message: 'last name is Required' })
      }

      if (!validator.validString(emailId)) {
          return res.status(400).send({ status: false, message: 'email is Required' })
      }
      if (emailId) {

          if (!/\S+@\S+\.\S+/.test(userDetails.emailId))
              return res.status(400).send({ status: false, message: "Invalid Email id." })

          const checkEmailFromDb = await c_models.findOne({ emailId: userDetails.emailId })

          if (checkEmailFromDb)
              return res.status(404).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
      }


      if (!validator.validString(mobile)) {
          return res.status(400).send({ status: false, message: 'phone number is Required' })
      }

      // if (mobile) {
      //     if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/).test(userDetails.mobile))
      //         return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

      //     const checkPhoneFromDb = await c_models.findOne({ phone: userDetails.mobile })

      //     if (checkPhoneFromDb) {
      //         return res.status(400).send({ status: false, message: `${userDetails.mobile} is already in use, Please try a new phone number.` })
      //     }
      // }


      

      let updatedData={
        firstName:firstName,
        firstName:lastName,
        emailId:emailId,
        mobile:mobile,
        city:city,
        postcode:postcode,
        age:age,
        gender:gender,
      
      }
  

      let updateProfileDetails = await c_models.findOneAndUpdate(
          { _id: userId },
            updatedData,
          { new: true })

      return res.status(200).send({ status: true, msg: "User Update Successful!!", data: updateProfileDetails })

  } catch (err) {
      return res.status(500).send({ status: false, error: err.message })
  }
}

module.exports={createUser,userLogin,getUserDetails,updateUserDetails}

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
