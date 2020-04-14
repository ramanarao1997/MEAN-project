const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    userId: req.userData.userId // userData field will be added to the request by the checkAuth middleware
  });


  post.save().then(createdPost => {
      res.status(201).json({
        message: 'post stored succesfully',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Could not create post. Please try again!"
      });
    });
}


exports.getPosts = (req, res, next) => {

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
    }).catch(error => {
      res.status(500).json({
        message: "Could not load posts properly!"
      });
    });
}


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not load post properly!"
    });
  });
}


exports.editPost = (req, res, next) => {

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
      if (result.nModified >= 0) {
        res.status(200).json({
          message: "Updated post successfully!"
        });
      } else {
        res.status(401).json({
          message: "You are not authorized to edit this post!"
        });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Failed to edit the post! Please try again."
      });
    })
}


exports.deletePost = (req, res, next) => {
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
          message: "You are not authorized to delete this post!"
        });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Failed to delete the post! Please try again."
      });
    })
}
