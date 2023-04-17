const express = require("express");
const { connection } = require("./db");
const app = express();
app.use(express.json())
require("dotenv").config()
const {userRouter} = require("./routes/user.routes")
const {blogRouter} = require("./routes/blog.routes");
const { authenticate } = require("./middlewares/auth");

app.use("/",userRouter)
app.use(authenticate)
app.use("/",blogRouter)

app.listen(process.env.port,async()=>{
    await connection
    console.log(   `server is running at port ${process.env.port}`)
})