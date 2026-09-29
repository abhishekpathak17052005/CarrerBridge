import React from 'react';
import { Target, TrendingDown, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function InterventionSidebar() {
  const { selectedStudent, request7DayPlan } = useApp();
  if (!selectedStudent) return null;

  const isHigh = selectedStudent.riskLevel === 'HIGH';
  const isMed  = selectedStudent.riskLevel === 'MEDIUM';
  const isPlanActive = selectedStudent.interventionStatus === 'ACTIVE_INTERVENTION';

  const readinessColor = isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981';

  return (
    <div className="room-sidebar">
      {/* Student Profile */}
      <div className="sidebar-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
          <img
            src={selectedStudent.avatar}
            alt={selectedStudent.name}
            style={{
              width: '54px', height: '54px',
              borderRadius: '12px', objectFit: 'cover',
              border: `2px solid ${readinessColor}`,
              boxShadow: `0 0 16px ${readinessColor}40`
            }}
          />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedStudent.name}
            </h3>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 600, marginTop: '1px' }}>
              {selectedStudent.targetRole}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              {selectedStudent.department}
            </p>
          </div>
        </div>

        {/* Readiness Meter */}
        <div style={{ background: 'rgba(255,255,255,0.025)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <div className="flex-between" style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Placement Readiness
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: readinessColor, lineHeight: 1 }}>
              {selectedStudent.readinessScore}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ height: '7px' }}>
            <div
              className="progress-bar-fill"
              style={{ width: `${selectedStudent.readinessScore}%`, background: readinessColor }}
            />
          </div>
          <div className="flex-between" style={{ marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Current: {selectedStudent.readinessScore}%</span>
            <span style={{ color: 'var(--accent-cyan)' }}>Target: 75%</span>
          </div>
        </div>
      </div>

      {/* Intervention Status */}
      <div className="sidebar-section" style={{ padding: '0.85rem 1.4rem' }}>
        <div className="flex-between">
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
            Intervention State
          </span>
          {isPlanActive ? (
            <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={11} />
              7-Day Plan Active
            </span>
          ) : (
            <span className="badge badge-high" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertTriangle size={11} />
              Triage Phase
            </span>
          )}
        </div>
      </div>

      {/* Competency Radar */}
      <div className="sidebar-section" style={{ flex: 1 }}>
        <div className="sidebar-section-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={12} />
            Competency Radar
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {selectedStudent.competencies &&
            Object.entries(selectedStudent.competencies).map(([skill, data]) => {
              const gap  = data.target - data.score;
              const isCrit = gap >= 20 || data.status === 'Critical Gap';
              const barColor = isCrit ? '#ef4444' : gap > 0 ? '#f59e0b' : '#10b981';

              return (
                <div key={skill}>
                  <div className="competency-bar-label">
                    <span style={{ color: isCrit ? '#f87171' : 'var(--text-primary)' }}>{skill}</span>
                    <span>{data.score}% / {data.target}%</span>
                  </div>
                  <div className="progress-bar-container" style={{ maxWidth: '100%' }}>
                    <div className="progress-bar-fill" style={{ width: `${data.score}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Assessment Trend */}
        {selectedStudent.recentAssessmentScores?.length > 0 && (
          <div style={{ marginTop: '1.1rem' }}>
            <div className="sidebar-section-title">Assessment Momentum</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.65rem',
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.2)',
              padding: '0.65rem 0.85rem', borderRadius: '8px'
            }}>
              <TrendingDown size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {selectedStudent.recentAssessmentScores.join('% → ')}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Declining trend over 3 weeks
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(9,13,24,0.98)' }}>
        {isPlanActive ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.75rem', borderRadius: '10px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            fontSize: '0.82rem', color: '#34d399', fontWeight: 600
          }}>
            <ShieldCheck size={16} />
            7-Day Recovery Plan Active
          </div>
        ) : (
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={request7DayPlan}
          >
            <Sparkles size={15} />
            Dispatch 7-Day Plan
          </button>
        )}
      </div>
    </div>
  );
}
