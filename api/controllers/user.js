const Playlist = require("../models/Playlist");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const createError = require("../utils/error");
const Artist = require("../models/Artist");

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

// @desc    Get user's profile by email
// @route   GET api/users/exist/:email
const existUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.params.email
        });
        if (!user) {
            return createError(404, "User not found");
        }
        res.status(200).json(user.email);
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

// @desc    Log out 
// @route   GET api/users/logout
const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        return res.status(200).json("Log out successfully");
    } catch (err) {
        next(err);
    }
};

// @desc    Update user by id   
// @route   PUT api/users/:id
const updateUser = async (req, res, next) => {
    try {
        const updatedPassword = req.body.password;
        let updatedUser = null;

        if (updatedPassword) {
            // Generate salt
            const salt = await bcrypt.genSaltSync(Number(process.env.SALT));
            // Hash
            const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

            updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    ...req.body,
                    password: hashedPassword
                },
            }, { new: true });
        } else {
            updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
        }

        const { password, isAdmin, __v, ...others } = updatedUser._doc;
        res.status(200).json({ ...others });
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password by email   
// @route   PUT api/users/reser-pass/:email
const resetPassword = async (req, res, next) => {
    try {
        // Generate salt
        const salt = await bcrypt.genSaltSync(Number(process.env.SALT));
        // Hash
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

        await User.findOneAndUpdate({ email: req.params.email }, {
            $set: {
                password: hashedPassword
            },
        }, { new: true });

        res.status(200).json("Updated successfully");
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user by id   
// @route   DELETE api/users/:id
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        await Promise.all(
            user.playlists.map(playlistId => {
                // Delete playlists of user
                Playlist.findByIdAndDelete(playlistId);
                // Remove follow
                Playlist.findByIdAndUpdate(playlistId, {
                    $pull: { followers: user._id }
                });
            })
        );

        // Unfollow another users, artists
        await Promise.all(
            user.followings.map(following => {
                User.findByIdAndUpdate(following, { $pull: { followers: user._id } });
                Artist.findByIdAndUpdate(following, { $pull: { followers: user._id } });
            })
        );

        await User.findByIdAndDelete(req.params.id);

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
    resetPassword,
    getUser,
    existUser,
    getAllUsers,
    logout,
    deleteUser,
    getPlaylists,
}