const validator = require("validator"),
    isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }
    if (validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    }
    if (validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    if (validator.isEmpty(data.password2)) {
        errors.password = "Please re-enter the password";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (!validator.isLength(data.password, { min: 8, max: 32 })) {
        errors.password = "Length of password should be between 8 and 32";
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "The passwords should match!";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
