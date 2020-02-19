const validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateAddOrderInput(data) {
    let errors = {};

    data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

    if (validator.isEmpty(data.quantity)) {
        errors.quantity = "Quantity of the product is required";
    }

    if (!validator.isInt(data.quantity, { min: 1 })) {
        errors.quantity = "Quantity should be a number >= 1";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
