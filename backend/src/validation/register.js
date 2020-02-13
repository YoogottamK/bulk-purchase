const Validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password1 = !isEmpty(data.password1) ? data.password1 : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (Validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    }
    if (Validator.isEmpty(data.password1)) {
        errors.password1 = "Password is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password1 = "Please re-enter the password";
    }

    if (!Validator.isLength(data.password1, { min: 8, max: 32 })) {
        errors.password1 = "Length of password should be between 8 and 32";
    }

    if (!Validator.equals(data.password1, data.password2)) {
        errors.password2 = "The passwords should match!";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
