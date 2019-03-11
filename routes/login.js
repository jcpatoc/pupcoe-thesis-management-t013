var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    if (req.user.is_admin) {
      res.redirect('/admin');
    } else if (req.user.user_type == 'faculty') {
      res.redirect('/faculty');
    } else if (req.user.user_type == 'student') {
      res.redirect('/student');
    } else {
      res.redirect('/');
    }
  });

module.exports = router;
