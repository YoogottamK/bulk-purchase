const HttpStatusCodes = require("http-status-codes");

const ensureVendorRoute = (req, res, next) => {
    if (!req.body.userDetails.isVendor) {
        res.sendStatus(HttpStatusCodes.NOT_FOUND);
    } else {
        next();
    }
};

const ensureCustomerRoute = (req, res, next) => {
    if (req.body.userDetails.isVendor) {
        res.sendStatus(HttpStatusCodes.NOT_FOUND);
    } else {
        next();
    }
};

module.exports = {
    vendor: ensureVendorRoute,
    customer: ensureCustomerRoute,
};
