const validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateAddProductInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.price = !isEmpty(data.price) ? data.price : "";
    data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Product name is required";
    }
    if (validator.isEmpty(data.price)) {
        errors.price = "Price of the product is required";
    }
    if (validator.isEmpty(data.quantity)) {
        errors.quantity = "Quantity of the product is required";
    }

    if (!validator.isInt(data.quantity, { min: 1 })) {
        errors.quantity = "Quantity should be a number >= 1";
    }
    if (!validator.isInt(data.price, { min: 1 })) {
        errors.price = "Price should be be a number >= 1";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
