const Album = require("../models/Album");
const Song = require("../models/Song");
const User = require("../models/User");
const createError = require("../utils/error");

// @desc    Create an album  
// @route   POST api/albums/
const createAlbum = async (req, res, next) => {
    try {
        await new Album(req.body).save();
        res.status(200).json("Created successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Update a album by id  
// @route   PUT api/albums/:id
const updateAlbum = async (req, res, next) => {
    try {
        const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedAlbum);
    } catch (err) {
        next(err);
    }
}

// @desc    Delete an album by id
// @route   DELETE api/albums/:id
const deleteAlbum = async (req, res, next) => {
    try {
        const albumId = req.params.id;
        await Song.updateMany({
            $pull: { albums: albumId }
        });
        await User.updateMany({
            $pull: { albums: albumId }
        });
        await Album.findByIdAndDelete(albumId);
        res.status(200).json("Deleted successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Get a album by id  
// @route   GET api/albums/find/:id
const getAlbum = async (req, res, next) => {
    try {
        const album = await Album
            .findById(req.params.id)
            .populate("artists")
            .populate("songs");
        if (!album) {
            return next(createError(403, "You are not authorized!"));
        }

        res.status(200).json(album);
    } catch (err) {
        next(err);
    }
}

// @desc    Get all albums
// @route   GET api/albums/
const getAllAlbums = async (req, res, next) => {
    try {
        let ids = req.query.ids;

        if (ids) {
            ids = ids.split(",");
            if (ids.length > 50) {
                return next(createError(400, "Invalid query id"));
            };
            const albums = await Album
                .find({
                    _id: ids,
                })
                .populate("artists");
            return res.status(200).json(albums);
        }

        const albums = await Album
            .find()
            .populate("artists");
        return res.status(200).json(albums);
    } catch (err) {
        next(err);
    }
}

// @desc    Get album's songs
// @route   GET api/albums/:id/songs
const getAlbumSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const album = await Album
            .findById(req.params.id)
            .populate({
                path: "songs",
                options: { limit: limit, skip: offset },
                populate: "artists"
            });

        res.status(200).json(album.songs);
    } catch (err) {
        next(err);
    }
};

// @desc    Get popular albums
// @route   GET api/albums/top/popular
const getPopularAlbums = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const albums = await Album.aggregate([
            {
                $lookup: {
                    from: "songs",
                    localField: "songs",
                    foreignField: "_id",
                    as: "songs"
                }
            },
            { $unwind: "$songs" },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    totalPlays: { $sum: "$songs.plays" },
                }
            },
            { $sort: { totalPlays: -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) },
        ]);

        res.status(200).json(albums);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbum,
    getAllAlbums,
    getAlbumSongs,
    getPopularAlbums,
}