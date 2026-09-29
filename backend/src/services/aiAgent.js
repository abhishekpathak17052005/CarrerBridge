import { ENV } from '../config/env.js';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

async function callGemini(prompt) {
  if (!ENV.GEMINI_API_KEY) return null;
  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    console.error('[Gemini] Error calling API:', e.message);
    return null;
  }
}

export class AiAgentService {
  /**
   * Generates a structured Student Career Brief for placement officers and the room.
   */
  static generateCareerBrief(student, evaluation) {
    const criticalGaps = student.competencyGaps || [];
    const recommendedDays = 7;
    const focusArea = criticalGaps.slice(0, 2).join(' + ') || 'Core Competency';

    return {
      title: 'CAREER INTERVENTION BRIEF',
      studentId: student.id,
      studentName: student.name,
      targetRole: student.targetRole,
      department: student.department,
      readinessScore: student.readinessScore,
      riskLevel: evaluation.level,
      riskScore: evaluation.score,
      criticalGaps: criticalGaps,
      recentTrend: student.activityTrend,
      recentScores: student.recentAssessmentScores,
      primarySignals: evaluation.signals.slice(0, 3),
      recommendedIntervention: `${recommendedDays}-Day ${focusArea} Recovery Plan`,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generates a warm, empathetic opening nudge directed at the student.
   */
  static generateOpeningNudge(student, evaluation) {
    const gaps = student.competencyGaps.slice(0, 2).join(' and ');
    return `Hello ${student.name.split(' ')[0]}, I've joined this Career Room alongside your Placement Officer. Based on your recent assessments for the ${student.targetRole} track, your readiness is currently at ${student.readinessScore}%, with key gaps in ${gaps}. We've opened this room to help you bridge these gaps before campus placement drives begin. I have prepared a structured recovery roadmap for you.`;
  }

  /**
   * Generates a structured 7-Day Recovery Plan tailored to the student's gaps.
   */
  static generate7DayRecoveryPlan(student) {
    const isSoc = student.targetRole.toLowerCase().includes('soc') || student.targetRole.toLowerCase().includes('security');

    if (isSoc) {
      return {
        planId: `plan_${student.id}_${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        targetRole: student.targetRole,
        title: '7-Day SIEM & Incident Response Recovery Plan',
        durationDays: 7,
        status: 'PROPOSED',
        createdAt: new Date().toISOString(),
        milestones: [
          { day: 1, title: 'SIEM Architecture & Ingestion', focus: 'Splunk forwarders, indexers, search syntax (SPL), and field extractions' },
          { day: 2, title: 'Log Analysis & Triage', focus: 'Windows Event logs (4624, 4625), Syslog parsing, alert threshold tuning' },
          { day: 3, title: 'Detection Rule Engineering', focus: 'Correlation rules, brute-force detection, privilege escalation signatures' },
          { day: 4, title: 'Threat Investigation', focus: 'MITRE ATT&CK framework mapping, IOC extraction from network traffic' },
          { day: 5, title: 'Incident Response Playbooks', focus: 'NIST 800-61 containment, eradication, and remediation workflows' },
          { day: 6, title: 'Hands-on SOC Simulation', focus: 'Real-world lab scenario: Investigating simulated credential-stuffing attack' },
          { day: 7, title: 'Mock Assessment & Officer Review', focus: 'Timed SOC competency quiz & readiness sign-off with Placement Officer' }
        ]
      };
    }

    const skill1 = student.competencyGaps[0] || 'Core Architecture';
    const skill2 = student.competencyGaps[1] || 'Hands-on Labs';

    return {
      planId: `plan_${student.id}_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      targetRole: student.targetRole,
      title: `7-Day ${student.targetRole} Competency Recovery Plan`,
      durationDays: 7,
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
      milestones: [
        { day: 1, title: `${skill1} Foundations`, focus: 'Core conceptual review and benchmark alignment' },
        { day: 2, title: 'Targeted Problem Sets', focus: 'Guided problem solving and syntax fundamentals' },
        { day: 3, title: `${skill2} Fundamentals`, focus: 'Deep dive into practical implementations and scenarios' },
        { day: 4, title: 'Integration & Edge Cases', focus: 'Common placement interview question walkthroughs' },
        { day: 5, title: 'Hands-on Project Challenge', focus: 'Building a portfolio-grade practical assessment' },
        { day: 6, title: 'Code/Design Review', focus: 'Refactoring, performance optimization, best practices' },
        { day: 7, title: 'Readiness Evaluation', focus: 'Mock technical assessment and officer verification' }
      ]
    };
  }

  /**
   * Responds contextually to messages in the Career Room using Gemini when available.
   */
  static async answerQuery({ student, userMessage }) {
    const text = userMessage.toLowerCase();

    // Always generate plan if asking for one
    if (text.includes('plan') || text.includes('recovery') || text.includes('schedule') || text.includes('roadmap') || text.includes('siem') || text.includes('help me')) {
      const plan = this.generate7DayRecoveryPlan(student);

      // Try Gemini for personalized introduction text
      let replyText = null;
      if (ENV.GEMINI_API_KEY) {
        const prompt = `You are CareerBridge AI, an empathetic and professional placement co-pilot inside a Career Room chat. 
A student named ${student.name} is targeting the role of "${student.targetRole}" and currently has ${student.readinessScore}% placement readiness.
Their key skill gaps are: ${student.competencyGaps.join(', ')}.
The user just asked: "${userMessage}"
Write a warm, professional 2-sentence response that introduces the 7-day recovery plan you just generated. Be specific to their gaps. Do NOT use markdown formatting.`;
        replyText = await callGemini(prompt);
      }

      return {
        replyText: replyText || `I have generated your customized 7-Day Recovery Plan focused on ${student.targetRole} placement readiness. Please review the roadmap below and click "Accept 7-Day Plan" to activate tracking.`,
        actionPlan: plan
      };
    }

    if (text.includes('readiness') || text.includes('score') || text.includes('why') || text.includes('percentage')) {
      let replyText = null;
      if (ENV.GEMINI_API_KEY) {
        const prompt = `You are CareerBridge AI, an empathetic placement co-pilot.
A student named ${student.name} is targeting "${student.targetRole}" and has ${student.readinessScore}% placement readiness.
Their critical gaps are: ${student.competencyGaps.join(', ')}.
Recent assessment scores: ${student.recentAssessmentScores?.join('%, ')}%.
The user asked: "${userMessage}"
Respond in 2-3 sentences, explaining their readiness score and what needs to improve. Be specific, professional, and encouraging. No markdown.`;
        replyText = await callGemini(prompt);
      }
      return {
        replyText: replyText || `Your current placement readiness is ${student.readinessScore}%. Our analysis shows that bridging ${student.competencyGaps.join(' and ')} will raise your readiness score past the 75% target benchmark for ${student.targetRole} hiring drives.`,
        actionPlan: null
      };
    }

    // General query — use Gemini for contextual response
    let replyText = null;
    if (ENV.GEMINI_API_KEY) {
      const prompt = `You are CareerBridge AI, an empathetic and professional placement co-pilot in a Career Room chat.
Student: ${student.name} | Target Role: ${student.targetRole} | Readiness: ${student.readinessScore}%
Key gaps: ${student.competencyGaps.join(', ')}
The user just said: "${userMessage}"
Write a helpful, warm, professional 2-3 sentence response. Stay focused on placement preparation and career coaching. No markdown.`;
      replyText = await callGemini(prompt);
    }

    return {
      replyText: replyText || `I am actively monitoring this Career Room. Officer Sharma and I are here to guide your recovery. Would you like me to present the 7-day action plan for your critical competencies?`,
      actionPlan: null
    };
  }
}
