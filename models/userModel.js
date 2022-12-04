/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: This file is the new user model defined.

 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//create new schema
const userSchema = new mongoose.Schema({
  // set properties for attributes
  firstname: {
    type: String,
    required: [true, 'Please tell us your first name!']
  },
  lastname: {
    type: String,
    required: [true, 'Please tell us your last name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  // validate password
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // validate will only work on save or creating the user
    validate:{
        validator: function(pwd){
          return pwd === this.password;
        },
        message: " the password confirmation did not match"
    }
  }
});

// correct password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

// add encrypting the password middleware
userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    return next;
  }
  // if new and modified
  // npm install bcryptjs
  this.password = await bcrypt.hash(this.password, 12); // how intensive the CPU will be
  this.passwordConfirm = undefined; // we dop not want to store in database
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
