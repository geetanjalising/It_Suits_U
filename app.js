require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT||8006;


const cors = require("cors");
// app.use(cors());
app.use("*",cors({
   origin:true,
   credentials:true
}));

app.listen(port, () => {
  console.log(`server is running on ${port}`);
})




//database connection
const mongoose = require("mongoose")
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => console.log("data base connected")).catch((error) => console.log("error" + error.message));

const Products = require("./Products/productschema");

const DefaultData = require("./Products/defaultdata")
DefaultData();

app.use(express.json());



//Routing
app.get("/getallproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log("console the data"+productsdata);
    res.status(201).json(productsdata);
  }
  catch (error) {
    console.log("error" + error.maeesage);
  }

})

app.get("/getoneproductdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const isproduct = await Products.findOne({ id: id });
    res.status(201).json(isproduct);
  }
  catch (error) {

    console.log("error" + error.message);
  }
})

const USER = require("./User/userschema");

app.post("/register", async (req, res) => {
  //console.log(req.body);
  const { fname, email, mobile, password, cpassword } = req.body;
  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "fill all the data" });
    console.log("not data available");
  };

  try {
    const preuser = await USER.findOne({ email: email });
    if (preuser) {
      res.status(422).json({ error: "this user is already present" })
    }
    else if (password !== cpassword) {
      res.status(422).json({ error: "password and cpassword not match" })
    }
    else {
      const finaluser = new USER({
        fname, email, mobile, password, cpassword
      });

      //password hashing process goes here
      //console.log("final"+finaluser); 
      const storedata = await finaluser.save();
      //res.status(222).json({ error: "pasdfghjj t gygh u tch" })
      //  console.log("DFDFF"+storedata);
      res.status(201).json(storedata);

    }
  }
  catch (error) {
    console.log("error the bhai catch ma for registratoin time" + error.message);
    res.status(422).send(error);
  }
});

const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// const jwt = require("jsonwebtoken");
// const secretKey = process.env.KEY;

app.post("/signin", async (req, res) => {
  //console.log("Helli")
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "fill all the data" })
  };
  try {

    const userlogin = await USER.findOne({ email: email });
    //console.log(userlogin);
    if (userlogin) {

      const isMatch = await bcrypt.compare(password, userlogin.password);
     // console.log(isMatch + " password match ");

    
      if (!isMatch) {

        res.status(400).json({ error: "invalid details" })

      }
      else {
      
      const token = await userlogin.generateAuthtoken();
      //console.log(token);


      res.cookie("Amazonweb", token, {
        expires: new Date(Date.now() + 5999999999),
        httpOnly: true
      }).json({
        status:"Ok",
      })
     
       // res.status(201).json({ userlogin })
      }
    } else {
      res.status(400).json({ error: "invalid details" });
    }
  } 
  catch (error) { 
    res.status(400).json({ error: "invalid details" })
  }
})

const authenticate = require("./middleware/authenticate");

app.post("/addcart/:id", authenticate, async (req, res) => {

  try {
    //console.log("before1");
    const { id } = req.params;
  //  console.log(id);
    const cart = await Products.findOne({ id: id });
   // console.log(cart + "cart value");

    const UserContact = await USER.findOne({ _id: req.userID });
   // console.log(UserContact);

    if (UserContact) {
      const cartData = await UserContact.addcartdata(cart);

      await UserContact.save();
     // console.log(cartData);
      res.status(201).json(UserContact);
      //console.log("Usercontact valid");
    }
    else {
      res.status(401).json({ error: "invalid user1" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid user2" });

  }
})

app.get("/cartdetails", authenticate,async (req,res) => {
  //console.log("router pr a gya");
  try{
     // console.log("try pr a gya");
      const buyuser = await USER.findOne({_id: req.userID});
      //console.log(buyuser + "user hain buy pr");
      await buyuser.save();
      res.status(201).json(buyuser);
      //console.log("buyuser pr a gya");
  }catch(error){
  console.log(error + "error for buynow");
  }  
})

app.get("/validuser", authenticate,async (req,res) => {
  console.log("entered in valid router")
  try{
      const validuser = await USER.findOne({_id: req.userID});
      console.log("validuser->"+validuser);
      res.status(201).json(validuser);
  }catch(error){
  console.log(error +"in validuser");
  }  
})    

app.delete("/remove/:id", authenticate,async (req,res) => {
  try{
     const {id}=req.params;

     req.rootUser.carts = req.rootUser.carts.filter((currval)=>{
      return currval.id!=id;
     });

     req.rootUser.save();
     res.status(201).json(req.rootUser);
     console.log("item remove");
   }catch(error){
  console.log(error + "error");
  res.status(400).json(error);
  }  
})

app.get("/logout", authenticate, async (req, res) => {
  try {
      req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
          return curelem.token !== req.token
      });

      res.clearCookie("Amazonweb", { path: "/" });
      req.rootUser.save();
      res.status(201).json(req.rootUser.tokens);
      console.log("user logout");

  } catch (error) {
      console.log(error + "jwt provide then logout");
  }
});