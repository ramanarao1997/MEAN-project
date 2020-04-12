const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  // unique is only for mongoose to do internal optimizations
  // does not act as a validator to give error when same email is used twice
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

// adding plugins to schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
