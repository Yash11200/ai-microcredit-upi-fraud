import express from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
 
import authRoutes from './routes/auth.routes.js'
import loanRoutes from './routes/loan.routes.js';
import fraudRoutes from './routes/fraud.route.js';

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
app.use('/api/loan', loanRoutes);
app.use('/api/fraud', fraudRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();  
});