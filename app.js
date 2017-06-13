var http = require('http');
var express = require('express');

var mongoose = require('mongoose');
var passport = require('passport');

var port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);

app.use(express.static(__dirname + "/client"));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

server.listen(port);

console.log("start test Mongo");

//==============================================================================
var configDB = require('./config/database.js');

mongoose.Promise = global.Promise;

mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  //require('./app/routes')(app, database);
});

mongoose.connection.on('error',(err)=>{
    console.error("Database Connection Error: " + err);
});

mongoose.connection.on('connected',()=>{
    console.info("Succesfully connected to MongoDB Database");
});
//==============================================================================
//                        FACEBOOK
//==============================================================================
function getClientIdProfile(vId){
  console.log('id',vId);
}

app.get('/auth/facebook',
    passport.authenticate('facebook',{ scope : 'email' }));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    getClientIdProfile(req.user._id);
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
