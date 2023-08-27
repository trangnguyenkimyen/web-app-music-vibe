const mongoose = require("mongoose");
const createError = require("./error");

const validObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(createError(400, "Invalid param id"));
    }
    next();
};

module.exports = validObjectId;