var express = require('express');
var router = express.Router();
const User = require('./../models/user');
const Class = require('./../models/class');
const Group = require('./../models/group');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.is_admin) {
      res.render('admin/home', { layout: 'admin' });
    } else if (req.user.user_type == 'faculty') {
      res.render('faculty/home', { layout: 'faculty' });
    } else {
      Class.getByStudentId(req.user.id).then(function(data) {
        console.log('data student', data);
        res.render('student/home', { layout: 'student', user: data });
      });
    }
  } else {
    res.redirect('/login')
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login')
});
module.exports = router;
