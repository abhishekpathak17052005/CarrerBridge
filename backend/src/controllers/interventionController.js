import { InterventionService } from '../services/interventionService.js';
import { COMETCHAT_CONFIG } from '../config/cometchat.js';

export class InterventionController {
  /**
   * Opens/provisions a dedicated Career Room.
   */
  static async createRoom(req, res) {
    try {
      const { studentId } = req.params;
      const officerUid = req.body.officerUid || COMETCHAT_CONFIG.officerUid;

      const result = await InterventionService.createCareerRoom(studentId, officerUid);
      res.json(result);
    } catch (err) {
      console.error('[InterventionController.createRoom Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Generates and dispatches a 7-day recovery plan into the room.
   */
  static async requestPlan(req, res) {
    try {
      const { studentId } = req.params;
      const { roomId } = req.body;

      const result = await InterventionService.requestPlan(studentId, roomId);
      res.json(result);
    } catch (err) {
      console.error('[InterventionController.requestPlan Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Marks a recovery plan as ACCEPTED / ACTIVE.
   */
  static async acceptPlan(req, res) {
    try {
      const { studentId } = req.params;
      const { planId, roomId } = req.body;

      const result = await InterventionService.acceptPlan(studentId, planId, roomId);
      res.json(result);
    } catch (err) {
      console.error('[InterventionController.acceptPlan Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Retrieves messages for a room.
   */
  static getRoomMessages(req, res) {
    try {
      const { roomId } = req.params;
      const messages = InterventionService.getRoomMessages(roomId);
      res.json({ success: true, messages });
    } catch (err) {
      console.error('[InterventionController.getRoomMessages Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Posts a message into a room.
   */
  static async postMessage(req, res) {
    try {
      const { roomId } = req.params;
      const { senderUid, text, senderName, senderAvatar } = req.body;

      if (!text || !senderUid) {
        return res.status(400).json({ success: false, error: 'text and senderUid are required' });
      }

      const msg = await InterventionService.postMessage({
        roomId,
        senderUid,
        text,
        senderName,
        senderAvatar
      });

      res.json({ success: true, message: msg });
    } catch (err) {
      console.error('[InterventionController.postMessage Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
