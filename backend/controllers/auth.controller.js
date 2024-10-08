import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Valid email required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUserByUsername = await User.findOne({ username: username });
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const existingUserByEmail = await User.findOne({ email: email });
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const RANDOM_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = RANDOM_PICS[Math.floor(Math.random() * RANDOM_PICS.length)];

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            image,
        });

        generateTokenSetCookie(newUser._id, res);
        await newUser.save();

        return res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in signup controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in login controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const authCheck = async (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.log("Error in authCheck controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
