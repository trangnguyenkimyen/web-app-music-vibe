const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
}, {
    timestamps: true,
});

module.exports = mongoose.model("Playlist", PlaylistSchema);