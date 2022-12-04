/*
Name: Sai Mrunaal Chatlapally
Date: 11/30/2022
Description: This file is the main controller file for loans. It includes retrieving user specific loans,
              retrieving all loans,rendering newloan and loan profile pages,posting a new loan.

 */
const Loan = require('./../models/loanModel');
const APIFeatures = require('./../databaseManager/loanDbContext');


exports.getAllloans =   async (req, res) => { // get loans by unique mail id.
    try {
      // EXECUTE QUERY
      const features = new APIFeatures(Loan.find({"email":req.user.email}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const loans = await features.query; // store the features into loans
      console.log(req.user._id);
      // res.status(200).json({
      //   status: 'success',
      //   data: {
      //     loans
      //   }
      // });
      res.render('profile', {loans})// render loan show page
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  exports.getloans =   async (req, res) => { // get all the loans posted to the database
    try {
      // EXECUTE QUERY
      const features = new APIFeatures(Loan.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const loans = await features.query; //stores features into loans
  
      // SEND RESPONSE
      res.status(200).json({ // send status 200OK if everything works.
        status: 'success',
        results: loans.length,
        data: {
          loans
        }
      });
    } catch (err) { // catch error and display it
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };



exports.getloan = (req, res) => { // render new loan page
  res.status(200).render('newloan', {
    title: 'create new loan'
  });
};
exports.createloan = async  (req, res) => { //create new loan
    try {
  
      const newLoan = await Loan.create(req.body); // create a new loan against Loan schema and store in newLoan
      // res.status(200).json({
      //   status: 'success',
      //   data: {
      //     newLoan
      //   }
      // });
      res.render('landingPage',{
        authenticated : true
      });

    } catch (err) {// throw error 
      res.status(400).json({
        status: 'fail',
        message: err
      });
    }
  };
