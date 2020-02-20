const HttpStatusCodes = require("http-status-codes");

const ensureVendorRoute = (req, res, next) => {
    if (!req.body.userDetails.isVendor) {
        return res.sendStatus(HttpStatusCodes.NOT_FOUND);
    }

    next();
};

const ensureCustomerRoute = (req, res, next) => {
    if (req.body.userDetails.isVendor) {
        return res.sendStatus(HttpStatusCodes.NOT_FOUND);
    }

    next();
};

module.exports = {
    vendor: ensureVendorRoute,
    customer: ensureCustomerRoute,
};
