const validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateRatingInput(data) {
    let errors = {};

    data.rating = !isEmpty(data.rating) ? data.rating : "";

    if (validator.isEmpty(data.rating)) {
        errors.rating = "Rating of the product is required";
    }

    if (!validator.isInt(data.rating, { min: 1, max: 5 })) {
        errors.rating = "Rating should be a number from 1 to 5";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
