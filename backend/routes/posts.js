const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const storeFile = require('../middleware/file-storage');

const postsController = require('../controllers/posts');


router.post("", checkAuth, storeFile, postsController.createPost);

router.get("", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.put("/:id", checkAuth, storeFile, postsController.editPost);

router.delete("/:id", checkAuth, postsController.deletePost);


module.exports = router;
