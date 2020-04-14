const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Username already taken! Please try another."
          });
        });
    });
}


exports.loginUser = (req, res, next) => {
  let fetchedUser;

  // Find the user
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No such user exists."
        });
      }

      fetchedUser = user;
      // Compare the two hashes
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(comparisonResult => {
      if (!comparisonResult) {
        return res.status(401).json({
          message: "Invalid Password. Please try again."
        });
      }

      // Generate a jsonwebtoken (jwt) for authentication
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        process.env.JWT_PRIVATE_KEY, {
          expiresIn: "1h"
        });

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: "Authentication failed! Please try again."
      });
    });
}
