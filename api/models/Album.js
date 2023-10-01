const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    album_type: {
        type: String,
        required: true,
    },
    release_date: {
        type: Date,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    genres: {
        type: [String],
        default: [],
    },
    artists: [{ type: objectId, ref: "Artist" }],
    songs: [{ type: objectId, ref: "Song" }],
    type: {
        type: String,
        required: true,
        default: "album",
        enum: ["album"]
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Album", AlbumSchema);