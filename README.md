# CareerBridge
> **"AI-powered placement intervention before students fall behind."**  
> *Built for the Zero to Chat: CometChat Hackathon*

---

## 🎯 Executive Summary & The Problem

College placement offices manage hundreds of graduating candidates concurrently. Placement officers cannot manually identify every student quietly falling behind until campus recruitment drives begin and rejection rates spike.

**CareerBridge** transforms passive campus recruitment into an **active, AI-driven placement intervention system**:
1. **Explainable AI Risk Engine**: Continuously evaluates student readiness signals against target hiring benchmarks (readiness gap, competency decay, inactivity, assessment trends).
2. **Dedicated Career Rooms (Powered by CometChat)**: When a placement officer identifies a high-risk candidate, they launch a private 3-way intervention room with the **Student**, the **Placement Officer**, and **CareerBridge AI**.
3. **Automated Student Career Brief**: The AI agent immediately injects a structured placement brief and empathetic nudge into the CometChat channel.
4. **Interactive 7-Day Recovery Plan**: The AI generates a customized day-by-day remediation roadmap that the student can accept with a single click, locking in accountability and live progress tracking.

---

## 🏗️ Architecture: Separation of Concerns

```
┌────────────────────────────────────────────────────────┐
│             CAREERBRIDGE (The Intelligence)            │
├────────────────────────────────────────────────────────┤
│ • Placement Signal Aggregation (Assessments & Trends)  │
│ • Transparent Risk Scoring Engine (0-100 & Explainable)│
│ • Student Career Brief Generator                       │
│ • AI Career Agent Persona (careerbridge-ai)            │
│ • 7-Day Recovery Plan Synthesizer & Milestone Tracker  │
│ • Placement Officer Roster & Intervention Dashboard    │
└──────────────────────────┬─────────────────────────────┘
                           │ Orchestration & Events
                           ▼
┌────────────────────────────────────────────────────────┐
│             COMETCHAT (The Real-Time Comms)            │
├────────────────────────────────────────────────────────┤
│ • Real-time WebSocket Messaging (1-to-1 & Groups)      │
│ • Private Group Career Rooms (Student + Officer + AI)  │
│ • User Presence & Online Status Indicators             │
│ • Real-time Typing Indicators                          │
│ • Custom Message Dispatch (Brief Cards & Plan Cards)   │
│ • WebRTC Audio/Video Calling Signaling & Media         │
└────────────────────────────────────────────────────────┘
```

---

## 🧑‍💻 Hero Student Profile: Rahul Sharma

* **Target Role**: SOC Analyst (Target Benchmark: 75% Readiness)
* **Current Readiness**: 48% (Critical Gap: -27%)
* **Risk Score**: 98 (HIGH RISK)
* **Trend**: Declining (-16% across recent evaluations: 64% → 56% → 48%)
* **Inactivity**: 7 days since last platform activity
* **Critical Competency Gaps**:
  - *SIEM Operations (Splunk / ELK)*: 36%
  - *Incident Response Playbooks*: 42%
  - *Threat Detection Alert Triage*: 48%

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ (tested on Node.js v20)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*  
*(Optional: set your `COMETCHAT_APP_ID`, `COMETCHAT_REGION`, and `COMETCHAT_API_KEY` in `backend/.env` for live dashboard API keys. If blank, CareerBridge seamlessly operates in local high-fidelity demo mode!)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## ⏱️ The 90-Second Hackathon Demo Script

| Timestamp | Screen | Action & Voiceover |
|---|---|---|
| **0:00 - 0:15** | **Officer Dashboard** | *"This is CareerBridge. Our placement dashboard monitors 30 final-year students. Notice Rahul Sharma at the top—he's targeting a SOC Analyst role, but his readiness is at 48%, with SIEM dropping over 3 weeks. Instead of letting him fall through the cracks, Officer Sharma clicks 'Open Career Room'."* |
| **0:15 - 0:35** | **Career Room (CometChat)** | *"Instantly, a private 3-way CometChat channel is provisioned with Rahul, Officer Sharma, and CareerBridge AI. The AI immediately delivers a structured Student Career Brief custom card and sends a warm opening nudge."* |
| **0:35 - 0:55** | **Real-Time AI Intervention** | *"Rahul asks in chat: 'Can you prepare a recovery plan for SIEM?' CareerBridge AI responds in real time with an interactive 7-Day Recovery Plan featuring customized daily milestones from log analysis to incident triage."* |
| **0:55 - 1:15** | **Plan Acceptance** | *"Rahul clicks 'Accept 7-Day Plan'. The room status instantly turns to 'Plan Accepted & Active', and the AI posts confirmation to both the officer and student."* |
| **1:15 - 1:30** | **Role Switcher to Student View** | *"Using our demo role switcher, we switch to Student View. Rahul's portal immediately reflects the active intervention and day 1 milestones. That is CareerBridge: AI identifies who needs help, AI explains why, and CometChat enables the human intervention in real time."* |

---

## 🔐 Security Principles
- Master CometChat `API_KEY` is **held exclusively on the backend** and never exposed to the frontend bundle.
- Client SDK authenticates via scoped Auth Tokens minted server-side.
- AI messages sent via server-side REST API with `onBehalfOf: "careerbridge-ai"`.
- Webhook pipeline includes a 4-tier infinite loop protection guard (sender verification, category filtering, message deduplication, and room GUID validation).
