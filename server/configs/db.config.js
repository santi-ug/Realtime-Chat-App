import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database connected");
    } catch (error) {
        console.log("Error connecting to database", error.message);
    }
};

export default dbConnection;