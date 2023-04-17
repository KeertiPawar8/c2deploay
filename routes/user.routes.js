const {UserModel} = require("../models/user.model")
const mongoose = require("mongoose")
const express = require("express")
const userRouter = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {BlackModel} = require("../models/black.model")
userRouter.post("/signup",async(req,res)=>{

const {name,email,pass,role} = req.body;
console.log(name,email,pass,role)
const checkuser = await UserModel.find({email})

if(checkuser.length>0){
    res.send({msg:"user already exit please login"})
}
else{

    try{
            console.log(name,email,pass,role)
          bcrypt.hash(pass,5,async(err,hash)=>{

                 const user = new UserModel({name,email,pass:hash,role})
                 await user.save()
                 res.send("user has been registered")

          })

    }
    catch(err){
        res.send(err)
    }
}

})

userRouter.post("/login",async(req,res)=>{

    const {email,pass} = req.body;

    const user = await UserModel.find({email})

    if(user.length==0){
        res.send({msg: "user does not exist please signup"})
    }


    else{
              
        bcrypt.compare(pass,user[0].pass,(err,result)=>{
                 
            if(result){

              
                const token = jwt.sign({userID:user[0]._id,role:user[0].role},process.env.JWT_SECRET,{
                    expiresIn:"1m"
                })
        
                const refreshtoken = jwt.sign({userID:user[0]._id,role:user[0].role},process.env.REFRESH_SECRET,{
                    expiresIn:"3m"
                })
        

                res.send({token,refreshtoken})


            }
            else{
                res.send({msg:"wrong credentials"})
            }


        })



    }

})


userRouter.get("/getnewtoken",async(req,res)=>{


  const refreshtoken = req.headers.authorization.split(" ")[1]

  if(refreshtoken){

          const decoded = jwt.verify(refreshtoken,process.env.REFRESH_SECRET);

          if(decoded){
            const token = jwt.sign({userID:decoded._id,role:decoded.role},process.env.JWT_SECRET,{
                expiresIn:"1m"
            })  
                  res.send({token})

          }
          else{
            res.send({msg:"login again"})
          }


  }
  else{
    res.send({msg:"login again"})
  }

})

userRouter.get("/logout",async(req,res)=>{

let token = req.headers.authorization.split(" ")[1]

let black = new BlackModel({token})
await black.save();
res.send({msg:"logout successfull"})


})




module.exports = {
    userRouter
};
