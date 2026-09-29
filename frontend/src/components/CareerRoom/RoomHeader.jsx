import React from 'react';
import { ArrowLeft, Video, Sparkles, User, Shield, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function RoomHeader() {
  const { activeRoom, selectedStudent, closeRoom, aiOperationalState, role } = useApp();

  return (
    <div className="room-topbar">
      {/* Left: Back + Room Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
        <button className="btn-back" onClick={closeRoom}>
          <ArrowLeft size={14} />
          Dashboard
        </button>

        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.55rem', whiteSpace: 'nowrap' }}>
            <span style={{ background: 'linear-gradient(90deg,#a5b4fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {activeRoom?.roomName || `Career Room: ${selectedStudent?.name}`}
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Private • 3 Members</span>
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            CometChat Real-Time Infrastructure • Intervention Workspace
          </p>
        </div>
      </div>

      {/* Right: Participants + AI State + Call */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Participants */}
        <div className="room-participants">
          <div className="participant-chip">
            <div className="online-dot" />
            <User size={12} color="var(--accent-cyan)" />
            <span>{selectedStudent?.name?.split(' ')[0] || 'Student'}</span>
          </div>

          <div className="participant-chip">
            <div className="online-dot" />
            <Shield size={12} color="var(--accent-blue)" />
            <span>Officer Sharma</span>
          </div>

          <div className="participant-chip ai-chip">
            <div className="online-dot" />
            <Sparkles size={12} color="#a5b4fc" />
            <span style={{ color: '#c7d2fe' }}>CareerBridge AI</span>
          </div>
        </div>

        {/* AI Operational State */}
        <div className="ai-status-pill">
          <Zap size={12} />
          <span>{aiOperationalState}</span>
        </div>

        {/* Video Call Button */}
        <button
          className="btn-primary"
          style={{
            padding: '0.45rem 0.9rem', fontSize: '0.76rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'none'
          }}
          onClick={() => alert(`[CometChat Calls SDK] Initiating video session with ${selectedStudent?.name}...`)}
        >
          <Video size={13} />
          Video Call
        </button>
      </div>
    </div>
  );
}
