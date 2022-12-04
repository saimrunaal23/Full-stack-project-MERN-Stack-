/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: Define routes for the loans.
 */
const express = require('express');
const loanController = require('../controllers/loanController');
const authController = require('./../controllers/authController');

const router = express.Router();

//define routes
router
.get('/profile', authController.protect, loanController.getAllloans) ; //get specific loans by user


router
.get('/loan', authController.protect, loanController.getloan) //get new loan page
.post('/loan',authController.protect, loanController.createloan);// post new loans

router
.get('/loans', loanController.getloans)// get all loans

module.exports = router;
