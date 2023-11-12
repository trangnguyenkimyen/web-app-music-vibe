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
        default: "",
    },
    name: {
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
            itemId: { type: String, refPath: "currentlyPlaying.itemModel" },
            itemModel: { type: String, enum: ['Song', 'Album', 'Artist', 'Playlist'] },
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
    provider: {
        type: String,
        default: "",
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("User", UserSchema);