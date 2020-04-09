const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');


router.post("/signup", (req, res, next) => {
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
            error: err
          });
        });
    });
});


router.post("/login", (req, res, next) => {
  let fetchedUser;

  // Find the user
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed! No such user exists."
        });
      }

      fetchedUser = user;
      // Compare the two hashes
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(comparisonResult => {
      if (!comparisonResult) {
        return res.status(401).json({
          message: "Authentication failed!"
        });
      }

      // const user = new User({
      //   email: req.body.email,
      //   password: req.body.password
      // });

      // Generate a jsonwebtoken (jwt) for authentication
      const token = jwt.sign({
          email: fetchedUser.email,
          userId: fetchedUser._id
        },
        "This_is_my_(secret/private_key)_should_be_longer.", {
          expiresIn: "1h"
        });

      res.status(200).json({
        mesage: "User found!",
        token: token
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: "Authentication failed!"
      });
    });
});

module.exports = router;
