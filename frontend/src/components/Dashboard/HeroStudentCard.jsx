import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Clock, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function HeroStudentCard() {
  const { allStudents, openCareerRoom } = useApp();
  const rahul = allStudents?.find(s => s.id === 'student-rahul-sharma') || allStudents?.[0];

  if (!rahul) return null;

  return (
    <div className="hero-card">
      <div className="hero-content">
        <div className="hero-profile">
          <img
            src={rahul.avatar}
            alt={rahul.name}
            className="hero-avatar"
          />
          <div className="hero-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldAlert size={14} />
                Critical Placement Risk • Score {rahul.riskScore}
              </span>
              <span className="badge badge-signal">
                <Clock size={12} />
                Inactive 7d
              </span>
            </div>

            <h3 style={{ marginTop: '0.35rem' }}>
              {rahul.name}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ({rahul.department})
              </span>
            </h3>

            <div className="hero-role">
              Placement Target: <strong>{rahul.targetRole}</strong> • Readiness: <strong>{rahul.readinessScore}%</strong> (Target: 75%)
            </div>

            <div className="hero-signals">
              <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
                <TrendingDown size={12} /> SIEM Operations (36% vs 75% target)
              </span>
              <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
                <TrendingDown size={12} /> Incident Response Triage (42% vs 75% target)
              </span>
              <span className="badge badge-signal">
                Declining Assessment Trend (-16%)
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Placement Readiness
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--risk-high-text)', lineHeight: 1.1 }}>
              {rahul.readinessScore}%
            </div>
            <span style={{ fontSize: '0.72rem', color: '#f87171' }}>
              -27% below role benchmark
            </span>
          </div>

          <button
            className="btn-primary btn-pulse"
            style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
            onClick={() => openCareerRoom(rahul.id)}
          >
            <Sparkles size={18} />
            Open Career Room
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
