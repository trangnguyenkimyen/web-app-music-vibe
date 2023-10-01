const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "",
    },
    desc: {
        type: String,
        default: "",
    },
    collaborative: {
        type: Boolean,
        default: false,
    },
    public: {
        type: Boolean,
        default: false,
    },
    images: {
        type: [String],
        default: [],
    },
    owner: { type: objectId, ref: "User" },
    followers: [{ type: objectId, ref: "User" }],
    songs: [{ type: objectId, ref: "Song" }],
    type: {
        type: String,
        required: true,
        default: "playlist",
        enum: ["playlist"]
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Playlist", PlaylistSchema);