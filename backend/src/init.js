/*
 * This file contains functions which initialize stuff
 */

const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("./models/user"),
    secrets = require("./config/secrets");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secrets.secretOrKey;

function passportSetup(passport) {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
}

function initExpress() {
    /*
     * initializes express
     */

    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(passport.initialize());

    passportSetup(passport);

    return app;
}

function initMongoose() {
    /*
     * initializes mongoose
     */

    mongoose
        .connect("mongodb://127.0.0.1:27017/bulk-purchase", {
            useNewUrlParser: true,
        })
        .then(() => console.log("MongoDB succesfully connected"))
        .catch(err => console.log(err));
}

module.exports = {
    initMongoose,
    initExpress,
};
