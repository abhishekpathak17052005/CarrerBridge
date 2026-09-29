import React from 'react';
import { Target, AlertTriangle, ShieldCheck, MessageSquare, ArrowRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function StudentPortal() {
  const { selectedStudent, activeRoom, openCareerRoom } = useApp();
  const student = selectedStudent;

  if (!student) return null;

  const isRoomActive = Boolean(activeRoom || student.interventionStatus === 'ACTIVE_INTERVENTION' || student.interventionStatus === 'ROOM_OPENED');
  const isPlanActive = student.interventionStatus === 'ACTIVE_INTERVENTION';

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem', width: '100%' }}>
      {/* Student Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img
            src={student.avatar}
            alt={student.name}
            style={{ width: '76px', height: '76px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--primary-cyan)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-signal">Student Placement Portal</span>
              <span className="badge badge-high">High Intervention Need</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Welcome back, {student.name}
            </h2>
            <p style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>
              Career Track: {student.targetRole} • {student.department}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Current Placement Readiness
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-high-text)' }}>
            {student.readinessScore}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f87171' }}>
            Target Benchmark: 75%
          </span>
        </div>
      </div>

      {/* Career Room Invitation / Active Banner */}
      {isRoomActive ? (
        <div style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.95))', border: '1px solid rgba(129, 140, 248, 0.4)', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={28} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="online-dot" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Dedicated Career Room Active</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Officer Sharma and CareerBridge AI have prepared your Student Brief and personalized SIEM intervention.
              </p>
            </div>
          </div>

          <button
            className="btn-primary btn-pulse"
            style={{ padding: '0.85rem 1.75rem' }}
            onClick={() => openCareerRoom(student.id)}
          >
            <MessageSquare size={18} />
            Enter Career Room
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>No Active Career Room Yet</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Placement Officer Sharma can initiate a real-time Career Room once placement signals are reviewed.
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', boxShadow: 'none' }}
            onClick={() => openCareerRoom(student.id)}
          >
            Request Officer Intervention
          </button>
        </div>
      )}

      {/* Gaps & 7-Day Plan Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#f87171" />
            Your Competency Gaps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {student.competencyGaps?.map((gap, i) => (
              <div key={i} style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>{gap}</span>
                <span className="badge badge-high">Priority Fix</span>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#10b981" />
            Intervention Status
          </h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isPlanActive ? '#34d399' : '#fbbf24' }}>
              {isPlanActive ? '7-Day SIEM Recovery Plan Active' : 'Awaiting Room Triage'}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {isPlanActive
                ? 'Your daily milestone roadmap is active. Complete Day 1 fundamentals before Friday review.'
                : 'Join the Career Room with Officer Sharma and CareerBridge AI to review your recovery plan.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
