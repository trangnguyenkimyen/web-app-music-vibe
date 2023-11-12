
const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const createError = require("../utils/error");

// @desc    Search for items
// @route   GET api/search
const searchForItems = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        let albums = [];
        let artists = [];
        let songs = [];
        let playlists = [];
        let profiles = [];
        // q: album’s name, artist’s name, song’s name, genre, playlist's name, username
        const q = req.query.q;
        // type: album, artist, song, playlist, profile
        let type = req.query.type;

        if (!type || !q) {
            return next(createError(400, "Missing parameters"));
        }

        type = type.split(",");
        if (type.includes("album")) {
            const albums_name = await Album
                .find({
                    name: { $regex: '.*' + q + '.*', $options: 'i' }
                })
                .populate({
                    path: "artists",
                    select: "name"
                });
            const albums_genre = await Album
                .find({
                    genres: { $regex: '.*' + q + '.*', $options: 'i' }
                })
                .populate({
                    path: "artists",
                    select: "name"
                });
            if (albums_name) albums.push(albums_name);
            if (albums_genre) albums.push(albums_genre);
            albums = albums.flatMap(item => item).slice(offset, limit);
        }
        if (type.includes("artist")) {
            artists = await Artist
                .find({
                    name: { $regex: '.*' + q + '.*', $options: 'i' }
                })
                .skip(offset)
                .limit(limit);
        }
        if (type.includes("song")) {
            songs = await Song
                .find({
                    name: { $regex: '.*' + q + '.*', $options: 'i' },
                })
                .collation({ locale: "vi", strength: 1 })
                .populate({
                    path: "album",
                    select: "name images"
                })
                .populate({
                    path: "artists",
                    select: "name"
                })
                .skip(offset)
                .limit(limit);
        }
        if (type.includes("playlist")) {
            playlists = await Playlist
                .find({
                    name: { $regex: '.*' + q + '.*', $options: 'i' },
                    public: true,
                })
                .skip(offset)
                .limit(limit);
        }
        if (type.includes("profile")) {
            profiles = await User
                .find({
                    name: { $regex: '.*' + q + '.*', $options: 'i' }
                })
                .select("name img")
                .skip(offset)
                .limit(limit);
        }

        res.status(200).json({ albums, artists, songs, playlists, profiles });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    searchForItems,
}