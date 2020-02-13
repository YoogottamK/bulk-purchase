/*
 * This file contains functions which initialize stuff
 */

const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

function initExpress() {
    /*
     * initializes express
     */

    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    return app;
}

function initMongoose() {
    /*
     * initializes mongoose
     */

    mongoose
        .connect("mongodb://127.0.0.1:27017/users", { useNewUrlParser: true })
        .then(() => console.log("MongoDB succesfully connected"))
        .catch(err => console.log(err));
}

module.exports = {
    initMongoose,
    initExpress,
};
