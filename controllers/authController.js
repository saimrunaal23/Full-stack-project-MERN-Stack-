/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: This file is the main controller file for authentication. It includes retrieving token id, signup user
            and send token, login user and send token, protect from unauthorized access.

 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError= require('./../utils/appError');
const {promisify} = require('util');

const signToken = id => { //sign the jwt token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => { // creates new send token
  const token = signToken(user._id); //token
  const cookieOptions = {//cookie options
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions); // sends the token into authorization headers

  // Remove password from output
  user.password = undefined;
  // res.status(statusCode).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user
  //   }
  // });

};


exports.signup = async (req, res, next) => { //creates new user and sends token
  const newUser = await User.create({ // create a new user against user schema
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  
  createSendToken(newUser, 201, res); //sends token
  res.render('landingPage',{//render landing page
    user: newUser
  });
};

exports.login = async (req, res, next) => { //checks for username and password in the database
  const { email, password } = req.body;//gets email and password form the body

  if (!email || !password) { //checks for empty fields
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password'); //finds user and password in databse
  if(!user || !(await user.correctPassword(password, user.password))){//checks the password
    return next(new AppError('Incorrect email or password', 401))
}
  createSendToken(user, 200, res);//sends token
  res.render('landingPage',{//render landing page
    user
  });

};


exports.protect = async (req, res, next) => { //protects the url from unauthorized access
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization && //checks for tokens
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) { // if no token is found
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


