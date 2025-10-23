import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import health from './routes/health';
import analyze from './routes/analyze';
import { errorHandler, notFoundHandler } from './lib/error';
import { logger } from './lib/logger';
import { config } from '@scraper/scraper-core';

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com'] // Add your production domain here
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use('/health', health);
app.use('/analyze', analyze);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, ()=> logger.info(`API on :${config.port}`));
