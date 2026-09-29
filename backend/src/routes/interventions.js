import { Router } from 'express';
import { InterventionController } from '../controllers/interventionController.js';

const router = Router();

router.post('/:studentId/create-room', InterventionController.createRoom);
router.post('/:studentId/request-plan', InterventionController.requestPlan);
router.post('/:studentId/accept-plan', InterventionController.acceptPlan);
router.get('/rooms/:roomId/messages', InterventionController.getRoomMessages);
router.post('/rooms/:roomId/messages', InterventionController.postMessage);

export default router;
