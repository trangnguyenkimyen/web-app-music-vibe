const createError = require("./error");

const validLimit = (req, res, next) => {
    const limit = req.query.limit || 20;
    if (limit < 1 || limit > 50) {
        return next(createError(400, "Invalid query limit"));
    }
    next();
};

module.exports = validLimit;