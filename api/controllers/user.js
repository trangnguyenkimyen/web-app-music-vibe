const Playlist = require("../models/Playlist");
const User = require("../models/User");

// @desc    Get user's profile
// @route   GET api/users/find/:id
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, isAdmin, __v, ...others } = user._doc;
        res.status(200).json({ ...others });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users
// @route   GET api/users
const getAllUsers = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const users = await User
            .find()
            .skip(offset)
            .limit(limit);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// @desc    Update user by id   
// @route   PUT api/users/:id
const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        const { password, isAdmin, __v, ...others } = updatedUser._doc;
        res.status(200).json({ ...others });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user by id   
// @route   DELETE api/users/:id
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        const user = await User.findById(req.params.id);
        await Promise.all(
            user.playlists.map(playlistId => {
                return Playlist.findByIdAndDelete(playlistId);
            })
        );

        res.status(200).json("User has been deleted");
    } catch (err) {
        next(err);
    }
};

// @desc    Get user's playlists
// @route   GET api/users/:id/playlists
const getPlaylists = async (req, res, next) => {
    try {
        const limit = req.query.limit || 20;
        const offset = req.query.offset || 0;

        const playlists = await User
            .findById(req.params.id)
            .populate({
                path: "playlists",
                match: { public: true },
            })
            .skip(offset)
            .limit(limit);
        res.status(200).json(playlists);

    } catch (err) {
        next(err);
    }
};

module.exports = {
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    getPlaylists,
}