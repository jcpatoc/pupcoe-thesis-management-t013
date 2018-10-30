var express = require('express');
var router = express.Router();
const Class = require('./../models/class');

/* GET home page. */
router.post('/class/:classId/student', function(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('param', req.params.classId, req.body);
    var data = JSON.parse(req.body.data);
    console.log('data', data);
    Class.addStudents(req.params.classId, data.student_ids).then(function(students) {
      console.log('api students', students);
      res.json({
        studenst: students
      });
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login')
});
module.exports = router;