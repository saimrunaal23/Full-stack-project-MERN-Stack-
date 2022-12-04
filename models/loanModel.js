/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: This file is the new loan schema defined.

 */
const mongoose = require('mongoose');
var user = require('./userModel')

//create new schema
const loansSchema = new mongoose.Schema(
  {
    //set properties for attributes
    customerName: {
        type: String,
        required: [true, 'A customer must have a name'],
        trim: true,
        maxlength: [40, 'Name can be maximum 40 characters']
    },
    phoneNumber:{
        type: Number,
        required: [true, 'Please enter a phoneNumber'],
        maxlength: [10, 'PhoneNumber can be maximum 10 digits']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true
    },
    address:{
        type: String,
        required: [true, 'Please enter address']
    },
    loanAmount:{
        type: Number,
        required: [true, 'Please enter loanAmount']
    },
    interest:{
        type: Number,
        required: [true, 'Please enter interest']
    },
    loanTermYears:{
        type: Number,
        required: [true, 'Please enter loanTermYears']
    },
    loanType:{
        type: String,
        required: [true, 'Please enter loantype']
    },
    description:{
        type: String,
        required: [true, 'Please enter description'],
        trim: true,
        maxlength: [100, 'Description can have maximum 100 characters'],
        minlength: [10, 'Description  must have more or equal then 10 characters']
    }   
});
const Loans = mongoose.model('Loans', loansSchema);

module.exports = Loans;
//** code  END