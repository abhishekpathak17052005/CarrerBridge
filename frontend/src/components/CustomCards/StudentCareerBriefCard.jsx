import React from 'react';
import { AlertCircle, Target, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';

export function StudentCareerBriefCard({ brief }) {
  if (!brief) return null;

  return (
    <div className="career-brief-card">
      <div className="brief-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="#818cf8" />
          <h4>{brief.title || 'CAREER INTERVENTION BRIEF'}</h4>
        </div>
        <span className="badge badge-high">Priority Intervention</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{brief.studentName}</h3>
          <p style={{ color: 'var(--primary-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
            Target: {brief.targetRole}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Readiness Score</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: brief.readinessScore < 50 ? 'var(--risk-high-text)' : 'var(--text-primary)' }}>
            {brief.readinessScore}%
          </div>
        </div>
      </div>

      <div className="brief-grid">
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
            Critical Skill Gaps
          </span>
          <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {brief.criticalGaps?.map((gap, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f87171' }}>
                <AlertCircle size={13} />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
            Primary Signals
          </span>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {brief.primarySignals?.map((sig, idx) => (
              <div key={idx} className="brief-signal-item">
                <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>•</span>
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: 700 }}>
            Recommended Intervention
          </span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
            {brief.recommendedIntervention}
          </div>
        </div>
        <Target size={20} color="#818cf8" />
      </div>
    </div>
  );
}
