const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        default: "",
    },
    followers: {
        type: [String],
        default: [],
    },
    images: [
        {
            type: { type: String, default: "avatar" },
            src: { type: String, default: "" },
        }
    ],
    genres: {
        type: [String],
        default: [],
    },
    type: {
        type: String,
        required: true,
        default: "artist",
        enum: ["artist"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Artist", ArtistSchema);