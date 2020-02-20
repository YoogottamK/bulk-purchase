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
 * @desc Get all products which have quantity > 0 and not cancelled
 * @access Restricted
 */
router.get("/", (req, res) => {
    console.log("---\n/product\n", req.body, "\n---");
    const { userDetails } = req.body;

    Product.find(
        {
            vendorId: userDetails.id,
            quantity: { $gt: 0 },
            state: { $ne: constants.PRODUCT_STATE.CANCELLED },
        },
        (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                res.json(docs);
            }
        }
    );
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
        return res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).json(errors);
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
});

/*
 * @route GET /product/dispatchable
 * @desc list all products which can be dispatched
 * @access Restricted
 */
router.get("/dispatchable", (req, res) => {
    console.log("---\n/product/dispatchable\n", req.body, "\n---");

    const { userDetails } = req.body;

    Product.find(
        {
            vendorId: userDetails.id,
            state: constants.PRODUCT_STATE.PLACED,
        },
        (err, products) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            } else {
                return res.json(products);
            }
        }
    );
});

/*
 * @route POST /product/dispatch
 * @desc dispatch a product
 * @access Restricted
 */
router.post("/dispatch", (req, res) => {
    console.log("---\n/product/dispatch\n", req.body, "\n---");

    const { productId, userDetails } = req.body;

    Product.findOneAndUpdate(
        { _id: productId, vendorId: userDetails.id },
        { state: constants.PRODUCT_STATE.DISPATCHED },
        (err, product) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            res.json(product);
        }
    );
});

/*
 * @route GET /product/dispatched
 * @desc Return all dispatched products
 * @access Restricted
 */
router.get("/dispatched", (req, res) => {
    console.log("---\n/product/dispatched\n", req.body, "\n---");

    const { userDetails } = req.body;

    Product.find(
        {
            vendorId: userDetails.id,
            state: constants.PRODUCT_STATE.DISPATCHED,
        },
        (err, product) => {
            if (err) {
                console.log(err);
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            res.json(product);
        }
    );
});

/*
 * @route DELETE /product/:id
 * @desc delete a product owned by this vendor:: Marks it as cancelled
 * @access Restricted
 */
router.delete("/:id", (req, res) => {
    const productId = req.params.id;

    console.log("---\n/product/:id\n", req.body, "\n", productId, "\n---");

    Product.findOneAndUpdate(
        { _id: productId },
        { state: constants.PRODUCT_STATE.CANCELLED },
        (err, doc) => {
            if (err) {
                return res
                    .send(HttpStatusCodes.INTERNAL_SERVER_ERROR)
                    .json(err);
            }

            res.json(doc);
        }
    );
});

module.exports = router;
