const mongoose = require("mongoose");

function userSchemaGenerator(extraArgs=null) {
    const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    });

    if (extraArgs)
        userSchema.add(extraArgs);

    return userSchema;
}

const Vendor = userSchemaGenerator({ rating: String, reviews: [String] }),
    User = userSchemaGenerator();

module.exports = {
    Vendor,
    User
};
