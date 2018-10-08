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
  database: 'db1kuekdp58lc2',
  user: 'lcvrshwimmquro',
  password: '15b7706d9e3dbc96894e66dd1269897bfa8402e2b9c8496e5d1340a9e054cbdc',
  host: 'ec2-54-243-253-24.compute-1.amazonaws.com',
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
