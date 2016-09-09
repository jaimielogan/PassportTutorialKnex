var express = require('express');
var router = express.Router();
var passport = require('../passport');
var users = require('../users.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.redirect('/dashboard');
    return;
  }
  res.render('index', { title: 'My Dashboard App' });
});

router.post('/register', function(req,res,next){
  users.add(req.body.usernameReg, req.body.passwordReg)
  .then(function(){
    res.redirect('/');
  })
  .catch(function(err){
    return next(err);
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
})
);

router.get('/dashboard', function(req,res,next){
  if(!req.isAuthenticated()){
    res.redirect('/');
    return;
  }
  console.log('/dashbaord .get for req.user:',req.user);
  res.render('dashboard', {user: req.user});
});

router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
