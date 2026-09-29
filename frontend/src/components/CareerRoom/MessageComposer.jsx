import React, { useState, useRef } from 'react';
import { Send, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const OFFICER_PROMPTS = [
  { label: '🗂 Generate Recovery Plan', text: 'Can you generate the 7-day SIEM recovery plan for this student?' },
  { label: '📊 Explain Risk Score', text: 'Why is this student flagged as high risk?' },
  { label: '💬 Encourage Student', text: 'Rahul, let\'s focus on SIEM lab completion by Wednesday.' },
];

const STUDENT_PROMPTS = [
  { label: '📋 Show My Plan', text: 'Can you show me my recovery plan?' },
  { label: '📈 My Readiness', text: 'Why is my readiness score so low?' },
  { label: '🆘 I need help', text: 'I need help with SIEM Operations — where do I start?' },
];

export function MessageComposer() {
  const { sendMessage, role, selectedStudent, aiTyping } = useApp();
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const currentName = role === 'officer' ? 'Officer Sharma' : selectedStudent?.name?.split(' ')[0] || 'Student';
  const prompts = role === 'officer' ? OFFICER_PROMPTS : STUDENT_PROMPTS;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || aiTyping) return;
    sendMessage(trimmed);
    setText('');
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function sendQuickPrompt(promptText) {
    if (aiTyping) return;
    sendMessage(promptText);
  }

  return (
    <div style={{ background: 'rgba(9,13,23,0.97)', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Quick Prompt Chips */}
      <div style={{
        padding: '0.6rem 1.5rem',
        display: 'flex', gap: '0.45rem',
        overflowX: 'auto', flexWrap: 'nowrap',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        scrollbarWidth: 'none'
      }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap', alignSelf: 'center', marginRight: '0.25rem' }}>
          <Zap size={10} style={{ display: 'inline', marginRight: '3px' }} />
          Quick:
        </span>
        {prompts.map((p) => (
          <button
            key={p.label}
            onClick={() => sendQuickPrompt(p.text)}
            disabled={aiTyping}
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 'var(--radius-full)',
              color: aiTyping ? 'var(--text-muted)' : '#c7d2fe',
              padding: '4px 11px',
              fontSize: '0.73rem', fontWeight: 600,
              fontFamily: 'var(--font-main)',
              cursor: aiTyping ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { if (!aiTyping) e.target.style.background = 'rgba(99,102,241,0.18)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(99,102,241,0.08)'; }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Composer Input */}
      <form onSubmit={handleSubmit} className="composer-container">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={aiTyping ? 'AI is responding...' : `Message as ${currentName}...`}
          disabled={aiTyping}
          style={{ opacity: aiTyping ? 0.6 : 1 }}
        />
        <button type="submit" className="btn-send" disabled={!text.trim() || aiTyping}>
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
