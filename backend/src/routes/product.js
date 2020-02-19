const express = require("express"),
    router = express.Router(),
    HttpStatusCodes = require("http-status-codes");

const validateAddProductInput = require("../validation/addProduct"),
    tokenValidatorMiddleware = require("../validation/tokenValidatorMiddleware"),
    userTypeMiddleware = require("../validation/userTypeMiddleware");

const Product = require("../models/product");

const constants = require("../config/constants");

router.use(tokenValidatorMiddleware);
router.use(userTypeMiddleware.vendor);

/*
 * @route GET /product
 * @desc Get all products
 * @access Restricted
 */
router.get("/", (req, res) => {
    console.log("---\n/product\n", req.body, "\n---");
    const { userDetails } = req.body;

    Product.find({ vendorId: userDetails.id }, null, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            res.json(docs);
        }
    });
});

/*
 * @route POST /product/new
 * @desc Create new product and add to db
 * @access Restricted
 */
router.post("/new", (req, res) => {
    console.log("---\n/product/new\n", req.body, "\n---");
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

    console.log("---\n/product/:id\n", req.body, "\n", productId, "\n---");

    Product.deleteOne({ _id: productId }).then(err => {
        if (err) res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR).json(err);
    });

    return res.sendStatus(HttpStatusCodes.OK);
});

module.exports = router;
