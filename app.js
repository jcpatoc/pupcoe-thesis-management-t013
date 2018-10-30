const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var path = require('path'); var { Client } = require('pg');
const exphbs = require('express-handlebars');


// models
const User = require('./models/user');


// required for passport
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');
const facultyRouter = require('./routes/faculty');
const loginRouter = require('./routes/login');
const apiRouter = require('./routes/api');

const client = new Client({
  database: 'dvfdfp4vj3j1i',
  user: 'jrhzycwpswvxsu',
  password: '6167b01eac3aa94488ee654110440224ab95d442a93db8fb7fe83a5d107dc93c',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
  port: 5432,
  ssl: true 
}); 


client.connect()
  .then(function () {
    console.log('connected to database');
  })
  .catch(function (err) {
    console.log('cannot connect to database!', err);
  });

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, cb) {
    User.getByEmail(email, function(user) {
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  console.log('serializeUser', user)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.getById(id, function (user) {
    console.log('deserializeUser', user)
    cb(null, user);
  });
});


// instantiate app
const app = express();

// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(session({ secret: 'kahitAnoIto', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/faculty', facultyRouter);
app.use('/api', apiRouter);


app.get('/signup', function (req, res){
  res.render('signup', {
  })
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/*********************Admin***************************/


app.get('/admin', function (req, res){
  res.render('admin/dashboard', {
    layout: 'admin'
  })
})


//FACULTIES-----------------------------------------------

app.get('/admin/faculty', function (req, res){
  client.query("SELECT employee_id AS employee_id, fname AS fname, lname AS lname, email AS femail, phone AS fphone, is_admin AS is_admin FROM users WHERE user_type = 'faculty';")
  .then((faculties)=>{
    res.render('admin/faculty', {
      layout: 'admin',
      faculties: faculties.rows
    })
  })
})

app.get('/admin/student/:id', function (req, res){
  client.query("SELECT id AS user_id, employee_id AS femployee, fname AS fname, lname AS lname, email AS femail, phone AS fphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
  .then((faculty_details)=>{
    res.render('admin/faculty_details', {
      layout: 'admin',
      number: student_details.rows[0].femployee,
      fname: student_details.rows[0].fname,
      lname: student_details.rows[0].lname,
      email: student_details.rows[0].femail,
      phone: student_details.rows[0].fphone,
      user_type: student_details.rows[0].user_type,
      id: student_details.rows[0].user_id
    })
  })
})


app.get('/admin/add_faculty', function (req, res){
  res.render('admin/add_faculty', {
    layout: 'admin'
  })
})

app.post('/add_faculty', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number, employee_id, is_admin) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "','" + req.body.employee_id + "', '" + req.body.is_admin +"');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/faculty');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//STUDENTS-----------------------------------------------

app.get('/admin/student', function (req, res){
  client.query("SELECT student_number AS snumber, fname AS fname, lname AS lname, email AS semail, phone AS sphone FROM users WHERE user_type = 'student';")
  .then((students)=>{
    res.render('admin/student', {
      layout: 'admin',
      students: students.rows,
    })
  })
})


app.get('/admin/student/:id', function (req, res){
  client.query("SELECT id AS user_id, student_number AS snumber, fname AS fname, lname AS lname, email AS semail, phone AS sphone, user_type AS user_type FROM users WHERE users.id =" + req.params.id + ";")
  .then((student_details)=>{
    res.render('admin/student_details', {
      layout: 'admin',
      number: student_details.rows[0].snumber,
      fname: student_details.rows[0].fname,
      lname: student_details.rows[0].lname,
      email: student_details.rows[0].semail,
      phone: student_details.rows[0].sphone,
      user_type: student_details.rows[0].user_type,
      id: student_details.rows[0].user_id
    })
  })
})

app.get('/admin/add_student', function (req, res){
  res.render('admin/add_student', {
    layout: 'admin'
  })
})

app.post('/add_student', function (req, res){
  client.query("INSERT INTO users (fname, lname, email, password, user_type, phone, student_number) VALUES ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.user_type + "', '" + req.body.phone + "', '" + req.body.student_number + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/student');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


//CLASSES-----------------------------------------------

app.get('/admin/classes', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches AS batches,
      sections AS sections,
      year_levels AS year_levels,
      fname AS fname,
      lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id;
    `)
    .then((classes)=>{
    res.render('admin/classes', {
      layout: 'admin',
      classes: classes.rows
    })
  })
})

app.get('/admin/classes/:id', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches.batches AS batch,
      sections.sections AS section,
      users.id AS adviser_id,
      users.fname AS fname,
      users.lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id
    WHERE classes.id =` + req.params.id + `;
    `)
  .then((class_details)=>{
    res.render('admin/class_details', {
      layout: 'admin',
      batch: class_details.rows[0].batch,
      section: class_details.rows[0].section,
      fname: class_details.rows[0].fname,
      lname: class_details.rows[0].lname
    })
  })
})

app.post('/admin/classes/:id', function (req, res){
  client.query(``)
  .then((results)=>{
    console.log('results?', results);
    res.redirect('admin/class_details');
  })
  .catch((err)=>{
    console.log('error',err);
  })
})


app.get('/admin/add_class', function (req, res){
  client.query("SELECT id AS id, batches AS batches FROM batches;")
  .then((batches)=>{
    client.query("SELECT id AS id, year_levels AS year_levels FROM year_levels;")
    .then((year_levels)=>{
      client.query("SELECT id AS id, sections AS sections FROM sections;")
      .then((sections)=>{
        client.query("SELECT id AS id, fname AS fname, lname AS lname FROM users WHERE user_type = 'faculty';")
        .then((faculties)=>{
          res.render('admin/add_class', {
            layout: 'admin',
            faculties: faculties.rows,
            batches:batches.rows,
            year_levels: year_levels.rows,
            sections: sections.rows
          })
        })
      })
    })
  })
})

app.post('/add_class', function (req, res){
  client.query("INSERT INTO classes (batch_id, year_level_id, adviser_id, section_id) VALUES ('" + req.body.batch + "', '" + req.body.year_level + "', '" + req.body.user_id + "', '" + req.body.section + "');")
  .then((results)=>{
    console.log('results?', results);
    res.redirect('/admin/classes');
  })
  .catch((err)=>{
    console.log('error', err);
  })
})


/*********************Faculty***************************/

app.get('/faculty/dashboard', function (req, res){
  res.render('faculty/dashboard', {
    layout: 'faculty'
  })
})

app.get('/faculty/classes', function (req, res){
  res.render('faculty/classes', {
    layout: 'faculty'
  })
})

app.get('/faculty/classes/:id', function (req, res){
  client.query(`
    SELECT classes.id AS class_id,
      batches.batches AS batch,
      sections.sections AS section,
      users.id AS adviser_id,
      users.fname AS fname,
      users.lname AS lname
    FROM classes
    INNER JOIN year_levels ON year_levels.id = year_level_id
    INNER JOIN batches ON batches.id = batch_id
    INNER JOIN sections ON sections.id = section_id
    INNER JOIN users ON users.id = adviser_id
    WHERE classes.id =` + req.params.id + `;
    `)
  .then((class_details)=>{
    res.render('faculty/faculty_details', {
      layout: 'faculty',
      batch: class_details.rows[0].batch,
      section: class_details.rows[0].section,
      fname: class_details.rows[0].fname,
      lname: class_details.rows[0].lname
    })
  })
})


/*********************Student***************************/


app.get('/student/home', function (req, res){
  res.render('student/home', {
    layout: 'student'
  })
})


const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('Server started at port ' + port);
});

module.exports = app;
