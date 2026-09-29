import React, { useEffect, useRef } from 'react';
import { Sparkles, Shield, User, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { StudentCareerBriefCard } from '../CustomCards/StudentCareerBriefCard.jsx';
import { ActionPlanCard } from '../CustomCards/ActionPlanCard.jsx';

const AI_AVATAR = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
const OFFICER_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';

function TimeStamp({ sentAt }) {
  if (!sentAt) return <span style={{ marginLeft: 'auto' }}>just now</span>;
  return (
    <span style={{ marginLeft: 'auto' }}>
      {new Date(sentAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

export function MessageList() {
  const { roomMessages, role, selectedStudent, aiTyping } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages, aiTyping]);

  const currentUid = role === 'officer' ? 'officer-sharma' : selectedStudent?.id;

  if (!roomMessages?.length && !aiTyping) {
    return (
      <div className="messages-viewport">
        <div className="empty-state" style={{ flex: 1 }}>
          <Sparkles size={40} color="var(--accent-indigo)" />
          <h3>Career Room Active</h3>
          <p>CareerBridge AI is preparing the intervention brief. Messages will appear here.</p>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="messages-viewport">
      {roomMessages?.map((msg, index) => {
        const isAI     = msg.sender === 'careerbridge-ai';
        const isOfficer = msg.sender === 'officer-sharma' || msg.senderName === 'Officer Sharma';
        const isMe     = msg.sender === currentUid;

        const isCustomBrief = (msg.type === 'career_brief' || msg.category === 'custom') && msg.data?.customData?.criticalGaps;
        const isCustomPlan  = (msg.type === 'action_plan'  || msg.category === 'custom') && msg.data?.customData?.milestones;

        // Determine avatar
        const avatar = isAI
          ? AI_AVATAR
          : isOfficer
          ? OFFICER_AVATAR
          : selectedStudent?.avatar || AI_AVATAR;

        const senderLabel = isAI
          ? 'CareerBridge AI'
          : isOfficer
          ? 'Officer Sharma'
          : (msg.senderName || selectedStudent?.name || 'Student');

        const rowClass = `message-row ${isMe ? 'me' : isAI ? 'ai' : 'other'}`;

        return (
          <div key={msg.id || index} className={rowClass}>
            <img src={avatar} alt={senderLabel} className="msg-avatar" />

            <div className="msg-bubble">
              <div className="msg-header">
                <span className="msg-sender">{senderLabel}</span>
                {isAI && <Sparkles size={11} color="#a5b4fc" />}
                {isOfficer && !isAI && <Shield size={11} color="var(--accent-blue)" />}
                <TimeStamp sentAt={msg.sentAt} />
              </div>

              {/* Custom: Student Career Brief */}
              {isCustomBrief && <StudentCareerBriefCard brief={msg.data.customData} />}

              {/* Custom: 7-Day Recovery Plan */}
              {isCustomPlan && <ActionPlanCard plan={msg.data.customData} />}

              {/* Standard text */}
              {msg.data?.text && !isCustomBrief && !isCustomPlan && (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {msg.data.text}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* AI Typing Indicator */}
      {aiTyping && (
        <div className="message-row ai">
          <img src={AI_AVATAR} alt="CareerBridge AI" className="msg-avatar" />
          <div className="msg-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.05rem' }}>
            <Sparkles size={14} color="#a5b4fc" />
            <span style={{ fontSize: '0.8rem', color: '#c7d2fe', fontStyle: 'italic', marginRight: '0.5rem' }}>
              CareerBridge AI is analyzing
            </span>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
