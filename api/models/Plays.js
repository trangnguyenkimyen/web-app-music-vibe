const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaysSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Plays", PlaysSchema);