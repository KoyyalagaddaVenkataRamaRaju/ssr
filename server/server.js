import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import registrationRoutes from './routes/registration.js';

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'College Management System API',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', registrationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Use port from .env or fallback to 3000
const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
