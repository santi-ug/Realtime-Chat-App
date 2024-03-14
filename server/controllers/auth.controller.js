import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Check if email was properly entered
        if (!email.includes('@') || !email.includes('.') || !email) {
            return res.json({
                error: 'Ingrese el correo correctamente',
                status: 400
            })
        };

        // Check if password is good
        if (!password || password.length < 8) {
            return res.json({
                error: 'Contraseña es requerida y debe tener 8 caracteres minimo.',
                status: 400
            })
        };

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
            // Generate JWT Token
            await generateToken(newUser._id, res);

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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        // Generate JWT Token
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            pfp: user.pfp,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
