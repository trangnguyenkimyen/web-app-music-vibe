const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const SongSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    audio: {
        type: String,
        required: true,
    },
    duration_ms: {
        type: Number,
        required: true,
    },
    explicit: {
        type: Boolean,
        default: false,
    },
    song_number: {
        type: Number,
        default: 1,
    },
    plays: {
        type: Number,
        default: 0,
    },
    album: { type: objectId, ref: "Album" },
    artists: [{ type: objectId, ref: "Artist" }],
    type: {
        type: String,
        required: true,
        default: "song",
        enum: ["song"]
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Song", SongSchema);