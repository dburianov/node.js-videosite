// server.js
// load the things we need
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var config = require('./config');
//var expressWinston = require('express-winston');
//var winston = require('winston'); // for transports.Console

//var mongoose = require('mongoose');
//var passport = require('passport');
//var flash    = require('connect-flash');

//var morgan       = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser   = require('body-parser');
//var session      = require('express-session');

// set up our express application
//app.use(morgan('dev')); // log every request to the console
//app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

// set the view engine to ejs
app.engine('ejs', require('ejs-locals')); // layout partial block
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

//app.use(express.favicon()); // /favicon.ico

var redis = require("redis").createClient();
    redis.select(2);
//var RedisStore = require("connect-redis")(express);

    redis.on("error", function (err) {
        console.log("Error " + err);
    });

//mysql
var mysql      = require('mysql');
var mysqlconnection = mysql.createConnection({
  host     : config.get('mysql:host'),
  user     : config.get('mysql:user'),
  password : config.get('mysql:password'),
  database : config.get('mysql:database')
});
//console.log("E: " + config.get('mysql:database'));
mysqlconnection.connect(function(err){
if(!err) {
    console.log("Database is connected ... ");  
} else {
    console.log("Error connecting database ... \n\n");  
}
});

// required for passport
//app.use(session({ secret: config.get('session:secret') })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



// index page 
app.get('/', function(req, res) {

//    res.render('pages/index');
    res.render('index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// streaming page 
app.get('/streaming', function(req, res) {
    var key = 'YTBiYmU0NGRlMWU1NjUxNGI5MzllMWZiYTUyYTY5ODIgIHJlcS5sdWEK';
    var rnd = Math.round(Math.random()*2147483647);
    var crypto = require('crypto');
    function checksum (str, algorithm, encoding) {
        return crypto
            .createHash(algorithm || 'md5')
            .update(str, 'utf8')
            .digest(encoding || 'hex')
    }
    console.log(checksum( key + rnd ) + ' ' + rnd);
//    res.render(checksum( key + rnd ) + ' ' + rnd);

    redis.setex( rnd, 100, checksum( key + rnd ));

    var drinks = [
	{ name: checksum( key + rnd), drunkness: rnd, server: 'rtmp://nginx-rtmp.cloudapp.net', strapp: 'hls' }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('streaming', {
        drinks: drinks,
        tagline: tagline
    });
});

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(config.get('port'), function(){
//  log.info('Express server listening on port ' + config.get('port'));
console.log('Express server listening on port ' + config.get('port'));
});

