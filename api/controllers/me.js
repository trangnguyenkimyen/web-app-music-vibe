const Song = require("../models/Song");
const User = require("../models/User");
const Artist = require("../models/Artist");
const createError = require("../utils/error");
const Playlist = require("../models/Playlist");
const { use } = require("../routes/me");
const Album = require("../models/Album");
const { default: mongoose } = require("mongoose");

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
                },
                match: { owner: { $eq: req.user.id } }
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

        // Group by itemId and count the number of duplicate
        const duplicates = await User.aggregate([
            { $unwind: '$currentlyPlaying' },
            {
                $group: {
                    _id: '$currentlyPlaying.itemId',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1 // decrease
                }
            }
        ]);

        const itemIds = duplicates.map(d => {
            return d._id;
        });

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
        const offset = req.query.offset || 0;
        const user = await User.findById(req.user.id);

        if (type === "user") {
            const list = await User
                .find({
                    _id: user.followings,
                })
                .select("name img type")
                .skip(offset)
                .limit(limit);
            return res.status(200).json(list);
        } else if (type === "artist") {
            const list = await Artist
                .find({
                    _id: user.followings,
                })
                .select("name images type")
                .skip(offset)
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
};

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
                populate: [
                    {
                        path: "album",
                        select: "name images"
                    },
                    {
                        path: "artists",
                        select: "name"
                    }
                ]
            });
        res.status(200).json(user.likedSongs);
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's liked albums
// @route   GET api/me/liked-albums
const getLikedAlbums = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        const curUserId = req.user.id;

        const user = await User
            .findById(curUserId)
            .populate({
                path: "albums",
                options: { skip: offset, limit: limit },
                populate: [
                    {
                        path: "artists",
                        select: "name"
                    }
                ],
                select: "name images artists"
            });
        res.status(200).json(user.albums);
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's currently played
// @route   GET api/me/currently-played
const getCurrentlyPlayed = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        const user = await User
            .findById(req.user.id)
            .populate({
                path: 'currentlyPlaying.itemId',
                sort: { date: -1 },
                populate: [
                    {
                        path: "artists",
                        select: "name",
                        strictPopulate: false,
                    },
                    {
                        path: "album",
                        select: "name images",
                        strictPopulate: false,
                    }
                ]
            });

        let list = user.currentlyPlaying.slice(offset, limit);

        list = list.map(item => {
            return item.itemId;
        })

        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
}

// @desc    Get recommended artists
// @route   GET api/me/recommended-artists
const getRecommendedArtists = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const user = await User
            .findById(req.user.id)
            .populate({
                path: "likedSongs",
                select: "artists"
            })
            .populate({
                path: "albums",
                select: "artists"
            })
            .populate({
                path: "currentlyPlaying.itemId",
                populate: [
                    {
                        path: "artists",
                        select: "name",
                        strictPopulate: false,
                    },
                ],
                select: "type"
            });

        // Get artists in liked songs
        const likedSongsArtists = user.likedSongs.flatMap(s => {
            return s.artists;
        });

        // Get artists in liked albums
        const likedAlbumsArtists = user.albums.flatMap(a => {
            return a.artists;
        });

        // Get artists in currentlyPlaying
        let currentlyPlayingArtists = user.currentlyPlaying.map(c => {
            if (c.itemId.type === "artist") {
                return c.itemId._id;
            } else {
                return c.itemId.artists;
            }
        });
        currentlyPlayingArtists = currentlyPlayingArtists.flat(2);
        const flattedCurrentlyPlayingArtists = currentlyPlayingArtists.map(a => {
            return a._id;
        });

        // Get related artists of favor artists
        const songs = await Song
            .find({
                artists: { $in: user.followings }
            })
            .select("artists");
        const relatedArtists = songs.flatMap(s => {
            return s.artists;
        })

        let list = [likedSongsArtists, likedAlbumsArtists, flattedCurrentlyPlayingArtists, relatedArtists];
        list = list.flat(1);

        const result = await Artist
            .find({
                _id: { $in: list },
                followers: { $nin: req.user.id }
            })
            .skip(offset)
            .limit(limit);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// @desc    Get recommended songs
// @route   GET api/me/recommended-songs
const getRecommendedSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const user = await User
            .findById(req.user.id)
            .populate({
                path: "albums",
                select: "songs",
                options: { limit: 5 },
            })
            .populate({
                path: "playlists",
                match: { "owner": { $eq: req.user.id } },
                select: "songs",
                options: { limit: 3 },
            })
            .populate({
                path: "currentlyPlaying.itemId",
                populate: [
                    {
                        path: "songs",
                        select: "_id",
                        strictPopulate: false,
                    },
                ],
                select: "type"
            });

        // Songs from favor albums
        const albumSongs = await Promise.all(
            user.albums.flatMap(album => {
                return album.songs;
            })
        );

        // Songs from favor artists
        const artists = await Artist
            .find({
                _id: { $in: user.followings }
            });

        let artistSongs = await Song
            .find({
                artists: { $in: artists }
            })
            .select("_id");
        artistSongs = await Promise.all(
            artistSongs.flatMap(song => {
                return song._id;
            })
        );

        // Songs from favor playlists
        const playlistSongs = await Promise.all(
            user.playlists.flatMap(playlist => {
                return playlist.songs;
            })
        );

        // Currently listening's songs
        let currentListenSongs = await Promise.all(
            user.currentlyPlaying.map(item => {
                if (item.itemId.type === "song") {
                    return item.itemId._id;
                } else if (item.itemId.type !== "artist") {
                    return item.itemId.songs.map(song => {
                        return song._id;
                    });
                }
            })
        );

        currentListenSongs = currentListenSongs.flat(2);

        let songIds = [albumSongs, artistSongs, playlistSongs, currentListenSongs];

        songIds = songIds.flat(1);

        const list = await Song.aggregate([
            {
                $match: { _id: { $in: songIds, $nin: user.likedSongs } }
            },
            {
                $sample: { size: Number(limit) }
            },
            {
                $skip: offset
            },
            {
                $lookup: {
                    from: "albums",
                    localField: "album",
                    foreignField: "_id",
                    as: "album",
                },
            },
            {
                $lookup: {
                    from: "artists",
                    localField: "artists",
                    foreignField: "_id",
                    as: "artists",
                }
            },
        ])

        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

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
        if (curUser.followings.includes(id)) {
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
// @route   PUT api/me/songs/:id
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

// @desc    Like album
// @route   PUT api/me/albums/:id
const likeAlbum = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        const user = await User.findById(req.user.id);
        if (user.albums.includes(albumId)) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { albums: req.params.id },
            });
            return res.status(200).json("Album unliked");
        } else {
            await User.findByIdAndUpdate(req.user.id, {
                $push: { albums: req.params.id },
            });
            return res.status(200).json("Album liked");
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Add currently played
// @route   PUT api/me/currently-played/:id
const addCurrentlyPlayed = async (req, res, next) => {
    try {
        const item = {
            itemId: req.params.id,
            itemModel: req.body.itemModel
        }
        const user = await User.findByIdAndUpdate(req.user.id, {
            $push: { currentlyPlaying: item }
        }, { new: true });

        return res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPlaylists,
    getProfile,
    getTopItems,
    getFollowedArtists,
    getLikedPlaylists,
    getLikedSongs,
    getLikedAlbums,
    getCurrentlyPlayed,
    getRecommendedArtists,
    getRecommendedSongs,
    followPlaylist,
    followArtistUser,
    likeSong,
    likeAlbum,
    addCurrentlyPlayed
}