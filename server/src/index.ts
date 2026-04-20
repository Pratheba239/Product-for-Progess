import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import * as appInsights from 'applicationinsights';
import taskRoutes from './routes/tasks.js';
import financeRoutes from './routes/finance.js';
import groceryRoutes from './routes/groceries.js';
import moodRoutes from './routes/mood.js';
import menstrualRoutes from './routes/menstrual.js';
import documentRoutes from './routes/documents.js';
import { authenticate } from './middleware/auth.js';

// Environment variables
dotenv.config();

// Initialize Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(false)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
        .start();
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/finance', authenticate, financeRoutes);
app.use('/api/groceries', authenticate, groceryRoutes);
app.use('/api/mood', authenticate, moodRoutes);
app.use('/api/menstrual', authenticate, menstrualRoutes);
app.use('/api/documents', authenticate, documentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0' });
});

// Start Server
app.listen(port, () => {
    console.log(`PP Backend is running on port ${port}`);
});
