const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


module.exports = (app, config) => {

// view engine setup
    app.set('views', path.join(config.rootFolder, '/views'));
    app.set('view engine', 'hbs');

//this sets up the parser for the request data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // We will use cookies
    app.use(cookieParser());


//session is storage for cookies, which will be de/encrypted with this "secretkey"
    app.use(session({secret: 's3cr3t5tr1ng', resave: false, saveUninitialized:false,}))

    //validation module for user validation
    app.use(passport.initialize());
    app.use(passport.session());

    //makes the content visible for both views and controllers
    app.use((req, res, next)=>{
        if(req.user){
            res.locals.user = req.user;
        }
        next();
    });

    app.use(express.static(path.join(config.rootFolder, 'public')));
};



