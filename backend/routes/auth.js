const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "weusejsonwebtoken";
var fetchuser = require('../middleware/fetchuser');

// Route 1: create a user using POST '/api/auth/createuser' no login require
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password atleast 5 character').isLength({min: 5})
], async (req, res)=> {
    let success = false;
    // tf there are errors return badrequest and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()});
    }
    // check whether user with the email exists already
    try {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        return res.status(400).json({success, error: "sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    // create a new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    })
    // secuirity reason
    const data = {
        user:{
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    // res.json(user)
    success = true;
    res.json({success, authToken})
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Interna server error")
    }
})

// Route 2: Auhtenticate a user using POST '/api/auth/login' no login require
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res)=> {
    let success = false;
    // tf there are errors return badrequest and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authToken})
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Interna server error")
    }
})

// Route 3: get loggedin user details using POST '/api/auth/getuser' login require
router.post('/getuser',fetchuser, async (req, res)=> {

try{
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
} catch (error){
    console.log(error.message);
    res.status(500).send("Interna server error")
}

})


module.exports = router