const mongoose=require("mongoose")
const userdata=new mongoose.Schema({
  firstName:{
    type:String,
    require:true,
    trim:true
  },
  lastName:{
    type:String,
    require:true,
    trim:true
  },
  mobile:{
    type:Number,
    require:true,
    unique: true

  },
  emailId:{
type:String,
require:true,
unique: true
  },
  city:{
    type:String,
require:true
  },
  postcode:{
    type:Number,
    require:true
  },
  age:{
    type:Number,
    require:true
  },
  roll:{
    type:String,
    require:true,
    enum: ["user","vendar"]
  },

  password:{
    type:"String",
    require:true
  },
  confirmPassword:{
    type:"String",
    require:true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
}


},{timestamps:true})



module.exports=new mongoose.model("user",userdata)