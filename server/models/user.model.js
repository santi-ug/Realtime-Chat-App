import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    pfp: {
        type: String,
        default: "",
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;