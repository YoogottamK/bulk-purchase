const jwt = require("jsonwebtoken"),
    HttpStatusCodes = require("http-status-codes");

const secrets = require("../config/secrets");

const tokenValidatorMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    jwt.verify(token, secrets.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                token: "Invalid token",
            });
        } else {
            req.body.userDetails = decoded;
            next();
        }
    });
};

module.exports = tokenValidatorMiddleware;
