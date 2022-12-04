/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: This file is the main controller file for Users. It includes displaying landing page, displaying user signup form,
              displaying user login form, get all users stored in the database.

 */
const User = require('./../models/userModel');
const APIFeatures = require('../databaseManager/loanDbContext.JS');


exports.getHomePage = async (req, res) => { //display landing page
  res.status(200).render('home', {title: `Home page`});
};

exports.getSignInForm = (req, res) => {//display signup form
  res.status(200).render('SignUpForm', {
    title: `Create New User`
  });
};

exports.getLoginForm = (req, res) => {//display login form
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};


exports.getusers =   async (req, res) => { // get all users stored in the database
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query; // store features into users 

    // SEND RESPONSE
    res.status(200).json({ // display 200OK if everything works
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(404).json({ // throw error 
      status: 'fail',
      message: err
    });
  }
};