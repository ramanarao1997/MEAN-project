const mongoose = require('mongoose');

// schema
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true}
});

// schema to model
module.exports = mongoose.model('Post', postSchema);
