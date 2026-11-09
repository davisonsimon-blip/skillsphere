# 🌐 SkillSphere – Learn Together, Grow Together

> *"Your Skills. Their Knowledge. Our Community."*

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SkillSphere** is an innovative, production-quality, full-stack Peer-to-Peer Learning Platform designed to make education social, interactive, accessible, and 100% cashless. Built with modern glassmorphism aesthetics inspired by platforms like Discord, Notion, Coursera, and Duolingo.

---

## 🌟 Key Features

### 1. 🤝 Smart Peer Matching Engine
- **Compatibility Algorithm:** Matches students based on complementary skills (e.g. You teach React & want Python; Partner teaches Python & wants React = 98% Match!).
- **Multi-Filter System:** Filter by category, proficiency level (Beginner to Expert), availability (Weekdays, Weekends, Evenings), and rating.
- **Peer Profile Insights:** View portfolio links, timezone, reviews count, and endorsement counts.

### 2. 🔄 Cashless Skill Barter System
- **1-to-1 Skill Swaps:** Trade your expertise for someone else's knowledge with 0 currency involved.
- **Exchange Kanban & Milestones:** Track active swaps, schedule sessions, and monitor progress bars.
- **Mutual Endorsements:** Automatic milestone logging and badge unlocking upon exchange completion.

### 3. 📹 Live Collaborative Study Room
- **Virtual Video Meeting:** Webcam toggle, microphone mute/unmute, screen-share simulation, recording status, and participant roster.
- **Interactive Live Whiteboard:** Full-featured drawing canvas with color palette, custom brush sizes, eraser, and clear controls.
- **Real-Time Code Editor:** Live code environment with language switching (Python, TypeScript, JavaScript), syntax highlighting, and simulated console execution.
- **Shared Study Notes:** Synchronized markdown note editor with export to `.md`.
- **Integrated Pomodoro Timer:** 25-minute focus sprints and 5-minute break cycles.
- **Session Chat:** Instant real-time messaging with study peers.

### 4. 💬 Community Discussion Forum
- **Q&A Ecosystem:** Ask questions with markdown and code snippets across multiple categories.
- **Accepted Solutions:** Question authors can mark answers as accepted solutions (+100 XP to the answering peer).
- **Upvoting & Bookmarking:** Save helpful solutions for later reference.
- **Community Safety:** User report workflow with direct integration to admin moderation.

### 5. 🎮 Duolingo-Inspired Gamification
- **XP Points & Levels:** 10 Levels of student mastery from *Scout Novice* to *SkillSphere Grandmaster*.
- **Daily Learning Streaks:** Daily flame counters with 1-click streak claim and celebratory confetti.
- **12+ Unlockable Achievement Badges:** *First Match, Knowledge Seeker, Master Tutor, Streak Warrior, Code Artisan, AI Scholar, Polyglot Mind*, and more.
- **Weekly Challenges:** Active community quests with progress meters and bonus XP.
- **Global Leaderboards:** Competitive ranking for Overall XP, Top Mentors, and Longest Streaks.

### 6. 🧠 SphereAI Copilot & Studio
- **Concept Explainer:** Tailor any technical or academic concept to your desired level (ELI5, Beginner, or Deep Technical).
- **Dynamic 4-Question Quiz Generator:** Interactive multiple-choice tests with instant scoring and XP rewards.
- **Personalized 4-Week Study Roadmaps:** Actionable weekly study plans with peer pairing milestones.
- **Study Material Summarizer:** Instant high-yield bullet point takeaways from lecture notes or documentation.

### 7. 🛡️ Administrator Governance Panel
- **Real-Time Analytics:** User volume, active swaps, total sessions, and weekly activity charts.
- **User Management:** Search users, suspend/activate accounts, and adjust roles (Learner, Tutor, Admin).
- **Reports Resolution Queue:** Review flagged posts, spam, or misconduct with 1-click resolve or dismiss.
- **Global Announcement Broadcast:** Publish system-wide alert banners across all student screens.

### 8. 🎨 Premium UI & Design
- **Theme Switcher:** Seamless toggle between Soft White (`#F8FAFC`) Light Mode and Deep Navy (`#101828`) Dark Mode.
- **Quick Demo Switcher:** 1-click instant login switcher in the navbar to test as:
  - **Alex Chen** (Undergrad Learner & Tutor)
  - **Dr. Maya Patel** (Senior AI Researcher / Tutor)
  - **Sarah Connor** (Platform Administrator)

---

## 🛠️ Technical Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 3.4, Lucide Icons, Canvas Confetti
- **Build Tool:** Vite 6
- **Routing:** React Router v7
- **State Management:** Reactive Context Architecture (`AuthContext`, `AppContext`, `ThemeContext`) with local persistence
- **Styling:** Custom Glassmorphism, Tailwind color extensions, micro-animations

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- Git

### 1. Clone & Install
\`\`\`bash
# Install dependencies
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser.

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## 📦 How to Push this Website to GitHub

Follow these simple steps in your terminal:

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub.com/new](https://github.com/new).
2. Enter your repository name (e.g. \`skillsphere\` or \`skillsphere-p2p\`).
3. Set visibility to **Public** (or **Private**).
4. **Do not** check "Initialize with README" (we already have a complete one).
5. Click **Create repository**.

### Step 2: Push Your Local Repository
Run these commands in PowerShell or Command Prompt:

\`\`\`bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: initial commit of SkillSphere P2P learning platform"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push to GitHub
git push -u origin main
\`\`\`

---

## 👥 Demo Personas for Evaluation

| Persona | Role | Specialty |
|---|---|---|
| **Alex Chen** | Learner & Tutor | React, TypeScript, Tailwind CSS |
| **Dr. Maya Patel** | Senior Peer Tutor | Python, Machine Learning, PyTorch |
| **Liam Vance** | Peer Tutor & Designer | Figma, UI/UX, Design Systems |
| **Sofia Rodriguez** | Bilingual Tutor | Conversational & Business Spanish |
| **Sarah Connor** | Administrator | Platform Governance & Moderation |

---

## 📄 License
This project is licensed under the MIT License.
