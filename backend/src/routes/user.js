const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    HttpStatusCodes = require("http-status-codes");

const validateRegisterInput = require("../validation/register"),
    validateLoginInput = require("../validation/login");

const User = require("../models/user"),
    Product = require("../models/product");

const secrets = require("../config/secrets");

/*
 * @route POST user/register
 * @desc Manage user registration and add to db
 * @access Public
 */
router.post("/register", (req, res) => {
    console.log("---\n/user/register\n", req.body, "\n---");
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
    }

    const { username, email, password, isVendor } = req.body;

    User.findOne({ email: email }).then(user => {
        if (user) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ email: "Email already exists" });
        }

        const newUser = new User({
            isVendor: isVendor,
            username: username,
            email: email,
            password: password,
        });

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
 * @route POST user/login
 * @desc Manage login for users and return JWT token
 * @access Public
 */
router.post("/login", (req, res) => {
    console.log("---\n/user/login\n", req.body, "\n---");
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
    }

    const { email, password } = req.body;

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
                    password: "The password you provided seems to be incorrect",
                });
            }
        });
    });
});

router.post("/profile", (req, res) => {
    const { id } = req.body;

    Product.find({ vendorId: id })
        .populate({ path: "reviews", model: "Review" })
        .exec((err, product) => {
            if (err) {
                console.log(err);
                return res
                    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            console.log(product);
            res.json(product);
        });
});

module.exports = router;
