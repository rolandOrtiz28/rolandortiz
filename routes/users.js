const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const { route } = require('./campgroundsRoute');
const passport = require('passport');
const users = require('../controllers/users')


// registration section

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.createAnewUser))


// Login section

router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.logInUser)


// LogOut section
router.get('/logout', users.logOut);



// export section
module.exports = router;





