// server.js
// load the things we need
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var config = require('./config');
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console

// set the view engine to ejs
app.engine('ejs', require('ejs-locals')); // layout partial block
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

//app.use(express.favicon()); // /favicon.ico

// express-winston logger makes sense BEFORE the router.
//    app.use(expressWinston.logger({
//      transports: [
//        new winston.transports.Console({
//          json: true,
//          colorize: true
//        })
//      ]
//    }));


//app.use(express.bodyParser());  // req.body....

app.use(require('./middleware/sendHttpError'));

var redis = require("redis").createClient();
    redis.select(2);
//var RedisStore = require("connect-redis")(express);

    redis.on("error", function (err) {
        console.log("Error " + err);
    });

//app.use(express.cookieParser()); // req.cookies
// app.use(express.session({
//  secret: config.get('session:secret'),
//  key: config.get('session:key'),
//  cookie: config.get('session:cookie'),
//  store: new (require('express-sessions'))({
//    db:config.get('redis:db'),
//    storage: 'redis',
//    collection: 'sessions'
//    })
//})); 

// use res.render to load up an ejs view file

// index page 
//app.get('/', function(req, res) {
//    res.render('pages/index');
//});

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
});

