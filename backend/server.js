import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import { initializeSocket } from './src/socket/socketHandler.js';

// Routes
import authRoutes from './src/routes/auth.js';
import binRoutes from './src/routes/bins.js';
import vehicleRoutes from './src/routes/vehicles.js';
import complaintRoutes from './src/routes/complaints.js';
import educationRoutes from './src/routes/education.js';
import routeRoutes from './src/routes/routes.js';

// Load environment variables
dotenv.config({ path: '.env' });

// Initialize express app
const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

// API Rate Limiter
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/routes', routeRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Create HTTP server with Socket.IO
const httpServer = http.createServer(app);
const io = initializeSocket(httpServer);

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
httpServer.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════════════════════╗
    ║  Waste Management Backend Server Started                      ║
    ║  Environment: ${NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'}                                       ║
    ║  Port: ${PORT}                                                    ║
    ║  MongoDB: Connected                                           ║
    ║  Socket.IO: Enabled                                           ║
    ╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
