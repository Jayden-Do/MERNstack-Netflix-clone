import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenSetCookie = (user_id, res) => {
    const token = jwt.sign({ user_id }, ENV_VARS.SECRET_KEY, { expiresIn: "15d" });

    res.cookie("jwt-netflix", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
        httpOnly: true, // prevent XSS attacks cross_site scripting attacks, make it not be accessed by JS
        sameSite: "strict", // CSRF attacks cross_site request forgery attacks
        secure: ENV_VARS.NODE_ENV !== "development",
    });
    return token;
};
