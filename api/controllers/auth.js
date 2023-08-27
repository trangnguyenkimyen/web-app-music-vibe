const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/error");

// @desc    Register   
// @route   POST api/auth/register
const register = async (req, res, next) => {
    try {
        // Generate salt
        const salt = await bcrypt.genSaltSync(Number(process.env.SALT));
        // Hash
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json("Register successfully!");
    } catch (err) {
        next(err);
    }
}

// @desc    Login   
// @route   POST api/auth/login
const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return next(createError(401, "Error password"));
        }

        // Generate token from id & isAdmin of user
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT,
        );
        const { password, isAdmin, __v, ...others } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ ...others });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login,
    register,
}