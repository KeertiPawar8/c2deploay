const express = require("express")

const blogRouter = express.Router();
const {BlogModel} = require("../models/blog.model")
const mongoose = require("mongoose")
const {authenticate} = require("../middlewares/auth")

const {authorise} = require("../middlewares/authorise")


blogRouter.post("/createblog",async(req,res)=>{
  
  
const blog = new BlogModel(req.body)
await blog.save();
res.send({msg:"blog has been created"})

})


blogRouter.get("/getblog",async(req,res)=>{
  const blog = await BlogModel.find({userID:req.body.userID})
  res.send(blog)
})

blogRouter.patch("/update/:id",async(req,res)=>{
const id = req.params.id
  const user  = await BlogModel.find({_id:id})
  

  if(user[0].userID == req.body.userID){
      
      
    const update = await BlogModel.findByIdAndUpdate({_id:id},req.body)
res.send({msg:"blog has been updated"})




  }
  else{
    res.send({msg:"not authorised"})
  }



})

blogRouter.delete("/delete/:id",async(req,res)=>{
  const id = req.params.id
    const user  = await BlogModel.find({_id:id})
  
  
    if(user[0].userID == req.body.userID){
        
        
      await BlogModel.findByIdAndDelete ({_id:id})
  res.send({msg:"blog has been deleted"})
  
  
  
  
    }
    else{
      res.send({msg:"not authorised"})
    }
  
  
  
  })


  blogRouter.delete("/deletemoderator/:id",authorise(["Moderator"]),async(req,res)=>{
    const id = req.params.id
      
          
      await BlogModel.findByIdAndDelete ({_id:id})
    res.send({msg:"blog has been deleted"})
    
    // localhost:8080/deletemoderator/643d20e232bffdc76f64097e
    
    
    
    
    
    
    })
  


module.exports = {
    blogRouter
};
