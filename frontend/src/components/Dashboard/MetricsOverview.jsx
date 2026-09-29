import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Activity, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function MetricsOverview() {
  const { stats, allStudents } = useApp();

  const total = stats?.totalMonitored || allStudents?.length || 30;
  const highRisk = stats?.highRiskCount || allStudents?.filter(s => s.riskLevel === 'HIGH').length || 6;
  const mediumRisk = stats?.mediumRiskCount || allStudents?.filter(s => s.riskLevel === 'MEDIUM').length || 9;
  const activeInterventions = allStudents?.filter(s => s.interventionStatus === 'ACTIVE_INTERVENTION' || s.interventionStatus === 'ROOM_OPENED').length || 0;
  const avgReadiness = stats?.avgReadiness || 73;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Students Monitored</span>
          <div className="metric-icon">
            <Users size={18} />
          </div>
        </div>
        <div className="metric-value">{total}</div>
        <div className="metric-sub">Final Year Placement Cohort 2026</div>
      </div>

      <div className="metric-card" style={{ borderColor: 'var(--risk-high-border)' }}>
        <div className="metric-header">
          <span className="metric-title" style={{ color: 'var(--risk-high-text)' }}>High Risk (Urgent)</span>
          <div className="metric-icon" style={{ background: 'var(--risk-high-bg)', color: 'var(--risk-high-text)' }}>
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: 'var(--risk-high-text)' }}>{highRisk}</div>
        <div className="metric-sub">Requires Immediate Career Room</div>
      </div>

      <div className="metric-card" style={{ borderColor: 'var(--risk-med-border)' }}>
        <div className="metric-header">
          <span className="metric-title" style={{ color: 'var(--risk-med-text)' }}>Watchlist (Medium)</span>
          <div className="metric-icon" style={{ background: 'var(--risk-med-bg)', color: 'var(--risk-med-text)' }}>
            <Activity size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: 'var(--risk-med-text)' }}>{mediumRisk}</div>
        <div className="metric-sub">Monitoring & Micro-nudges</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Active Interventions</span>
          <div className="metric-icon" style={{ color: '#10b981' }}>
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="metric-value" style={{ color: '#10b981' }}>{activeInterventions}</div>
        <div className="metric-sub">Career Rooms In Progress</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Avg Readiness</span>
          <div className="metric-icon">
            <Target size={18} />
          </div>
        </div>
        <div className="metric-value">{avgReadiness}%</div>
        <div className="metric-sub">Benchmark Target: 75%</div>
      </div>
    </div>
  );
}
