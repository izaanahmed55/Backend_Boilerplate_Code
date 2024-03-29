import bcrypt from "bcryptjs";
import User from "../../database/models/user.model.js";
import * as JWTService from "../../services/JWTService.js";
import RefreshToken from "./token.js";
import {
    userLoginSchema,
    userRegisterSchema,
} from "../../services/JoiValidation.js";

export const register = async (req, res, next) => {
    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
        return next(error);
    }

    const { username, firstName, lastName, email, password } = req.body;

    try {
        const emailInUse = await User.exists({ email });

        const usernameInUse = await User.exists({ username });

        if (emailInUse) {
            const error = {
                status: 409,
                message: "Email already registered, use another email!",
            };

            return next(error);
        }

        if (usernameInUse) {
            const error = {
                status: 409,
                message: "Username not available, choose another username!",
            };

            return next(error);
        }
    } catch (error) {
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let accessToken;
    let refreshToken;

    let user;

    try {
        const userToRegister = new User({
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        user = await userToRegister.save();

        // token generation
        accessToken = JWTService.signAccessToken({ _id: user._id }, "1m");
        refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
        return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });

    // const userDto = new UserDTO(user);

    return res.status(201).json({ user: user, auth: true });
};

export const login = async (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);

    if (error) {
        return next(error);
    }

    const { email, password } = req.body;

    let user;

    try {
        user = await User.findOne({ email });

        if (!user) {
            const error = {
                status: 401,
                message: "Invalid Email",
            };

            return next(error);
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            const error = {
                status: 401,
                message: "Invalid password",
            };

            return next(error);
        }
    } catch (error) {
        return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "5m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
        await RefreshToken.updateOne(
            {
                _id: user._id,
            },
            { token: refreshToken },
            { upsert: true }
        );
    } catch (error) {
        return next(error);
    }

    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    });

    // const userDto = new UserDTO(user);

    return res.status(200).json({ user, auth: true });
};
export const logout = async (req, res, next) => {
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
        await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
        return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2. response
    res.status(200).json({ user: null, auth: false });
};

export const refreshToken = async (req, res, next) => {
    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
        id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
        const error = {
            status: 401,
            message: "Unauthorized",
        };

        return next(error);
    }

    try {
        const match = RefreshToken.findOne({
            _id: id,
            token: originalRefreshToken,
        });

        if (!match) {
            const error = {
                status: 401,
                message: "Unauthorized",
            };

            return next(error);
        }
    } catch (e) {
        return next(e);
    }

    try {
        const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

        const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

        await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        });
    } catch (e) {
        return next(e);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
};
