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
        console.log(checksum( key + rnd ) + ' ' + rnd);
	// res.render(checksum( key + rnd ) + ' ' + rnd);

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
        req.logout();
        res.redirect('/');
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

