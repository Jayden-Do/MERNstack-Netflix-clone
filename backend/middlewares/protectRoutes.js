import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-netflix"];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized - No token provided" });
        }

        // jwt verify function will throw an exception if the token is invalid
        // so that it will go straight to the catch block.
        // to prevent this, we can group it into another try/catch block.
        let decoded;
        try {
            decoded = jwt.verify(token, ENV_VARS.SECRET_KEY);
        } catch (err) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.user_id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
