const express = require("express"),
    router = express.Router(),
    HttpStatusCodes = require("http-status-codes");

const validateAddProductInput = require("../validation/addProduct"),
    tokenValidatorMiddleware = require("../validation/tokenValidatorMiddleware"),
    userTypeMiddleware = require("../validation/userTypeMiddleware");

const Product = require("../models/product");

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

    Product.find({})
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
 * @route POST /order/new
 * @desc Create new order
 * @access Restricted
 */
router.post("/new", (req, res) => {
    console.log("---\n/order/new\n", req.body, "\n---");
    const { errors, isValid } = validateAddProductInput(req.body);

    if (!isValid) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json(errors);
    }

    let { name, price, quantity, image, userDetails } = req.body;

    price = parseInt(price);
    quantity = parseInt(quantity);

    const newProduct = new Product({
        name: name,
        price: price,
        quantity: quantity,
        state: constants.PRODUCT_STATE["WAITING"],
        vendorId: userDetails.id,
        image: image,
    });

    newProduct
        .save()
        .then(product => res.json(product))
        .catch(err => console.log(err));

    console.log(name, price, quantity, image, userDetails);
});

/*
 * @route DELETE /product/:id
 * @desc delete a product owned by this vendor
 * @access Restricted
 */
router.delete("/:id", (req, res) => {
    const productId = req.params.id;

    console.log("---\n/order/:id\n", req.body, "\n", productId, "\n---");

    Product.deleteOne({ _id: productId }).then(err => {
        if (err) res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
    });

    return res.sendStatus(HttpStatusCodes.OK);
});

module.exports = router;
