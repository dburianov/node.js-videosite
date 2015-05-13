// app/routes.js

var redis = require("redis").createClient();
    redis.select(2);
    redis.on("error", function (err) {
        console.log("Error " + err);
    });



module.exports = function(app, passport) {


    // index page
    app.get('/', function(req, res) {


        // res.render('pages/index');
	if (req.param("videoId")) { global.videoid_internal=req.param("videoId"); } else { global.videoid_internal = 'sample.mp4'; }
//	console.log("param: " + req.param("videoId") + " variable set: " + global.videoid_internal );
//	res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
	res.cookie('foo', +new Date(), { maxAge: 3600000, path: '/' });
//	console.log("coocies on client: " + req.cookies.foo);
	res.locals.videoid_s = global.videoid_internal;
//        res.render('index', {ids: '1', videoid_int: global.videoid_internal, ss: JSON.stringify(s) } );
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
	};
	var streaming_key_rend = checksum( key + rnd );
	var streaming_key = streaming_key_rend.substring(0,5);
//        console.log(checksum( key + rnd ) + ' ' + rnd);
        console.log(streaming_key + ' ' + rnd);
	// res.render(checksum( key + rnd ) + ' ' + rnd);

//        redis.setex( rnd, 1000, checksum( key + rnd ));
        redis.setex( rnd, 1000, streaming_key);

//        var drinks = [
//            { name: checksum( key + rnd), drunkness: rnd, server: 'rtmp://nginx-rtmp.cloudapp.net', strapp: 'hls' }
//        ];
        var drinks = [
            { name: streaming_key, drunkness: rnd, server: 'rtmp://nginx-rtmp.cloudapp.net', strapp: 'instream' }
        ];
        var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

        res.render('streaming', {
            drinks: drinks,
            tagline: tagline
        });
    });
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
	res.clearCookie('foo');
        req.logout();
//        res.redirect('/');
        res.redirect('/streaming');
    });
//    app.use(express.static(path.join(__dirname, 'public')));
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

