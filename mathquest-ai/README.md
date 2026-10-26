# MathQuest AI 🎮📐
### Gamified Mathematics Learning Platform for Grades 5 & 6
**Aligned with Georgia's K-12 Mathematics Standards**

MathQuest AI combines mathematical modeling, procedural fluency, and interactive gamification into an adaptive learning experience for 5th and 6th-grade students.

---

## 🌟 Core Highlights

- **🎯 Georgia Standards Alignment**: Specifically mapped to Georgia Department of Education standards:
  - **Grade 5**: `5.NR.1` & `5.NR.2` (Multi-digit multiplication and division), `5.NR.3` (Fractions with unlike denominators), `5.NR.4` (Decimal place values and operations).
  - **Grade 6**: `6.NR.3` (The number system & integers), `6.NR.4` (Ratios and unit rates), `6.PAR.6` (Algebraic expressions and order of operations).
- **⚡ Real-time Adaptive Engine**: Dynamically shifts between **Apprentice (Easy)**, **Adventurer (Medium)**, and **Master (Hard)** tiers based on streak thresholds (2 consecutive correct answers level up; mistakes lower difficulty with supportive coaching).
- **📊 Interactive Visual Infographics**: Segmented visual fraction bars, proportional ratio blocks, and decimal place grids built into every lesson.
- **💡 Step-by-Step Pedagogical Feedback**: Every question reveals full mathematical explanations, worked examples, and addresses common student misconceptions.
- **🏆 Gamification & Rewards**: Streak multipliers, XP progression, audio synthesis via Web Audio API, confetti celebrations, and collectible achievement badges (*First Quest*, *Perfect Score*, *Math Explorer*, *Quest Complete*, *Rising Star*, *Hard Mode Hero*).
- **🛡️ 100% Reliable Arithmetic Generator & Validation**: Pure mathematical generators paired with Zod validation ensure questions are error-free and guaranteed to have exactly one distinct, correct answer.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + TypeScript | High-performance interactive UI |
| **Styling** | Tailwind CSS v4 | Dark mode, glassmorphism, responsive design |
| **Backend** | Node.js + Express 5 + TypeScript | RESTful API, quiz session management, scoring |
| **AI Integration** | Google Gemini API (`@google/genai`) | Lesson explanations and contextual AI assistance |
| **Question Engine** | TypeScript Arithmetic Generator | Algorithmic question generation across all topics |
| **Audio** | Web Audio API | Zero-dependency synthesizer for celebratory chimes |
| **Testing** | Vitest + Supertest | 30 unit & end-to-end integration tests |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### 2. Environment Configuration
Backend environment settings are stored in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```
*(Note: MathQuest AI features a built-in fallback knowledge base; all lessons, infographics, and quizzes function smoothly even without an API key!)*

### 3. Run Development Servers
From the root directory:
```bash
# Start backend API (Port 5000)
npm run dev:backend

# Start frontend application (Port 3000)
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the full automated test suite (30 tests covering scoring, adaptive difficulty, validation, generators, and API endpoints):
```bash
npm test
```

### Test Coverage Summary:
- **`adaptive.service.test.ts`**: Difficulty escalation, streak threshold logic, and difficulty reduction.
- **`scoring.service.test.ts`**: Points calculation, streak bonuses, session errors, and badge rules.
- **`question-validator.service.test.ts`**: Distractor uniqueness, bounds checks, and batch filtering.
- **`question-generator.service.test.ts`**: Programmatic question integrity across all Georgia topics.
- **`api.integration.test.ts`**: End-to-end HTTP integration tests for all REST endpoints and full 10-question quiz lifecycle.

---

## 📦 Production Build

```bash
# Build both frontend and backend bundles
npm run build

# Start the unified production server
npm start
```
The backend automatically hosts the compiled React frontend static assets from `frontend/dist`.
