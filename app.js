var express = require("express"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  cookieParser = require("cookie-parser"),
  session = require("cookie-session"),
  db = require("./models/index"),
  flash = require('connect-flash'),
  app = express();
  var morgan = require('morgan');
  var routeMiddleware = require("./config/routes");
  var https = require('https');

  //this shows up in my script call, so not going to process.env this
  var google_api_key = "AIzaSyCrDCgH3B-u6QkJeLAp54PqruYDNWFAQOs"; 


// Gotta use Google maps now. Either that, or it won't work at all  
// Middleware for ejs, rgabbing HTML and including static files
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}) );

app.use(session( {
  secret: process.env.SECRET_SALT,
  name: 'flightsee',
  // this is in milliseconds
  maxage: 1000*60*60 //1000 milliseconds = 1 sec; 60 sec = 1 minute, times 60 means one hour
  })
);

// function checkAuthentication(req, res, next) {
//   if (!req.user) {
//     res.render('login', {message: req.flash('loginMessage'), username: ""});
//   }
//   else {
//    return next();
//   }
// }

// function preventLoginSignup(req, res, next) {
//   if (req.user) {
//     res.redirect('/home');
//   }
//   else {
//    return next();
//   }
// }

// get passport started
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// prepare our serialize functions
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.User.find({
      where: {
        id: id
      }
    })
    .done(function(error,user){
      done(error, user);
    });
});

app.get('/', function(req,res){
  res.render('index', {user: req.user});  
});

app.get('/index', function(req,res){
  res.render('index', {user: req.user});  
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('signup', { username: ""});
});

app.get('/login', routeMiddleware.preventLoginSignup, function(req,res){
    res.render('login', {message: req.flash('loginMessage'), username: ""});
});

// app.get('/home', routeMiddleware.checkAuthentication, function(req,res){
//   res.render("home", {user: req.user});
// });

// on submit, create a new users using form values
app.post('/signup', function(req,res){

  db.User.createNewUser(req.body.email, req.body.password,
  function(err){
    res.render("signup", {message: err.message, username: req.body.email});
  },
  function(success){
    res.render("index", {message: success.message});
  });
});

// authenticate users when logging in - no need for req,res passport does this for us
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/logout', function(req,res){
  //req.logout added by passport - delete the user id/session
  req.logout();
  res.redirect('/');
});

// catch-all for 404 errors
app.get('*', function(req,res){
  res.status(404);
  res.render('404');
});


app.listen(process.env.PORT || 3000, function(){
  console.log("get this party started on port 3000");
});

