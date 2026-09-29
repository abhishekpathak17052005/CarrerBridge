import { COMETCHAT_CONFIG } from '../config/cometchat.js';
import { AiAgentService } from '../services/aiAgent.js';
import { CometChatService } from '../services/cometchat.js';
import { InterventionService } from '../services/interventionService.js';

// Message deduplication cache
const processedMessageIds = new Set();

export class WebhookController {
  /**
   * CometChat message_sent webhook handler with 4-tier infinite loop protection.
   */
  static async handleCometChatWebhook(req, res) {
    // 1. Immediate ACK as required by CometChat Webhook guidelines
    res.status(200).json({ status: 'acknowledged' });

    try {
      const { trigger, data } = req.body;
      if (trigger !== 'message_sent' || !data?.message) {
        return;
      }

      const msg = data.message;
      const aiUid = COMETCHAT_CONFIG.aiUid;

      // GUARD 1: Prevent AI responding to its own messages (INFINITE LOOP PROTECTION)
      if (msg.sender === aiUid) {
        return;
      }

      // GUARD 2: Only process standard text messages
      if (msg.category !== 'message' || msg.type !== 'text') {
        return;
      }

      // GUARD 3: Deduplication check
      if (processedMessageIds.has(msg.id)) {
        return;
      }
      processedMessageIds.add(msg.id);
      if (processedMessageIds.size > 2000) {
        processedMessageIds.clear();
      }

      // GUARD 4: Only process registered Career Rooms
      const receiver = msg.receiver;
      if (!receiver || !receiver.startsWith('career_room_')) {
        return;
      }

      console.log(`[Webhook] Processing incoming user message from ${msg.sender} in room ${receiver}: "${msg.data?.text}"`);

      // Find the associated student
      const allStudents = InterventionService.getAllStudents();
      const student = allStudents.find(s => s.activeRoomId === receiver) || allStudents[0];

      // Formulate contextual AI response
      const aiResponse = await AiAgentService.answerQuery({
        student,
        userMessage: msg.data.text
      });

      if (aiResponse) {
        if (aiResponse.actionPlan) {
          await CometChatService.sendCustomMessage({
            receiver,
            receiverType: 'group',
            subType: 'action_plan',
            customData: aiResponse.actionPlan,
            onBehalfOf: aiUid
          });
        } else {
          await CometChatService.sendTextMessage({
            receiver,
            receiverType: 'group',
            text: aiResponse.replyText,
            onBehalfOf: aiUid
          });
        }
      }
    } catch (err) {
      console.error('[WebhookController Error]', err);
    }
  }
}
