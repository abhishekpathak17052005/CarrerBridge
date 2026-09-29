/**
 * CareerBridge Transparent Risk Engine
 * Calculates explainable placement intervention risk using weighted signals.
 */

export class RiskEngine {
  /**
   * Evaluates student data and calculates transparent risk metrics.
   * @param {Object} student 
   * @returns {{ score: number, level: 'HIGH'|'MEDIUM'|'LOW', signals: string[], breakdown: Object }}
   */
  static evaluateStudent(student) {
    const signals = [];
    const breakdown = {
      readinessGap: 0,
      competencyGaps: 0,
      trendPenalty: 0,
      inactivityPenalty: 0
    };

    // 1. Readiness Gap (Target standard is 75%)
    const targetBenchmark = 75;
    const readinessDelta = Math.max(0, targetBenchmark - student.readinessScore);
    breakdown.readinessGap = Math.min(40, Math.round(readinessDelta * 1.3));
    if (student.readinessScore < 50) {
      signals.push(`Placement readiness (${student.readinessScore}%) is critically below the ${targetBenchmark}% benchmark`);
    } else if (student.readinessScore < 70) {
      signals.push(`Placement readiness (${student.readinessScore}%) is below target threshold`);
    }

    // 2. Competency Gaps
    let gapScore = 0;
    if (student.competencies) {
      for (const [skill, data] of Object.entries(student.competencies)) {
        if (data.score < data.target) {
          const gap = data.target - data.score;
          if (gap >= 20 || data.status === 'Critical Gap') {
            gapScore += 10;
            signals.push(`${skill} proficiency (${data.score}%) is ${gap}% below role benchmark (${data.target}%)`);
          } else if (gap >= 10 || data.status === 'Needs Improvement') {
            gapScore += 6;
            signals.push(`${skill} (${data.score}%) needs improvement against target (${data.target}%)`);
          }
        }
      }
    }
    breakdown.competencyGaps = Math.min(30, gapScore);

    // 3. Assessment Trend
    if (student.recentAssessmentScores && student.recentAssessmentScores.length >= 2) {
      const scores = student.recentAssessmentScores;
      const first = scores[0];
      const last = scores[scores.length - 1];
      const trendDiff = last - first;

      if (trendDiff <= -10 || student.activityTrend === 'DECLINING') {
        const drop = Math.abs(trendDiff);
        breakdown.trendPenalty = 20;
        signals.push(`Assessment trend declining (-${drop}% across recent evaluations: ${scores.join('% → ')}%)`);
      } else if (student.activityTrend === 'STAGNANT') {
        breakdown.trendPenalty = 10;
        signals.push(`Assessment trend stagnant across recent tests (${scores.join('% → ')}%)`);
      }
    }

    // 4. Inactivity Penalty
    const daysInactive = student.lastActiveDays || 0;
    if (daysInactive >= 7) {
      breakdown.inactivityPenalty = 15;
      signals.push(`High learning inactivity: ${daysInactive} days since last platform activity`);
    } else if (daysInactive >= 3) {
      breakdown.inactivityPenalty = 8;
      signals.push(`Moderate learning inactivity: ${daysInactive} days without lab or practice activity`);
    }

    // Aggregate score bounded between 5 and 98
    let rawScore = breakdown.readinessGap + breakdown.competencyGaps + breakdown.trendPenalty + breakdown.inactivityPenalty;
    const finalScore = Math.min(98, Math.max(5, rawScore));

    // Determine Level
    let level = 'LOW';
    if (finalScore >= 65) {
      level = 'HIGH';
    } else if (finalScore >= 32) {
      level = 'MEDIUM';
    }

    if (signals.length === 0) {
      signals.push('All key competencies and assessments meet or exceed placement benchmarks');
    }

    return {
      score: finalScore,
      level,
      signals,
      breakdown
    };
  }
}
