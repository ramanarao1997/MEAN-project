const express = require('express');
const multer = require("multer");
const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpg':'jpg',
  'image/jpeg':'jpg'
};

const storage = multer.diskStorage({
  destination:(req, file,callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid){
      error = null;
    }
    callback(error,"backend/images");
  },
  filename: (req,file,callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + "." + ext);
  }
})

router.post("", multer({storage: storage}).single("image"), (req,res,next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message : 'post stored succesfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
}); // To save a new post in database

router.put("/:id",  multer({storage: storage}).single("image"), (req,res,next) =>{

  let imagePath = req.body.imagePath;

  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json({message:"update successful"});
    });
}); // Update a post

router.get("", (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message:'posts retrieved successfully',
        posts: documents
      });
    });
});// Get posts from database


router.get("/:id", (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: 'Post not found!'});
    }
  })
}); // get single post (to edit)

router.delete("/:id", (req, res, next) => {
    Post.deleteOne( {_id:req.params.id} )
      .then(result =>{
        res.status(200).json({message: 'Post deleted!'});
      })
}); //Delete a post from database

module.exports = router;
