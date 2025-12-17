import express from 'express';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { startAlertScheduler } from './utils/alertScheduler.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vihicleRoutes.js';
import trailerRoutes from './routes/trailerRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import tireRoutes from './routes/tireRoutes.js';
import fuelRoutes from './routes/fuelRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import swaggerSpec from './config/swagger.js';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Start alert scheduler
startAlertScheduler();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trailers', trailerRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/tires', tireRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
