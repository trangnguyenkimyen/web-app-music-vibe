const Song = require("../models/Song");
const User = require("../models/User");
const Artist = require("../models/Artist");
const createError = require("../utils/error");
const Playlist = require("../models/Playlist");
const { use } = require("../routes/me");
const Album = require("../models/Album");

// @desc    Get current user’s playlists
// @route   GET api/me/playlists
const getPlaylists = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const user = await User
            .findById(req.user.id)
            .populate({
                path: "playlists",
                options: {
                    skip: offset,
                    limit: limit
                }
            });
        res.status(200).json(user.playlists);

    } catch (err) {
        next(err);
    }
};

// @desc    Get current user’s profile
// @route   GET api/me
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const { password, isAdmin, __v, ...others } = user._doc;
        res.status(200).json({ ...others });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user’s top items
// @route   GET api/me/top/:type
const getTopItems = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        const type = req.params.type;
        const user = await User.findById(req.user.id);
        const itemIds = await Promise.all(
            user.currentlyPlaying.map(item => { return item.itemId })
        );

        if (type === "songs") {
            const songs = await Song
                .find({
                    _id: { $in: itemIds }
                })
                .skip(offset)
                .limit(limit);
            return res.status(200).json(songs);
        } else if (type === "artists") {
            const artists = await Artist
                .find({
                    _id: { $in: itemIds }
                })
                .skip(offset)
                .limit(limit);
            return res.status(200).json(artists);
        } else {
            return next(createError(400, "Invalid param type"));
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Get followed artists/users
// @route   GET api/me/following?type=
const getFollowedArtists = async (req, res, next) => {
    try {
        const type = req.query.type;
        const limit = req.query.limit || 20;
        const user = await User.findById(req.user.id);

        if (type === "user") {
            const list = await User
                .find({
                    _id: user.followings,
                })
                .select("name img")
                .limit(limit);
            return res.status(200).json(list);
        } else if (type === "artist") {
            const list = await Artist
                .find({
                    _id: user.followings,
                })
                .select("name images")
                .limit(limit);
            return res.status(200).json(list);
        } else {
            return next(createError(400, "Invalid query type"));
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's liked playlists
// @route   GET api/me/liked-playlists
const getLikedPlaylists = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        const curUserId = req.user.id;

        const user = await User
            .findById(curUserId)
            .populate({
                path: "playlists",
                match: { "owner": { $ne: curUserId } },
                options: { skip: offset, limit: limit },
            });
        res.status(200).json(user.playlists);
    } catch (err) {
        next(err);
    }
}

// @desc    Get user's liked songs
// @route   GET api/me/liked-songs
const getLikedSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        const curUserId = req.user.id;

        const user = await User
            .findById(curUserId)
            .populate({
                path: "likedSongs",
                options: { skip: offset, limit: limit },
            });
        res.status(200).json(user.likedSongs);
    } catch (err) {
        next(err);
    }
}

// @desc    Get user's currently played
// @route   GET api/me/currently-played
const getCurrentlyPlayed = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const itemIds = await Promise.all(
            user.currentlyPlaying.map(item => { return item.itemId })
        );

        let items = await Promise.all(
            itemIds.map(async (itemId) => {
                let result;

                const album = await Album
                    .findById(itemId)
                    .select("name images");
                const artist = await Artist
                    .findById(itemId)
                    .select("name images");
                const playlist = await Playlist
                    .findById(itemId)
                    .select("name images");
                const song = await Song
                    .findById(itemId)
                    .select("name")
                    .populate({
                        path: "album",
                        select: "images",
                    });
                if (album) {
                    result = album;
                } else if (artist) {
                    result = artist;
                } else if (playlist) {
                    result = playlist;
                } else if (song) {
                    result = song;
                }

                return result;
            })
        );
        items = items.slice(0, 44);
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
}

// @desc    Follow/Unfollow playlist
// @route   PUT api/me/playlists/:id
const followPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id;
        const playlist = await Playlist.findById(playlistId);
        if (playlist.owner == req.user.id) {
            return next(createError(400, "You can not follow your playlist"));
        }
        const user = await User.findById(req.user.id);
        // If user has followed playlist    
        if (user.playlists.includes(req.params.id)) {
            // Unfollow
            await user.updateOne({
                $pull: { playlists: playlistId }
            });
            await Playlist.findByIdAndUpdate(playlistId, {
                $pull: { followers: user._id }
            });
            return res.status(200).json("Playlist unfollowed");
        } else {
            // Follow
            await user.updateOne({
                $push: { playlists: playlistId }
            });
            await Playlist.findByIdAndUpdate(playlistId, {
                $push: { followers: user._id }
            });
            return res.status(200).json("Playlist followed");
        }
    } catch (err) {
        next(err);
    }
}

// @desc    Follow/Unfollow artist/user
// @route   PUT api/me/following/:id?type=
const followArtistUser = async (req, res, next) => {
    try {
        const curUser = await User.findById(req.user.id);
        const type = req.query.type;
        const id = req.params.id;
        if (id === req.user.id) {
            return next(createError(400, "You can not follow yourself"));
        }
        // If user has followed
        if (curUser.followings.some(following => following.id === id)) {
            // Unfollow
            await curUser.updateOne({
                $pull: { followings: id }
            });
            if (type === "user") {
                await User.findByIdAndUpdate(id, { $pull: { followers: curUser._id } });
                return res.status(200).json("User unfollowed");
            } else {
                await Artist.findByIdAndUpdate(id, { $pull: { followers: curUser._id } });
                return res.status(200).json("Artist unfollowed");
            }
        } else {
            // Follow
            await curUser.updateOne({
                $push: { followings: id }
            });
            if (type === "user") {
                await User.findByIdAndUpdate(id, { $push: { followers: curUser._id } });
                return res.status(200).json("User followed");
            } else {
                await Artist.findByIdAndUpdate(id, { $push: { followers: curUser._id } });
                return res.status(200).json("Artist followed");
            }
        }
    } catch (err) {
        next(err);
    }
}

// @desc    Like song
// @route   POST api/me/songs/:id
const likeSong = async (req, res, next) => {
    try {
        const songId = req.params.id;
        const user = await User.findById(req.user.id);
        if (user.likedSongs.includes(songId)) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { likedSongs: req.params.id },
            });
            return res.status(200).json("Song unliked");
        } else {
            await User.findByIdAndUpdate(req.user.id, {
                $push: { likedSongs: req.params.id },
            });
            return res.status(200).json("Song liked");
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getPlaylists,
    getProfile,
    getTopItems,
    getFollowedArtists,
    getLikedPlaylists,
    getLikedSongs,
    getCurrentlyPlayed,
    followPlaylist,
    followArtistUser,
    likeSong,
}