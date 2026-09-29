const API_BASE = 'http://localhost:5000/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  },

  async getStudents() {
    const res = await fetch(`${API_BASE}/students`);
    return await res.json();
  },

  async getStudent(id) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    return await res.json();
  },

  async createCareerRoom(studentId, officerUid = 'officer-sharma') {
    const res = await fetch(`${API_BASE}/interventions/${studentId}/create-room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerUid })
    });
    return await res.json();
  },

  async requestPlan(studentId, roomId) {
    const res = await fetch(`${API_BASE}/interventions/${studentId}/request-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId })
    });
    return await res.json();
  },

  async acceptPlan(studentId, planId, roomId) {
    const res = await fetch(`${API_BASE}/interventions/${studentId}/accept-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, roomId })
    });
    return await res.json();
  },

  async getRoomMessages(roomId) {
    const res = await fetch(`${API_BASE}/interventions/rooms/${roomId}/messages`);
    return await res.json();
  },

  async postMessage(roomId, data) {
    const res = await fetch(`${API_BASE}/interventions/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getCometChatConfig() {
    const res = await fetch(`${API_BASE}/cometchat/config`);
    return await res.json();
  },

  async getAuthToken(uid) {
    const res = await fetch(`${API_BASE}/cometchat/auth-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid })
    });
    return await res.json();
  }
};
