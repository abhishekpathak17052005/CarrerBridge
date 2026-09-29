import React from 'react';
import { Calendar, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function ActionPlanCard({ plan }) {
  const { acceptPlan, selectedStudent, role } = useApp();
  if (!plan) return null;

  const isAccepted = plan.status === 'ACTIVE' || selectedStudent?.interventionStatus === 'ACTIVE_INTERVENTION';

  return (
    <div className="recovery-plan-card">
      <div className="plan-header">
        <div>
          <span className="badge badge-signal" style={{ color: 'var(--primary-cyan)', borderColor: 'var(--primary-cyan)' }}>
            <Calendar size={12} />
            7-Day Structured Intervention
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.35rem' }}>
            {plan.title}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Customized for {plan.studentName || selectedStudent?.name} • Placement Track: {plan.targetRole || selectedStudent?.targetRole}
          </p>
        </div>

        <div>
          {isAccepted ? (
            <span className="badge badge-low" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} />
              Intervention Active
            </span>
          ) : (
            <span className="badge badge-med">Pending Acceptance</span>
          )}
        </div>
      </div>

      <div className="plan-milestones">
        {plan.milestones?.map((m) => (
          <div key={m.day} className="milestone-item">
            <span className="day-badge">DAY 0{m.day}</span>
            <div>
              <div className="milestone-title">{m.title}</div>
              <div className="milestone-focus">{m.focus}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="plan-action-bar">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {isAccepted 
            ? '✅ Day 1 modules are unlocked in student portal.' 
            : 'Click below to accept and commit to this 7-day placement intervention.'}
        </span>

        {isAccepted ? (
          <button className="btn-accept active" disabled>
            <CheckCircle2 size={16} />
            Plan Accepted & Active
          </button>
        ) : (
          <button
            className="btn-accept"
            onClick={() => acceptPlan(plan.planId)}
          >
            Accept 7-Day Plan
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
