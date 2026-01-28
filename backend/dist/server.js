import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { testConnections } from '@/config/database';
import { apiLimiter } from '@/middleware/rateLimiter';
import { errorHandler, notFound } from '@/middleware/errorHandler';
// Import routes (to be created)
// import authRoutes from '@/routes/auth';
// import userRoutes from '@/routes/user';
// import doctorRoutes from '@/routes/doctor';
// import adminRoutes from '@/routes/admin';
// import appointmentRoutes from '@/routes/appointment';
const app = express();
const PORT = process.env.PORT || 4000;
// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'", "https:"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL, process.env.ADMIN_URL]
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting
app.use('/api/', apiLimiter);
// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbConnected = await testConnections();
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version || '2.0.0',
            services: {
                database: dbConnected ? 'healthy' : 'unhealthy',
                api: 'healthy'
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed'
        });
    }
});
// API routes
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Fixapp API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});
// Mount route handlers
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/doctor', doctorRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/appointments', appointmentRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);
// Start server
const startServer = async () => {
    try {
        // Test database connections
        const dbConnected = await testConnections();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        app.listen(PORT, () => {
            console.log(`
🚀 Fixapp Backend Server Started Successfully!

Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
API Docs: http://localhost:${PORT}/api
Health: http://localhost:${PORT}/health

Database: ✅ Connected
Redis: ✅ Connected
Security: ✅ Enabled (Helmet, CORS, Rate Limiting)

Ready to serve healthcare appointments! 🏥
      `);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🔄 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
startServer();
export default app;
//# sourceMappingURL=server.js.map