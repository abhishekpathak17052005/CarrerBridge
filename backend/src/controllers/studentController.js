import { InterventionService } from '../services/interventionService.js';

export class StudentController {
  static getAllStudents(req, res) {
    try {
      const students = InterventionService.getAllStudents();
      const stats = {
        totalMonitored: students.length,
        highRiskCount: students.filter(s => s.riskLevel === 'HIGH').length,
        mediumRiskCount: students.filter(s => s.riskLevel === 'MEDIUM').length,
        lowRiskCount: students.filter(s => s.riskLevel === 'LOW').length,
        activeInterventions: students.filter(s => s.interventionStatus === 'ACTIVE_INTERVENTION' || s.interventionStatus === 'ROOM_OPENED').length,
        avgReadiness: Math.round(students.reduce((acc, s) => acc + s.readinessScore, 0) / students.length)
      };

      res.json({
        success: true,
        stats,
        students
      });
    } catch (err) {
      console.error('[StudentController.getAllStudents Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = InterventionService.getStudentById(id);
      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }
      res.json({ success: true, student });
    } catch (err) {
      console.error('[StudentController.getStudentById Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
