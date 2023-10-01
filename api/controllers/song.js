const Album = require("../models/Album");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

// @desc    Create a song  
// @route   POST api/songs/
const createSong = async (req, res, next) => {
    try {
        await new Song(req.body).save();
        res.status(200).json("Create successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Update a song by id  
// @route   PUT api/songs/:id
const updateSong = async (req, res, next) => {
    try {
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedSong);
    } catch (err) {
        next(err);
    }
}

// @desc    Get a song by id  
// @route   GET api/songs/find/:id
const getSong = async (req, res, next) => {
    try {
        const song = await Song
            .findById(req.params.id)
            .populate([
                {
                    path: "artists",
                    select: "name",
                },
                {
                    path: "album",
                    select: "name",
                }
            ])
        res.status(200).json(song);
    } catch (err) {
        next(err);
    }
}

// @desc    Get all songs  
// @route   GET api/songs/
const getAllSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        let ids = req.query.ids;

        if (ids) {
            ids = ids.split(",");
            const songs = await Song
                .find({
                    _id: { $in: ids },
                })
                .populate([
                    {
                        path: "artists",
                        select: "name",
                    },
                    {
                        path: "album",
                        select: "name",
                    }
                ])
                .skip(offset)
                .limit(limit);

            return res.status(200).json(songs);
        }

        const songs = await Song.find()
            .populate([
                {
                    path: "artists",
                    select: "name",
                },
                {
                    path: "album",
                    select: "name",
                }
            ])
            .skip(offset)
            .limit(limit);

        res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
};

// @desc    Get popular songs
// @route   GET api/songs/top/popular
const getPopularSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const songs = await Song.aggregate([
            {
                $lookup: {
                    from: "albums",
                    localField: "album",
                    foreignField: "_id",
                    as: "album"
                }
            },
            {
                $match: {
                    "album.release_date": { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
                }
            },
            { $sort: { plays: -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) },
            { $project: { _id: 1, name: 1, } }
        ]);

        return res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
};

// @desc    Get new released songs
// @route   GET api/songs/top/new-released
const getNewReleasedSongs = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const songs = await Song.aggregate([
            {
                $lookup: {
                    from: "albums",
                    localField: "album",
                    foreignField: "_id",
                    as: "album"
                }
            },
            {
                $match: {
                    "album.release_date": { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
                }
            },
            { $sort: { "album.release_date": -1 } },
            { $skip: Number(offset) },
            { $limit: Number(limit) },
            { $project: { _id: 1, name: 1, } }
        ]);

        return res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a song by id
// @route   DELETE api/songs/:id
const deleteSong = async (req, res, next) => {
    try {
        const songId = req.params.id;

        await Album.updateMany({
            $pull: { songs: songId }
        });

        await Playlist.updateMany({
            $pull: { songs: songId }
        });

        await Song.findByIdAndDelete(songId);
        res.status(200).json("Deleted successfully!");
    } catch (err) {
        next(err);
    }
};


module.exports = {
    createSong,
    getSong,
    getAllSongs,
    getPopularSongs,
    getNewReleasedSongs,
    updateSong,
    deleteSong,
}