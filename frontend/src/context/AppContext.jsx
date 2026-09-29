import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { CometChatClient } from '../services/cometchat.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('officer'); // 'officer' or 'student'
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiOperationalState, setAiOperationalState] = useState('AI Co-Pilot Active');

  // Load students & metrics on mount
  useEffect(() => {
    fetchStudents();
    CometChatClient.init();
  }, []);

  // Real-time polling: refresh room messages every 2.5s when a room is active
  useEffect(() => {
    if (!activeRoom) return;
    const interval = setInterval(() => {
      fetchRoomMessages(activeRoom.roomId);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeRoom]);


  async function fetchStudents() {
    try {
      setLoading(true);
      const data = await api.getStudents();
      if (data.success) {
        setStudents(data.students);
        setStats(data.stats);
        // Default selected to hero student Rahul Sharma
        const hero = data.students.find(s => s.id === 'student-rahul-sharma') || data.students[0];
        setSelectedStudent(hero);
      }
    } catch (err) {
      console.error('[AppContext] Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  }

  // Opens/creates a Career Room for intervention
  async function openCareerRoom(studentId) {
    try {
      setLoading(true);
      setAiOperationalState('Synthesizing Placement Signals & Brief...');
      setAiTyping(true);

      const res = await api.createCareerRoom(studentId, 'officer-sharma');
      if (res.success) {
        setActiveRoom(res);
        setSelectedStudent(res.student);
        await fetchRoomMessages(res.roomId);
        // Refresh student list to show updated status
        await fetchStudents();
      }
    } catch (err) {
      console.error('[AppContext] Failed to open career room:', err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setAiTyping(false);
        setAiOperationalState('AI Co-Pilot Active in Room');
      }, 900);
    }
  }

  async function fetchRoomMessages(roomId) {
    try {
      const res = await api.getRoomMessages(roomId);
      if (res.success) {
        setRoomMessages(res.messages || []);
      }
    } catch (err) {
      console.error('[AppContext] Failed to fetch messages:', err);
    }
  }

  // Sends a message from the current user (Officer or Student)
  async function sendMessage(text) {
    if (!activeRoom || !text.trim()) return;

    const senderUid = role === 'officer' ? 'officer-sharma' : selectedStudent.id;
    const senderName = role === 'officer' ? 'Officer Sharma' : selectedStudent.name;
    const senderAvatar = role === 'officer' 
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      : selectedStudent.avatar;

    // Trigger AI typing indicator if user asks a question
    const lower = text.toLowerCase();
    if (lower.includes('plan') || lower.includes('siem') || lower.includes('help') || lower.includes('recovery') || lower.includes('why')) {
      setAiTyping(true);
      setAiOperationalState('Analyzing Competencies & Formulating Plan...');
    }

    try {
      await api.postMessage(activeRoom.roomId, {
        senderUid,
        text,
        senderName,
        senderAvatar
      });

      // Poll/refresh room messages after dispatch
      setTimeout(async () => {
        await fetchRoomMessages(activeRoom.roomId);
        setAiTyping(false);
        setAiOperationalState('AI Co-Pilot Active');
      }, 1000);
    } catch (err) {
      console.error('[AppContext] Failed to post message:', err);
      setAiTyping(false);
    }
  }

  // Generates 7-Day Plan
  async function request7DayPlan() {
    if (!activeRoom) return;
    setAiTyping(true);
    setAiOperationalState('Generating Tailored 7-Day Action Plan...');

    try {
      await api.requestPlan(selectedStudent.id, activeRoom.roomId);
      setTimeout(async () => {
        await fetchRoomMessages(activeRoom.roomId);
        setAiTyping(false);
        setAiOperationalState('Recovery Plan Dispatched');
      }, 900);
    } catch (err) {
      console.error('[AppContext] Failed to request plan:', err);
      setAiTyping(false);
    }
  }

  // Accepts the recovery plan
  async function acceptPlan(planId) {
    if (!activeRoom || !selectedStudent) return;

    try {
      setLoading(true);
      const res = await api.acceptPlan(selectedStudent.id, planId, activeRoom.roomId);
      if (res.success) {
        setSelectedStudent(res.student);
        await fetchRoomMessages(activeRoom.roomId);
        await fetchStudents();
      }
    } catch (err) {
      console.error('[AppContext] Failed to accept plan:', err);
    } finally {
      setLoading(false);
    }
  }

  function switchRole(newRole) {
    setRole(newRole);
  }

  function closeRoom() {
    setActiveRoom(null);
  }

  const filteredStudents = students.filter(s => {
    if (activeFilter === 'ALL') return true;
    return s.riskLevel === activeFilter;
  });

  return (
    <AppContext.Provider
      value={{
        role,
        switchRole,
        students: filteredStudents,
        allStudents: students,
        stats,
        activeFilter,
        setActiveFilter,
        selectedStudent,
        setSelectedStudent,
        activeRoom,
        roomMessages,
        openCareerRoom,
        sendMessage,
        request7DayPlan,
        acceptPlan,
        closeRoom,
        loading,
        aiTyping,
        aiOperationalState
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
