const router = require("express").Router();
const auth = require("../config/auth")
const Post = require("../models/postModel");

//create post
router.post("/", auth, async (req, res) => {
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    } catch(err) {
        res.status(500).json(err)
    }
})

//update post
router.put("/:id", auth, async(req, res) =>{
    const post = await Post.findById(req.params.id);
    try {
        if(post.userId === req.body.userId){
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post successfully updated")
        }else{
            res.status(403).json("You can only update your posts")
        }
    }catch(err) {
        res.status(500).json(err)
    }
})

//delete post
router.delete("/:id", auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post successfully deleted")
        } else {
            res.status(403).json("You can only delete your posts")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//like/dislike post
router.put("/:id/like", async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: {likes:req.body.userId} })
            res.status(200).json("You have liked this post")
        } else {
            await post.updateOne({ $pull: {likes: req.body.userId} }) 
            res.status(200).json("You have disliked this post")
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

//get post
router.get("/:id", async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    }catch(err) {
        res.status(500).json(err)
    }
})

//get timeline 
router.get("/timeline", auth, async (req, res) =>{
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        try {
            const currentUser = await User.findById(req.body.userId);
            const userPosts = await Post.find({ userId: currentUser._id});
            const followingPosts = await Promise.all(
                currentUser.following.map(followingId=>{
                    Post.find({userId: followingId})
                })
            );
            res.json(userPosts.concat(...followingPosts))
        } catch(err){
            res.status(500).json(err)
        }
    }
})

module.exports = router