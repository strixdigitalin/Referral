const express=require('express')
const router=express.Router()
const userAuthentication=require('../middleware/auth')



//importing module
// const userController=require('../controller/CustomerControl')
const{createUser,userLogin,getUserDetails,updateUserDetails} =require('../controller/CustomerControl')



router.post('/register',createUser)
router.post('/login',userLogin)
router.get("/user/:userId",getUserDetails)
router.put("/user/:userId",updateUserDetails)
// app.get("/user/:userId",userAuthentication,getUserDetails)

module.exports = router