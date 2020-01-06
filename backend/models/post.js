const mongoose = require('mongoose');

// schema
const postSchema = mongoose.Schema({
  title: {type: String, require: true},
  content: {type: String, require: true}
});


// schema to model
module.exports = mongoose.model('Post',postSchema);
