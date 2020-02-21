const validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateRatingInput(data) {
    let errors = {};

    data.givenRating = !isEmpty(data.givenRating) ? data.givenRating : "";

    if (validator.isEmpty(data.givenRating)) {
        errors.rating = "Rating of the product is required";
    }

    if (!validator.isInt(data.givenRating, { min: 1, max: 5 })) {
        errors.rating = "Rating should be a number from 1 to 5";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
