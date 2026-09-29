import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RiskEngine } from './riskEngine.js';
import { CometChatService } from './cometchat.js';
import { AiAgentService } from './aiAgent.js';
import { COMETCHAT_CONFIG } from '../config/cometchat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, '../data/students.json');

// Local in-memory cache of students to support live updates
let studentsCache = [];
// Room message history for mock/fallback mode
const roomMessagesCache = new Map();

function loadStudents() {
  if (studentsCache.length === 0) {
    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf8');
      studentsCache = JSON.parse(raw);
    } catch (e) {
      console.error('Error reading students.json:', e);
      studentsCache = [];
    }
  }
  return studentsCache;
}

export class InterventionService {
  /**
   * Retrieves all students ranked by intervention risk.
   */
  static getAllStudents() {
    const list = loadStudents();
    return list.map(student => {
      const evaluation = RiskEngine.evaluateStudent(student);
      return {
        ...student,
        riskScore: evaluation.score,
        riskLevel: evaluation.level,
        signals: evaluation.signals,
        riskBreakdown: evaluation.breakdown
      };
    }).sort((a, b) => b.riskScore - a.riskScore); // Highest risk first
  }

  /**
   * Retrieves a single student with full evaluation details.
   */
  static getStudentById(id) {
    const list = loadStudents();
    const student = list.find(s => s.id === id);
    if (!student) return null;

    const evaluation = RiskEngine.evaluateStudent(student);
    return {
      ...student,
      riskScore: evaluation.score,
      riskLevel: evaluation.level,
      signals: evaluation.signals,
      riskBreakdown: evaluation.breakdown
    };
  }

  /**
   * Creates a Career Room in CometChat and orchestrates the AI intervention.
   */
  static async createCareerRoom(studentId, officerUid = COMETCHAT_CONFIG.officerUid) {
    const student = this.getStudentById(studentId);
    if (!student) {
      throw new Error(`Student ${studentId} not found`);
    }

    const cleanId = student.id.replace('student-', '').replace(/[^a-zA-Z0-9_]/g, '_');
    const roomId = `career_room_${cleanId}`;
    const aiUid = COMETCHAT_CONFIG.aiUid;

    console.log(`[InterventionService] Creating Career Room: ${roomId} for ${student.name}`);

    // Step 1: Create private CometChat group
    await CometChatService.createGroup({
      guid: roomId,
      name: `Career Room: ${student.name}`,
      type: 'private',
      description: `Target: ${student.targetRole} | Readiness: ${student.readinessScore}%`,
      icon: student.avatar
    });

    // Step 2: Add participants (student, officer, AI agent)
    await CometChatService.addGroupMembers(roomId, {
      participants: [student.id],
      moderators: [aiUid],
      admins: [officerUid]
    });

    // Step 3: AI prepares the Student Career Brief
    const evaluation = RiskEngine.evaluateStudent(student);
    const brief = AiAgentService.generateCareerBrief(student, evaluation);

    // Step 4: AI sends Student Career Brief as custom message
    const briefMessage = await CometChatService.sendCustomMessage({
      receiver: roomId,
      receiverType: 'group',
      subType: 'career_brief',
      customData: brief,
      onBehalfOf: aiUid
    });

    // Step 5: AI sends personalized opening nudge
    const nudgeText = AiAgentService.generateOpeningNudge(student, evaluation);
    const nudgeMessage = await CometChatService.sendTextMessage({
      receiver: roomId,
      receiverType: 'group',
      text: nudgeText,
      onBehalfOf: aiUid
    });

    // Pre-generate proposed 7-day recovery plan for quick activation
    const proposedPlan = AiAgentService.generate7DayRecoveryPlan(student);

    // Update in-memory state
    const cachedStudent = studentsCache.find(s => s.id === studentId);
    if (cachedStudent) {
      cachedStudent.activeRoomId = roomId;
      cachedStudent.interventionStatus = 'ROOM_OPENED';
      cachedStudent.activePlan = proposedPlan;
    }

    // Initialize room message store
    if (!roomMessagesCache.has(roomId)) {
      roomMessagesCache.set(roomId, []);
    }
    const history = roomMessagesCache.get(roomId);
    history.push(briefMessage.data || briefMessage);
    history.push(nudgeMessage.data || nudgeMessage);

    return {
      success: true,
      roomId,
      roomName: `Career Room: ${student.name}`,
      student: this.getStudentById(studentId),
      brief,
      nudge: nudgeText,
      proposedPlan,
      members: [
        { uid: student.id, name: student.name, role: 'student', avatar: student.avatar },
        { uid: officerUid, name: 'Officer Sharma', role: 'officer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
        { uid: aiUid, name: 'CareerBridge AI', role: 'ai_agent', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80' }
      ]
    };
  }

  /**
   * Generates or retrieves the 7-day recovery plan and sends it into the room.
   */
  static async requestPlan(studentId, roomId) {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');

    const plan = AiAgentService.generate7DayRecoveryPlan(student);
    const aiUid = COMETCHAT_CONFIG.aiUid;

    const planMessage = await CometChatService.sendCustomMessage({
      receiver: roomId,
      receiverType: 'group',
      subType: 'action_plan',
      customData: plan,
      onBehalfOf: aiUid
    });

    // Save in room cache
    if (!roomMessagesCache.has(roomId)) roomMessagesCache.set(roomId, []);
    roomMessagesCache.get(roomId).push(planMessage.data || planMessage);

    return { success: true, plan, planMessage };
  }

  /**
   * Accepts the 7-day recovery plan and records the intervention as ACTIVE.
   */
  static async acceptPlan(studentId, planId, roomId) {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Student not found');

    const cachedStudent = studentsCache.find(s => s.id === studentId);
    if (cachedStudent) {
      cachedStudent.interventionStatus = 'ACTIVE_INTERVENTION';
      if (cachedStudent.activePlan) {
        cachedStudent.activePlan.status = 'ACTIVE';
        cachedStudent.activePlan.acceptedAt = new Date().toISOString();
      }
    }

    const aiUid = COMETCHAT_CONFIG.aiUid;
    const confirmationText = `✅ Recovery Plan Confirmed: Rahul has accepted the 7-Day SIEM & Incident Response Recovery Plan. Day 1 milestones are now active. Officer Sharma has been notified.`;

    const confirmationMessage = await CometChatService.sendTextMessage({
      receiver: roomId,
      receiverType: 'group',
      text: confirmationText,
      onBehalfOf: aiUid
    });

    if (roomId && roomMessagesCache.has(roomId)) {
      roomMessagesCache.get(roomId).push(confirmationMessage.data || confirmationMessage);
    }

    return {
      success: true,
      student: this.getStudentById(studentId),
      confirmationMessage
    };
  }

  /**
   * Helper to retrieve room messages for fallback/mock support.
   */
  static getRoomMessages(roomId) {
    return roomMessagesCache.get(roomId) || [];
  }

  /**
   * Appends a message to the room (used by student or officer).
   */
  static async postMessage({ roomId, senderUid, text, senderName, senderAvatar }) {
    const aiUid = COMETCHAT_CONFIG.aiUid;

    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: `group_${roomId}`,
      receiver: roomId,
      receiverType: 'group',
      category: 'message',
      type: 'text',
      data: { text },
      sender: senderUid,
      senderName,
      senderAvatar,
      sentAt: Math.floor(Date.now() / 1000)
    };

    if (!roomMessagesCache.has(roomId)) roomMessagesCache.set(roomId, []);
    roomMessagesCache.get(roomId).push(msg);

    // If CometChat is configured, also post to real CometChat REST
    if (COMETCHAT_CONFIG.isConfigured()) {
      await CometChatService.sendTextMessage({
        receiver: roomId,
        receiverType: 'group',
        text,
        onBehalfOf: senderUid
      });
    }

    // If student or officer asks AI or mentions plan, trigger AI response
    const student = studentsCache.find(s => s.activeRoomId === roomId) || studentsCache[0];
    const aiEvaluation = await AiAgentService.answerQuery({ student, userMessage: text });

    if (aiEvaluation) {
      setTimeout(async () => {
        const aiMsg = {
          id: `ai_msg_${Date.now()}`,
          conversationId: `group_${roomId}`,
          receiver: roomId,
          receiverType: 'group',
          category: aiEvaluation.actionPlan ? 'custom' : 'message',
          type: aiEvaluation.actionPlan ? 'action_plan' : 'text',
          data: aiEvaluation.actionPlan ? { customData: aiEvaluation.actionPlan, text: aiEvaluation.replyText } : { text: aiEvaluation.replyText },
          sender: aiUid,
          senderName: 'CareerBridge AI',
          senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          sentAt: Math.floor(Date.now() / 1000)
        };
        roomMessagesCache.get(roomId).push(aiMsg);

        if (COMETCHAT_CONFIG.isConfigured()) {
          if (aiEvaluation.actionPlan) {
            await CometChatService.sendCustomMessage({
              receiver: roomId,
              subType: 'action_plan',
              customData: aiEvaluation.actionPlan,
              onBehalfOf: aiUid
            });
          } else {
            await CometChatService.sendTextMessage({
              receiver: roomId,
              text: aiEvaluation.replyText,
              onBehalfOf: aiUid
            });
          }
        }
      }, 700);
    }

    return msg;
  }
}
