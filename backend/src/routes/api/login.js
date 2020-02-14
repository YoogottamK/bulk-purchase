const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    HttpStatusCodes = require("http-status-codes");

// validators
const validateRegisterInput = require("../../validation/register"),
    validateLoginInput = require("../../validation/login");

// models
const User = require("../../models/user");

// secrets
const secrets = require("../../config/secrets");

/*
 * @route POST api/user/register
 * @desc Manage user registration and add to db
 * @access Public
 */
router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ email: "Email already exists" });
        }

        const newUser = new User(req.body);

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            });
        });
    });
});

/*
 * @route POST api/user/login
 * @desc Manage login for users and return JWT token
 * @access Public
 */
router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json(errors);
    }

    const email = req.body.email,
        password = req.body.password;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(HttpStatusCodes.NOT_FOUND).json({
                accountNotFound:
                    "The account with which you are trying to log in doesn't exist yet.",
            });
        }

        bcrypt.compare(password, user.password).then(isEqual => {
            if (isEqual) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    isVendor: user.isVendor,
                };

                jwt.sign(
                    payload,
                    secrets.secretOrKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token,
                        });
                    }
                );
            } else {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    passwordIncorrect:
                        "The password you provided seems to be incorrect",
                });
            }
        });
    });
});

module.exports = router;
