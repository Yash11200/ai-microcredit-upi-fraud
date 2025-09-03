import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
 
import authRoutes from './routes/auth.routes.js'

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});