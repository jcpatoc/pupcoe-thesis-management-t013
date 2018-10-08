const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg'); 
// const nodemailer = require('nodemailer');   
const exphbs = require('express-handlebars');
var user;
var pass;

const app = express();
// instantiate client using your DB configurations
const client = new Client({
  database: 'dvfdfp4vj3j1i',
  user: 'jrhzycwpswvxsu',
  password: '6167b01eac3aa94488ee654110440224ab95d442a93db8fb7fe83a5d107dc93c',
  host: 'ec2-23-21-171-249.compute-1.amazonaws.com',
  port: 5432,
  ssl: true 
}); 
app.set('port', (process.env.PORT || 4000));


// connect to database
client.connect()
  .then(function() {
    console.log('connected to database!')
  })
  .catch(function(err) {
    console.log('cannot connect to database!')
  });

// tell express which folder is a static/public folder
app.use(express.static(path.join(__dirname, 'views')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 

app.get('/', function(req, res) {
  res.render('signin');
});


app.listen(app.get('port'), function(){
  console.log('Server started on port' +app.get('port'))
});
