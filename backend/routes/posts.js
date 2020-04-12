const express = require('express');
const multer = require("multer");
const router = express.Router();

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) {
      error = null;
    }

    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];

    callback(null, name + '-' + Date.now() + "." + ext);
  }
})


// add checkAuth middleware to protect the route
router.post("", checkAuth, multer({
  storage: storage
}).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    userId: req.userData.userId // userData field will be added to the request by the checkAuth middleware
  });

  // use post.save() on the newly created Post object
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post stored succesfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
}); // To save a new post in database


router.get("", (req, res, next) => {
  // pagesize and page must be used with the same names in posts service while sending a get request
  // as they are query parameters
  const pageSize = +req.query.pagesize; // + to convert string to integer
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'posts retrieved successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
}); // Get posts from database


router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  })
}); // Get single post (to edit)


// add checkAuth middleware to protect the route
router.put("/:id", checkAuth, multer({
  storage: storage
}).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    userId: req.userData.userId
  });

  Post.updateOne({
      _id: req.params.id,
      userId: req.userData.userId
    }, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Updated post successfully!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized to edit this post!"
        });
      }
    });
}); // Update a post


// add checkAuth middleware to protect the route
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id,
      userId: req.userData.userId
    })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Deleted post successfully!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized to delete this post!"
        });
      }
    })
}); //Delete a post from database

module.exports = router;
