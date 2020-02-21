const express = require("express"),
    router = express.Router(),
    HttpStatusCodes = require("http-status-codes");

const validateAddOrderInput = require("../validation/addOrder"),
    validateRatingInput = require("../validation/rating"),
    tokenValidatorMiddleware = require("../validation/tokenValidatorMiddleware"),
    userTypeMiddleware = require("../validation/userTypeMiddleware");

const Product = require("../models/product"),
    Order = require("../models/order"),
    User = require("../models/user");

const constants = require("../config/constants");

router.use(tokenValidatorMiddleware);
router.use(userTypeMiddleware.customer);

/*
 * @route GET /order
 * @desc Get all available orders
 * @access Restricted
 */
router.get("/", (req, res) => {
    console.log("---\n/order\n", req.body, "\n---");

    Product.find({
        quantity: { $gt: 0 },
        state: { $ne: constants.PRODUCT_STATE.CANCELLED },
    })
        .populate("vendorId")
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            res.json(docs);
        });
});

/*
 * @route GET /order/my
 * @desc Gets all orders placed by the client
 * @access Restricted
 */
router.get("/my", (req, res) => {
    console.log("---\n/order/my\n", req.body, "\n---");

    Order.find({ customerId: req.body.userDetails.id })
        .populate("productId")
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            res.json(docs);
        });
});

/*
 * @route POST /order/new
 * @desc Place new order
 * @access Restricted
 */
router.post("/new", (req, res) => {
    console.log("---\n/order/new\n", req.body, "\n---");
    const { errors, isValid } = validateAddOrderInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
    }

    let { productId, quantity, userDetails } = req.body;

    Product.findById(productId, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err);
        }

        const remaining = data.quantity - quantity;

        if (remaining < 0) {
            return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
                quantity: "You cant order more than available",
            });
        }

        const newOrder = new Order({
            productId: productId,
            customerId: userDetails.id,
            quantity: quantity,
        });

        const productUpdates = {
            quantity: remaining,
            state:
                remaining == 0
                    ? constants.PRODUCT_STATE.PLACED
                    : constants.PRODUCT_STATE.WAITING,
        };

        newOrder
            .save()
            .then(order => {
                Product.findOneAndUpdate(
                    { _id: productId },
                    productUpdates,
                    err => {
                        if (err) {
                            return res
                                .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                                .json(err);
                        }

                        res.json(order);
                    }
                );
            })
            .catch(err => {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            });
    });
});

/*
 * @route POST /order/update
 * @desc Update the order placed by client
 * @access Restricted
 */
router.post("/update", (req, res) => {
    console.log("---\n/order/update\n", req.body, "\n---");

    const { errors, isValid } = validateAddOrderInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
    }

    let { orderId, quantity, userDetails } = req.body;

    Order.findById(orderId, (err, order) => {
        if (err) {
            console.log(err);
            return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err);
        }

        if (order.customerId != userDetails.id) {
            return res
                .status(HttpStatusCodes.FORBIDDEN)
                .json({ error: "You can't edit somebody else's orders" });
        }

        const currentQuantity = order.quantity;
        Product.findById(order.productId, (err, product) => {
            if (err) {
                console.log(err);
                return res
                    .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
                    .json(err);
            }

            if (product.state > constants.PRODUCT_STATE.PLACED) {
                return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
                    error:
                        "You can't edit an order once it has been dispatched",
                });
            }

            const remaining = product.quantity - quantity + currentQuantity;
            if (remaining < 0) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    quantity: "You cant order more than available",
                });
            }

            Order.findOneAndUpdate(
                { _id: orderId },
                { quantity: quantity },
                err => {
                    if (err) {
                        console.log(err);
                        return res
                            .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                            .json(err);
                    }

                    const productUpdates = {
                        quantity: remaining,
                        state:
                            remaining == 0
                                ? constants.PRODUCT_STATE.PLACED
                                : constants.PRODUCT_STATE.WAITING,
                    };

                    Product.findOneAndUpdate(
                        { _id: product._id },
                        productUpdates,
                        err => {
                            if (err) {
                                console.log(err);
                                return res
                                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                                    .json(err);
                            }

                            res.sendStatus(HttpStatusCodes.OK);
                        }
                    );
                }
            );
        });
    });
});

/*
 * @route POST /order/rate
 * @desc Gives a rating to the vendor
 * @access Restricted
 */
router.get("/rate", (req, res) => {
    console.log("---\n/order/rate\n", req.body, "\n---");

    const { errors, isValid } = validateRatingInput(req.body);

    if (!isValid) {
        return res.send(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
    }

    const { orderId, userDetails } = req.body;

    Order.findOne({ _id: orderId }, (err, order) => {
        if (err) {
            console.log(err);
            return res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }

        const { vendorId, customerId } = order;

        if (userDetails.id != customerId) {
            return res.send(HttpStatusCodes.BAD_REQUEST).json({
                error: "You can't rate an order which you didn't place",
            });
        }

        User.findOne({ _id: vendorId, isVendor: true }, (err, user) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            const { rating, totalRating } = user;

            let total = rating * totalRating;
        });
    });
});

module.exports = router;
