var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated() && req.user.user_type == 'student') {
    Class.getByStudentId(req.user.id).then(function(data) {
      console.log('data student', data);
      res.render('student/home', { layout: 'student', user: data });
    })
  } else {
    res.redirect('/')
  }
});


module.exports = router;