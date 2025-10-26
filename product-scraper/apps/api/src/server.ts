import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import health from './routes/health';
import analyze from './routes/analyze';
import { errorHandler, notFoundHandler } from './lib/error';
import { logger } from './lib/logger';
import { config } from '@scraper/scraper-core';

// --- START CORRECTED CORS LOGIC ---

// Define local development origins for comprehensive local testing
const localOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'];

// Define production origins:
// NOTE: For this to work in production, the FRONTEND_ORIGIN environment variable
// MUST be set on Render to your Vercel URL:
// e.g., "https://salesence.vercel.app"
const productionOrigins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0); // Filter out empty strings if the variable is not set

// Set the final list of allowed origins based on environment
const allowedOrigins = (process.env.NODE_ENV === 'production' && productionOrigins.length > 0)
    ? productionOrigins
    : localOrigins;

// --- END CORRECTED CORS LOGIC ---

const app = express();
app.use(helmet());

// Apply the dynamic CORS configuration
app.use(cors({
    origin: allowedOrigins, // Now an array of single domain strings
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'HEAD'], // Ensure necessary methods are allowed
}));

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/health', health);

// CRITICAL STEP: The actual fix for the 500 error must be inside the handler
// imported by this line (in './routes/analyze').
app.use('/analyze', analyze);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => logger.info(`API on :${config.port}`));

// CRITICAL ACTION:
// After saving this file, you must go to your Render Backend Service Dashboard
// and set the following Environment Variable:
// Key: FRONTEND_ORIGIN
// Value: https://salesence.vercel.app
