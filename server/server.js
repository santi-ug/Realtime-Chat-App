import dotenv from 'dotenv';
import express from 'express';

import dbConnection from './configs/db.config.js';

import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse incoming requests with JSON payloads
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    dbConnection();
    console.log(`Server running on port ${PORT}`)
})