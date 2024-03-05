import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password don't match" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already in use" });
        
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const pfp = "https://source.boringavatars.com/";
        const newUser = new User({ email, password: hashedPassword, pfp });

        if (newUser) {
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                pfp: newUser.pfp,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = (req, res) => {
    console.log("login User");
}

export const logout = (req, res) => {
    console.log("logout User");
}
