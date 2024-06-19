const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Arpitisagoodb$oy";
var fetchuser=require('../middleware/fetchUser');


//Route1 : Create a User using: POST "/api/auth/". No login required
router.post(
  "/createuser",
  [
    body("email","Enter a valid email").isEmail(),
    body("name","enter a valid name").isLength({ min: 3 }),
    body("password","The length of password must be atleast 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success=false
    //If there are errors, return Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }
    //check whether user with email exists already.
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {  
        return res.status(400).json({success,error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
    //  console.log(authtoken);
      success=true
      res.json({success,authtoken});
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured");
    }
  }
);

//Route2:-Authenticate a User using :POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors,return bad request and the errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false
        return res.status(400).json({success, error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res.status(400).json({ success,error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success,authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);
//Router 3:Get loggedin User Details using : POST "/api/auth/getuser".login required
router.post("/getuser" ,fetchuser, async (req, res) => {
  try {
     let userId= req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

module.exports = router;
