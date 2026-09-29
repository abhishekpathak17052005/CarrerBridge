import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);

export default router;
