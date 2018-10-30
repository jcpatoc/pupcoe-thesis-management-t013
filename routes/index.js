var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('index', { title: 'Express' });
  } else {
    res.redirect('/login')
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login')
});
module.exports = router;