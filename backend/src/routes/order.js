const express = require("express"),
    router = express.Router(),
    HttpStatusCodes = require("http-status-codes");

const validateAddOrderInput = require("../validation/addOrder"),
    tokenValidatorMiddleware = require("../validation/tokenValidatorMiddleware"),
    userTypeMiddleware = require("../validation/userTypeMiddleware");

const Product = require("../models/product"),
    Order = require("../models/order");

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

    Product.find({ quantity: { $gt: 0 } })
        .populate("vendorId")
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
            } else {
                res.json(docs);
            }
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
                res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
            } else {
                res.json(docs);
            }
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
        } else {
            const remaining = data.quantity - quantity;

            if (remaining < 0) {
                return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json({
                    quantity: "You cant order more than available",
                });
            } else {
                const newOrder = new Order({
                    productId: productId,
                    customerId: userDetails.id,
                    quantity: quantity,
                });

                const productUpdates = {
                    quantity: remaining,
                    state:
                        remaining == 0
                            ? constants.PRODUCT_STATE["PLACED"]
                            : constants.PRODUCT_STATE["WAITING"],
                };

                newOrder
                    .save()
                    .then(order => {
                        Product.findOneAndUpdate(
                            { _id: productId },
                            productUpdates,
                            (err, doc) => {
                                if (err) {
                                    return res
                                        .send(
                                            HttpStatusCodes.INTERNAL_SERVER_ERROR
                                        )
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
            }
        }
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

    Order.findById(orderId, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(err);
        } else {
            const currentQuantity = data.quantity;
            Product.findById(data.productId, (err, data) => {
                if (err) {
                    console.log(err);
                    return res
                        .status(HttpStatusCodes.UNPROCESSABLE_ENTITY)
                        .json(err);
                } else {
                    const remaining =
                        data.quantity - quantity + currentQuantity;
                    if (remaining < 0) {
                        return res.status(HttpStatusCodes.BAD_REQUEST).json({
                            quantity: "You cant order more than available",
                        });
                    } else {
                        Order.findOneAndUpdate(
                            { _id: orderId },
                            { quantity: quantity },
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                    return res
                                        .send(
                                            HttpStatusCodes.INTERNAL_SERVER_ERROR
                                        )
                                        .json(err);
                                } else {
                                    const productUpdates = {
                                        quantity: remaining,
                                        state:
                                            remaining == 0
                                                ? constants.PRODUCT_STATE[
                                                      "PLACED"
                                                  ]
                                                : constants.PRODUCT_STATE[
                                                      "WAITING"
                                                  ],
                                    };

                                    Product.findOneAndUpdate(
                                        { _id: data._id },
                                        productUpdates,
                                        (err, doc) => {
                                            if (err) {
                                                console.log(err);
                                                return res
                                                    .send(
                                                        HttpStatusCodes.INTERNAL_SERVER_ERROR
                                                    )
                                                    .json(err);
                                            } else {
                                                res.sendStatus(
                                                    HttpStatusCodes.OK
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            });
        }
    });
});

module.exports = router;
