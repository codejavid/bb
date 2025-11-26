
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js";

import thoughtRoutes from "./routes/thoughtRoutes.js"
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect to MongoDB

connectDB(); // call the db function

const app = express();

// Middleware

// CORS - Allow frontend domains
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://your-app.netlify.app', // Will update this later
  ];
  
    app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Test route

app.get("/", (req, res) => {
    res.json({
        message:"Brain Bank API",
        status:"success"
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is started in a ${PORT}`);
})