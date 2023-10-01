const mongoose = require("mongoose");
const { Schema } = mongoose;

const objectId = Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    followers: {
        type: [String],
        default: [],
    },
    followings: {
        type: [String],
        default: [],
    },
    img: {
        type: String,
        default: "",
    },
    likedSongs: [{ type: objectId, ref: "Song" }],
    playlists: [{ type: objectId, ref: "Playlist" }],
    albums: [{ type: objectId, ref: "Album" }],
    currentlyPlaying: [
        {
            itemId: { type: String },
            type: { type: String },
            time: { type: Date, default: Date.now },
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
        default: "user",
        enum: ["user"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);