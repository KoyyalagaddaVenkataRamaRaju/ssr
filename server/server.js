import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import DB connection and routes
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import registrationRoutes from './routes/registration.js';
import departmentRoutes from './routes/department.js';
import heroCarouselRoutes from './routes/heroCarousel.js';
import subjectRoutes from './routes/subjects.js';
import teacherAllocationRoutes from './routes/teacherAllocations.js';
import timetableRoutes from './routes/timetablepage.js';
import attendanceRoutes from './routes/attendance.js';




// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure upload folder exists
const heroUploadPath = path.join(__dirname, 'uploads/hero');
if (!fs.existsSync(heroUploadPath)) {
  fs.mkdirSync(heroUploadPath, { recursive: true });
  console.log('✅ Created upload folder:', heroUploadPath);
}

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'College Management System API is running!',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', registrationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/hero-carousel', heroCarouselRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/teacher-allocations', teacherAllocationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);

// 404 route for unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
