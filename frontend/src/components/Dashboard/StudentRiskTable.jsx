import React from 'react';
import { ArrowUpRight, MessageSquare, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function StudentRiskTable() {
  const { students, activeFilter, setActiveFilter, openCareerRoom } = useApp();

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2>Placement Intervention Queue</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ranked by weighted placement risk • Continuously analyzed from readiness benchmarks & assessment trends
          </p>
        </div>

        <div className="table-filters">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'ALL' ? 'All Students (30)' : `${filter} Risk`}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="students-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Target Role</th>
              <th>Readiness</th>
              <th>Risk Level</th>
              <th>Key Signal</th>
              <th>Last Active</th>
              <th style={{ textAlign: 'right' }}>Intervention</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => {
              const isHigh = student.riskLevel === 'HIGH';
              const isMed = student.riskLevel === 'MEDIUM';
              const isInterventionActive = student.interventionStatus === 'ACTIVE_INTERVENTION';
              const isRoomOpen = student.interventionStatus === 'ROOM_OPENED' || isInterventionActive;

              const primarySignal = student.signals?.[0] || 'Meeting role readiness benchmarks';

              return (
                <tr key={student.id}>
                  <td>
                    <div className="student-col">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="student-avatar-sm"
                        style={{
                          borderColor: isHigh ? 'var(--risk-high-text)' : isMed ? 'var(--risk-med-text)' : 'var(--border-subtle)'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {student.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {student.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary-cyan)' }}>
                      {student.targetRole}
                    </span>
                  </td>

                  <td>
                    <div>
                      <span style={{ fontWeight: 700 }}>{student.readinessScore}%</span>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${student.readinessScore}%`,
                            background: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low'}`}>
                      {student.riskLevel} • {student.riskScore}
                    </span>
                  </td>

                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontSize: '0.78rem', color: isHigh ? '#fca5a5' : isMed ? '#fde68a' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {isHigh && <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0 }} />}
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {primarySignal}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} />
                      {student.lastActive}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {isInterventionActive ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.45rem 0.95rem', fontSize: '0.78rem', background: '#059669' }}
                        onClick={() => openCareerRoom(student.id)}
                      >
                        <ShieldCheck size={14} />
                        Plan Active
                      </button>
                    ) : isRoomOpen ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.45rem 0.95rem', fontSize: '0.78rem', background: '#2563eb' }}
                        onClick={() => openCareerRoom(student.id)}
                      >
                        <MessageSquare size={14} />
                        Enter Room
                      </button>
                    ) : (
                      <button
                        className="btn-primary"
                        style={{
                          padding: '0.45rem 0.95rem',
                          fontSize: '0.78rem',
                          background: isHigh ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(255,255,255,0.08)',
                          color: isHigh ? '#fff' : 'var(--text-primary)',
                          boxShadow: isHigh ? '0 2px 10px rgba(220, 38, 38, 0.4)' : 'none'
                        }}
                        onClick={() => openCareerRoom(student.id)}
                      >
                        <MessageSquare size={14} />
                        Open Career Room
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
