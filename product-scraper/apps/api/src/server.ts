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

// Define local development origins
const localOrigins = ['http://localhost:5173', 'http://localhost:3000'];

// Define production origins:
// Reads the comma-separated string from the environment variable (e.g., "https://site1.com,https://site2.com")
// and splits it into a proper array of strings.
const productionOrigins: string[] = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map(s => s.trim())
    : []; // Safe default: allow no origins if variable is missing

// Set the final list of allowed origins based on environment
const allowedOrigins: string[] = process.env.NODE_ENV === 'production'
    ? productionOrigins
    : localOrigins;

// --- END CORRECTED CORS LOGIC ---

const app = express();
app.use(helmet());

// Use the corrected dynamic CORS configuration
app.use(cors({
    origin: allowedOrigins, // Now an array of single domain strings in production
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'HEAD'], // Ensure necessary methods are allowed
}));

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/health', health);
app.use('/analyze', analyze);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => logger.info(`API on :${config.port}`));
