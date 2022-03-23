require("dotenv").config();

const User = require("../models/userModel")
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const contact = require("./contactRoute");

//get all
router.get("/", async (req, res) =>{
    try {
        const users = await User.find();
    res.status(200).json({
        message: "Success",
        results: users
    })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})


//get single
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch(err) {
        res.status(500).json(err)
    }
})

//REGISTER A USER   
router.post("/register", async(req, res) => {
    try{
        //generate bcrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //save user and respond
        const user = await newUser.save()
        res.status(200).json(user)
    }catch (err){
        console.log(err)
    }
})

//USER LOGIN
router.post("/login", async(req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) res.status(404).json({message: "Could not find user"});
    if (await bcrypt.compare(password, user.password)) {
        try {
            const access_token = jwt.sign(
                JSON.stringify(user),
                process.env.ACCESS_TOKEN_SECRET
            );
            res.status(201).json({
                jwt: access_token
            });
        }catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    } else {
        res.status(400).json({ message: "Recheck login details. Email and password do not match"});
    }
});

//update user
 router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        if (req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body,password = await bcrypt.hash(req.body.password, salt)
            } catch(err){
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("Account successfully updated")
        } catch(err) {
            return res.status(500).json(err)
        }
    } else{
        return res.status(403).json("You don't have permission to update this account")
    }
    
 })
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin){
        try {
            const user = await User.findByIdAndDelete({_id: req.params.id});
            res.status(200).json("Account successfully deleted")
        } catch(err) {
            return res.status(500).json(err)
        }
    } else{
        return res.status(403).json("You don't have permission to delete this account")
    }
    
 })

//follow
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentuser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User followed")
            } else{
                res.status(403).json("You already follow this account")
            }
        } catch(err){
            res.status(500).json(err)
        }
    }else{  
        res.status(403).json("You can't follow yourself")
    }
})


//unfollow 
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentuser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User unfollowed")
            } else{
                res.status(403).json("You don't follow this account")
            }
        } catch(err){
            res.status(500).json(err)
        }
    }else{  
        res.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router