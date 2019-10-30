const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
/* GET users listing. */
router.get('/add', function(req, res, next) {
  res.render('adduser',{title:'Add user'});
});
/* GET users listing. */
router.get('/dashboard',ensureAuthenticated, function(req, res, next) {
  res.render('dashboard',{title:'Dashboard'});
});
router.get('/login', function(req, res, next) {
  // console.log(req.session.id)
  res.render('login',{title:'Login'});
});

router.post('/add', function(req, res, next) {
   const {name , email , password , password2} = req.body;
   const error = [];
   if(!name || !email || !password || !password2){
    error.push({msg:'all fields are required'})
   }
   if(password !== password2){
    error.push({msg:'password is not equal'})
   }
   User.findOne({email:email})
   .then((user)=>{
     if(user){
      error.push({msg:'email already exist'})
      res.render('adduser',{title:'Add user',error:error,name,email,password,password2});
     }
     else{
      const user = new User({name , email , password , password2})
      bcryptjs.genSalt(10, function(err, salt) {
        bcryptjs.hash(password, salt, function(err, hash) {
            user.password = hash;
            user.save((err)=>{
              if(err){console.log(err);}
              req.flash(
                'success_msg',
                'You are now registered and can log in'
              );
              res.redirect('/users/alluser');
            })
        });
       });    

     }
   })
   .catch(err=>console.log(err))

});
router.get('/alluser', function(req, res, next) {
  User.find({})
    .then((alluser)=>{
      if(!alluser){
        res.render('alluser',{title:'All User',msg:'No user Found'})
      }
      else{
        res.render('alluser',{title:'All User',alluser:alluser})
      }
    })
    .catch(err=>console.log(err))
});
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
module.exports = router;
