import * as JWTService from "../services/JWTService.js";
import UserDTO from "../dto/user.js";
import User from "../database/models/user.model.js";

const authenticate = async (req, res, next) => {
    try {
        // 1. refresh, access token validation
        console.log("Authenticate", req.cookies);
        const { refreshToken, accessToken } = req.cookies;
        console.log(refreshToken);
        if (!refreshToken || !accessToken) {
            const error = {
                status: 401,
                message: "Unauthorized. Token is required",
            };

            return next(error);
        }

        let _id;

        try {
            _id = JWTService.verifyAccessToken(accessToken)._id;
        } catch (error) {
            return next(error);
        }

        let user;

        try {
            user = await User.findOne({ _id: _id });
        } catch (error) {
            return next(error);
        }

        const userDto = new UserDTO(user);

        req.user = userDto;

        next();
    } catch (error) {
        return next(error);
    }
};

export { authenticate };
