import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Files import karna
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js';
import { verifyEmailService } from './utils/otpMailer.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes declaration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 8000;

const frontendDistPath = resolve(dirname(fileURLToPath(import.meta.url)), '../frontend/dist');
const frontendIndexPath = resolve(frontendDistPath, 'index.html');

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

if (existsSync(frontendIndexPath)) {
    app.use(express.static(frontendDistPath));
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api/')) {
            return next();
        }

        res.sendFile(frontendIndexPath);
    });
}



const startServer = async () => {
    await connectDB();
    await verifyEmailService();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
});