import React, { useEffect, useState } from 'react';
import { useApp } from './context/AppContext.jsx';
import { Sparkles, Briefcase, GraduationCap, Radio } from 'lucide-react';
import { MetricsOverview } from './components/Dashboard/MetricsOverview.jsx';
import { HeroStudentCard } from './components/Dashboard/HeroStudentCard.jsx';
import { StudentRiskTable } from './components/Dashboard/StudentRiskTable.jsx';
import { CareerRoomWorkspace } from './components/CareerRoom/CareerRoomWorkspace.jsx';
import { StudentPortal } from './components/StudentView/StudentPortal.jsx';
import { api } from './services/api.js';

export default function App() {
  const { role, switchRole, activeRoom, closeRoom } = useApp();
  const [liveMode, setLiveMode] = useState(false);

  // Check if backend is in live CometChat mode
  useEffect(() => {
    api.getCometChatConfig().then(cfg => {
      setLiveMode(cfg?.isConfigured === true);
    }).catch(() => {});
  }, []);

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="brand" onClick={closeRoom}>
          <div className="brand-logo">
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div className="brand-text">
            <h1>CAREERBRIDGE</h1>
            <p>AI Placement Intervention • Powered by CometChat</p>
          </div>
        </div>

        {/* Center status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {liveMode ? (
            <div className="live-badge">
              <div className="live-dot" />
              CometChat Live
            </div>
          ) : (
            <div className="live-badge" style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              <Radio size={11} />
              Demo Mode
            </div>
          )}
        </div>

        {/* Demo Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
            Demo Role:
          </span>
          <div className="role-switcher">
            <button
              className={`role-btn ${role === 'officer' ? 'active' : ''}`}
              onClick={() => switchRole('officer')}
            >
              <Briefcase size={13} />
              Placement Officer
            </button>
            <button
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => switchRole('student')}
            >
              <GraduationCap size={13} />
              Rahul Sharma
            </button>
          </div>
        </div>
      </header>

      {/* Main Application Body */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeRoom ? (
          <CareerRoomWorkspace />
        ) : role === 'officer' ? (
          <div style={{ maxWidth: '1440px', margin: '2rem auto', padding: '0 2rem', width: '100%' }}>
            <MetricsOverview />
            <HeroStudentCard />
            <StudentRiskTable />
          </div>
        ) : (
          <StudentPortal />
        )}
      </main>
    </div>
  );
}
