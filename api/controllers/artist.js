const Album = require("../models/Album");
const Artist = require("../models/Artist");
const Song = require("../models/Song");
const createError = require("../utils/error");

// @desc    Create an artist  
// @route   POST api/artists/
const createArtist = async (req, res, next) => {
    try {
        await new Artist(req.body).save();
        res.status(200).json("Created successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Update a artist by id  
// @route   PUT api/artists/:id
const updateArtist = async (req, res, next) => {
    try {
        const updatedArtist = await Artist.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedArtist);
    } catch (err) {
        next(err);
    }
}

// @desc    Delete an artist by id
// @route   DELETE api/artists/:id
const deleteArtist = async (req, res, next) => {
    try {
        const artistId = req.params.id;

        await Song.updateMany({
            $pull: { artists: artistId }
        });

        await Artist.findByIdAndDelete(artistId);
        res.status(200).json("Deleted successfully!");
    } catch (err) {
        next(err);
    }
};

// @desc    Get a artist by id  
// @route   GET api/artists/find/:id
const getArtist = async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id).populate("artists");
        res.status(200).json(artist);
    } catch (err) {
        next(err);
    }
}

// @desc    Get all artists
// @route   GET api/artists/
const getAllArtists = async (req, res, next) => {
    try {
        let ids = req.query.ids;
        let artists = [];
        if (ids) {
            ids = ids.split(",");
            if (ids.length > 50) {
                return next(createError(400, "Invalid query ids"));
            }
            artists = await Artist.find({ _id: ids });
        } else {
            artists = await Artist.find();
        }
        res.status(200).json(artists);
    } catch (err) {
        next(err);
    }
}

// @desc    Get artist's albums
// @route   GET api/artists/:id/albums
const getArtistAlbum = async (req, res, next) => {
    try {
        const getAlbums = (conditions, offset, limit) => {
            return Album
                .find(conditions)
                .populate("artists")
                .skip(offset)
                .limit(limit);
        };

        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;
        let include_groups = req.query.include_groups;

        if (include_groups) {
            include_groups = include_groups.split(",");
            const albums = await getAlbums({
                artists: req.params.id,
                album_type: { $in: include_groups },
            }, offset, Math.ceil(limit / 2));

            if (include_groups.includes("appears_on")) {
                const songs = await Song.find({
                    artists: req.params.id,
                });
                const albumIds = await Promise.all(
                    songs.map(song => { return song.album })
                );
                const appears_on = await getAlbums({
                    artists: { $ne: req.params.id },
                    _id: { $in: albumIds },
                }, offset, Math.floor(limit / 2));

                return res.status(200).json({ albums, appears_on });
            }
            return res.status(200).json(albums);
        }

        const albums = await getAlbums({
            artists: req.params.id,
        }, offset, limit);
        return res.status(200).json(albums);

    } catch (err) {
        next(err);
    }
}

// @desc    Get artist's top songs
// @route   GET api/artists/:id/top-songs
const getArtistTopSongs = async (req, res, next) => {
    try {
        const songs = await Song
            .find({
                artists: req.params.id,
            })
            .populate({
                path: "artists",
                select: "name"
            })
            .populate({
                path: "album",
                select: "name"
            })
            .sort({
                "plays": -1
            })
            .limit(10);

        res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
}

// @desc    Get artist's related artists
// @route   GET api/artists/:id/related-artists
const getRelatedArtists = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const songs = await Song.find({
            artists: req.params.id,
        });
        const artistIds = await Promise.all(
            songs.flatMap(song => { return song.artists })
        );
        const artists = await Artist
            .find({
                _id: { $in: artistIds, $ne: req.params.id }
            })
            .limit(limit);
        res.status(200).json(artists);
    } catch (err) {
        next(err);
    }
};



module.exports = {
    createArtist,
    updateArtist,
    deleteArtist,
    getArtist,
    getAllArtists,
    getArtistAlbum,
    getArtistTopSongs,
    getRelatedArtists,
}