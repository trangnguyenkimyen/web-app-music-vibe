const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/error");
const { sendEmail, resetPassword } = require("../utils/sendEmail");

// @desc    Register   
// @route   POST api/auth/register
const register = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (user) {
            return next(createError(403, "User already exists"));
        }

        if (req.body.provider === "") {
            // Generate salt
            const salt = await bcrypt.genSaltSync(Number(process.env.SALT));
            // Hash
            const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

            const newUser = {
                ...req.body,
                password: hashedPassword,
            };

            const token = await jwt.sign(newUser, process.env.JWT, { expiresIn: '24h' });
            const url = `${process.env.CLIENT_URL}/auth/verify/${token}`;
            await sendEmail(newUser.email, "Xác nhận email của bạn để sử dụng ứng dụng vibe", url);

            res.status(200).json("An email sent to your account, please verify");
        } else {
            const user = new User(req.body);
            await user.save();
            res.status(200).json("Register Successfully");
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Verify email   
// @route   GET api/auth/verify/:token
const verifyEmail = async (req, res, next) => {
    try {
        // Verify token
        jwt.verify(req.params.token, process.env.JWT, async (err, decoded) => {
            if (err) {
                // If token is invalid or expired, return token
                return createError(401, "Invalid or expired token");
            } else {
                // If token valid, create a new user from decoded              
                const newUser = new User(decoded);

                const user = await User.findOne({
                    email: newUser.email
                });
                if (user) {
                    return next(createError(403, "User already exists"));
                }

                await newUser.save();

                res.status(200).json("Register Successfully");
            }
        })
    } catch (err) {
        next(err);
    }
};

// @desc    Login   
// @route   POST api/auth/login
const login = async (req, res, next) => {
    try {
        const user = await User
            .findOne({ email: req.body.email })
            .populate({
                path: "playlists",
                select: "name public owner"
            });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        if (req.body.password) {
            if (user.provider === "") {
                const isValidPassword = await bcrypt.compare(req.body.password, user.password);
                if (!isValidPassword) {
                    return next(createError(401, "Error password"));
                }
            } else {
                return next(createError(404, "User not found"));
            }
        }

        // Generate token from id & isAdmin of user
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT,
        );
        const { password, isAdmin, __v, provider, ...others } = user._doc;
        const oneWeekInSeconds = 7 * 24 * 60 * 60; // 1 tuần tính bằng giây
        // Tính thời gian hết hạn bằng cách thêm 1 tuần vào thời gian hiện tại
        const expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + oneWeekInSeconds * 1000);
        res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
                expires: expiresDate,
            })
            .status(200)
            .json({ ...others });
    } catch (err) {
        next(err);
    }
};

// @desc    Send mail reset password   
// @route   POST api/auth/reset-password
const resetPass = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const token = await jwt.sign({ email: user.email }, process.env.JWT, { expiresIn: '24h' });
        const url = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
        await resetPassword(user.email, user.name, "Hướng dẫn đặt lại mật khẩu", url);

        res.status(200).json("An email sent to your account, please verify");
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password  
// @route   GET api/auth/reset-password/:token
const verifyPass = async (req, res, next) => {
    try {
        // Verify token
        jwt.verify(req.params.token, process.env.JWT, async (err, decoded) => {
            if (err) {
                // If token is invalid or expired, return token
                return createError(401, "Invalid or expired token");
            }

            return res.status(200).json(decoded.email);
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    login,
    register,
    verifyEmail,
    resetPass,
    verifyPass
}