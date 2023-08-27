const Album = require("../models/Album");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const User = require("../models/User");
const createError = require("../utils/error");

// @desc    Create playlist  
// @route   POST api/playlists/
const createPlaylist = async (req, res, next) => {
    try {
        const newPlaylist = new Playlist({
            ...req.body,
            owner: req.user.id,
        });
        const savedPlaylist = await newPlaylist.save();

        await User.findByIdAndUpdate(savedPlaylist.owner, {
            $push: { playlists: savedPlaylist._id }
        });

        res.status(200).json("Create successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Update a playlist by id  
// @route   PUT api/playlists/:id
const updatePlaylist = async (req, res, next) => {
    try {
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            { $set: { ...req.body } },
            { new: true }
        )
        if (!updatedPlaylist) {
            return next(createError(403, "You don't have authorized!"));
        }

        res.status(200).json(updatedPlaylist);
    } catch (err) {
        next(err);
    }
}

// @desc    Delete a playlist by id
// @route   DELETE api/playlists/:id
const deletePlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id;
        const playlist = await Playlist.findById(playlistId);

        if (playlist.owner !== req.user.id && !req.user.isAdmin) {
            return next(createError(403, "You don't have authorized"));
        }

        await User.findByIdAndUpdate(playlist.owner, {
            $pull: { playlists: playlistId }
        });

        await playlist.deleteOne();
        res.status(200).json("Deleted successfully!");
    } catch (err) {
        next(err);
    }
}

// @desc    Get a playlist by id  
// @route   GET api/playlists/find/:id
const getPlaylist = async (req, res, next) => {
    try {
        const playlist = await Playlist
            .findById(req.params.id)
            .populate({
                path: "owner",
                select: "name img",
            })
            .populate("songs");
        res.status(200).json(playlist);
    } catch (err) {
        next(err);
    }
}

// @desc    Get all playlists
// @route   GET api/playlists/
const getAllPlaylists = async (req, res, next) => {
    try {
        let ids = req.query.ids;
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        if (ids) {
            ids = ids.split(",");
            if (ids.length > 50) {
                return next(createError(400, "Invalid query id"));
            };
            const playlists = await Playlist
                .find({
                    _id: { $in: ids }
                })
                .skip(offset)
                .limit(limit);
            return res.status(200).json(playlists);
        }

        const playlists = await Playlist
            .find()
            .skip(offset)
            .limit(limit);

        return res.status(200).json(playlists);
    } catch (err) {
        next(err);
    }
};

// @desc    Get playlist's songs
// @route   GET api/playlists/:id/songs
const getPlaylistSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const playlist = await Playlist
            .findById(req.params.id)
            .populate({
                path: "songs",
                populate: [
                    {
                        path: "artists",
                        select: "name",
                    },
                    {
                        path: "album",
                        select: "name",
                    }
                ],
                options: { skip: offset, limit: limit },
            });
        res.status(200).json(playlist.songs);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getPlaylist,
    getAllPlaylists,
    getPlaylistSongs,
}