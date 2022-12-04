/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: Define routes for the users.
 */
const express = require('express');
const viewsController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
.get('/',viewsController.getHomePage); //get landing page

router
.get('/login',viewsController.getLoginForm) //get login form
.post('/login',authController.login);//post login form 

router
.get('/signUp',viewsController.getSignInForm)//get signup form
.post('/signUp',authController.signup);//post signup form


router
.get('/users', viewsController.getusers)//get all users
module.exports = router;
