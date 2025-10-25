import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import health from './routes/health';
import analyze from './routes/analyze';
import { errorHandler, notFoundHandler } from './lib/error';
import { logger } from './lib/logger';
import { config } from '@scraper/scraper-core';

// Define the allowed origins.
// In production, we read the FRONTEND_ORIGIN from Render environment variables.
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_ORIGIN
    ? [process.env.FRONTEND_ORIGIN]
    : [] // If FRONTEND_ORIGIN is not set, allow no origins (safest default)
  : ['http://localhost:5173', 'http://localhost:3000']; // Local dev origins

const app = express();
app.use(helmet());

// Use the dynamic CORS configuration
app.use(cors({
  origin: allowedOrigins,
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
