import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { COMETCHAT_CONFIG } from './config/cometchat.js';
import { CometChatService } from './services/cometchat.js';
import studentsRouter from './routes/students.js';
import interventionsRouter from './routes/interventions.js';
import cometchatRouter from './routes/cometchat.js';
import { WebhookController } from './controllers/webhookController.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/interventions', interventionsRouter);
app.use('/api/cometchat', cometchatRouter);
app.post('/api/webhooks/cometchat', WebhookController.handleCometChatWebhook);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CareerBridge Backend',
    version: '1.0.0',
    cometchatConfigured: COMETCHAT_CONFIG.isConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Startup and pre-provisioning
const PORT = ENV.PORT;
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 CareerBridge Backend active on port ${PORT}`);
  console.log(`   Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`   CometChat Configured: ${COMETCHAT_CONFIG.isConfigured() ? 'YES (Live API Mode)' : 'MOCK/DEMO MODE (Ready for testing)'}`);
  console.log('====================================================');

  if (COMETCHAT_CONFIG.isConfigured()) {
    try {
      console.log('[Startup] Provisioning CareerBridge AI agent in CometChat...');
      await CometChatService.provisionAiUser();
      console.log('[Startup] CareerBridge AI agent verified in CometChat.');
    } catch (e) {
      console.warn('[Startup] Note on provisioning AI user:', e.message);
    }
  }
});
