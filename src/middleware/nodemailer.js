const nodemailer=require('nodemailer')
const transport=nodemailer.createTransport({
  host:'smpt.gmail.com',
  port:587,
  secure:false,
  requireTLS:true,
  auth:{
    user:"webmohanty@gmail.com",
    pass:"Aisha@2001"
   
  }
  
  });
  var mailOptions={
    from:'webmohanty@gmail.com',
    to:'webmohanty@gmail.com',
    subject:'strix login',
    text:"your onetime password"
  }
  transport.sendMail(mailOptions,function(err,info){
    if(err){
      console.log
    }
  })
