const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(session({ secret: 'coe', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/faculty', facultyRouter);
app.use('/api', apiRouter);

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

const port = process.env.PORT || 1004;
app.listen(port, function () {
  console.log('Server started at port ' + port);
});

module.exports = app;
