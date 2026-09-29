import { Router } from 'express';
import { COMETCHAT_CONFIG } from '../config/cometchat.js';
import { CometChatService } from '../services/cometchat.js';
import { WebhookController } from '../controllers/webhookController.js';

const router = Router();

/**
 * Returns public configuration parameters to the client.
 * MASTER API KEY IS NEVER EXPOSED.
 */
router.get('/config', (req, res) => {
  res.json({
    appId: COMETCHAT_CONFIG.appId,
    region: COMETCHAT_CONFIG.region,
    aiUid: COMETCHAT_CONFIG.aiUid,
    officerUid: COMETCHAT_CONFIG.officerUid,
    isConfigured: COMETCHAT_CONFIG.isConfigured()
  });
});

/**
 * Generates an Auth Token for secure client SDK login.
 */
router.post('/auth-token', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'uid is required' });
    }

    const tokenRes = await CometChatService.createAuthToken(uid);
    res.json({
      success: true,
      uid,
      authToken: tokenRes.data?.authToken || `demo_token_${uid}`
    });
  } catch (err) {
    console.error('[CometChatRoute.authToken Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Webhook receiver for real-time CometChat events.
 */
router.post('/webhook', WebhookController.handleCometChatWebhook);

export default router;
