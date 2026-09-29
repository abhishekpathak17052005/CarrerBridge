import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  COMETCHAT: {
    APP_ID: process.env.COMETCHAT_APP_ID || '',
    REGION: process.env.COMETCHAT_REGION || 'us',
    API_KEY: process.env.COMETCHAT_API_KEY || '',
    AUTH_KEY: process.env.COMETCHAT_AUTH_KEY || '',
    AI_UID: process.env.CAREERBRIDGE_AI_UID || 'careerbridge-ai',
    OFFICER_UID: process.env.OFFICER_UID || 'officer-sharma'
  },
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
