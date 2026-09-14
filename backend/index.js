import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';

// Files import karna
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();

// Routes declaration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);




const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send(`<h2>Backend is running</h2>`);
})



app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})