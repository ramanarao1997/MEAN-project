const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

// for mongoose model
const mongoose = require('mongoose')

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb+srv://Ramana:QB6ufwNpV7RVOoLv@mean-project-cied5.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to Database');
  })
  .catch( () =>{
    console.log('connection to database failed!');
  });

// To parse the body of request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// To allow access to images folder
app.use("/images", express.static(path.join("backend/images")));

// To avoid CORS problem
app.use( (req, res, next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains

  // allow domains with only certain headers in their requests besides the default headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With');

  // allow only specific HTTP methods
   res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, DELETE, PATCH, PUT');

  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
