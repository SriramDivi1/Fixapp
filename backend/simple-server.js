import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fixapp Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Basic API endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Fixapp API is running',
    version: '2.0.0'
  });
});

// Placeholder routes
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    doctors: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        speciality: 'Cardiology',
        experience_years: 10,
        consultation_fee: 150,
        rating: 4.8,
        is_available: true
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        speciality: 'Dermatology',
        experience_years: 8,
        consultation_fee: 120,
        rating: 4.9,
        is_available: true
      }
    ]
  });
});

app.post('/api/user/register', (req, res) => {
  res.json({
    success: true,
    message: 'User registered successfully',
    token: 'demo-token'
  });
});

app.post('/api/user/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    token: 'demo-token'
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 Fixapp Backend Server Started!

Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
Health: http://localhost:${PORT}/health
API: http://localhost:${PORT}/api

Ready to serve! 🏥✨
  `);
});

export default app;