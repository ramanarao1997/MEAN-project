const express = require('express');
const bodyParser = require('body-parser');

// for mongoose model
const mongoose = require('mongoose')
const Post = require('./models/post');

const app = express();


mongoose.connect('mongodb+srv://Ramana:QB6ufwNpV7RVOoLv@mean-project-cied5.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to Database');
  })
  .catch( () =>{
    console.log('connection to database failed!');
  });

//to parse the body of request
app.use(bodyParser.json());

// To avoid CORS problem
app.use( (req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains

  // allow domains with only certain headers in their requests besides the default headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With');

  // allow only specific HTML methods
   res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, DELETE, PATCH');

  next();
});

app.post('/api/posts', (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost =>{
    res.status(201).json({
      message : 'post stored succesfully',
      postId: createdPost._id
    });
  }); // to save in database
});

app.get('/api/posts', (req, res, next) => {

  // get posts from database
  Post.find()
    .then(documents => {
      res.status(200).json({
        message:'posts retrieved successfully',
        posts: documents
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {

	//delete from database
    Post.deleteOne( {_id:req.params.id} ) 
      .then(result =>{
        res.status(200).json({message: 'Post deleted!'});
      })
});

module.exports = app;
