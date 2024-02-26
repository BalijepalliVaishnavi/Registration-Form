const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
let server;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Listening to PORT:- ${port}`);
    });
  })
  .catch((error) => console.log(error.message));

const registerbiSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

const Registration = mongoose.model("Registration", registerbiSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await Registration.findOne({ email: email});
        if (!existingUser){
        const registerbiData = new Registration({
          name,
          email,
          password
        });
        await registerbiData.save();
        res.redirect("/success");
      }
      else {
        // Send response indicating user already exists
        //res.status(409).send("User already exists");
        //alert("User already exist");
        res.redirect("/error");
      }
  }catch{
      //console.log("error");
      res.redirect("/error");

    }
})
app.get("/success", (req, res)=>{
  res.sendFile (__dirname+"/pages/success.html");
})
app.get("/error", (req, res)=>{
  res.sendFile (__dirname+"/pages/error.html");
})
//app.listen(port, ()=>{
    //console.log(`server is running on port ${port}`);
//})