# EduTrack AI 🎓

EduTrack AI is a multi-role educational management web platform built with plain HTML5, Tailwind CSS, and vanilla JavaScript, with 100% client-side state persistence via `localStorage`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsabareesh-prog%2FEdu-track-ai)

---

## 🌟 Key Features

- **Multi-Role Portals**:
  - **Student Dashboard (`student.html`)**: Level progression, 7-day streak tracker, daily goal progress ring, upcoming deadlines, AI study suggestions, and dismissible early bird badge.
  - **Tasks & Planner (`assignments.html`)**: Filter by All / Pending / Done, create assignments with XP rewards, tap to cycle status, delete with confirmation, and overdue alerts.
  - **AI Academic Coach (`assistant.html`)**: Context-aware educational assistant with document upload analysis, study suggestions, and active course summarization.
  - **Campus Feed (`announcements.html`)**: Filterable notices (Academic / Campus) with read/unread tracking.
  - **Faculty Portal (`faculty.html`)**: Publish assignments directly to student planners (+120 XP) and broadcast campus-wide notices.
  - **Admin Directory (`admin.html`)**: Real-time user management, role filter, live search, and system permission controls.
  - **Unified Shell (`index.html`)**: Interactive device frame (Mobile, Tablet, Full screen) with seamless role switching.
  - **Authentication (`login.html`)**: Role picker (Student, Faculty, Admin), demo auto-fill, sign-up mode, and forgot password modal.

- **Offline-First & Serverless**:
  - Zero backend dependencies.
  - Persists all state across browser sessions using `localStorage`.

---

## 🚀 Deploy to Vercel

### Option 1: 1-Click Import (Recommended)
1. Visit [Vercel New Project](https://vercel.com/new).
2. Under **Import Git Repository**, choose `sabareesh-prog/Edu-track-ai`.
3. Select **Framework Preset**: `Other` (Static HTML).
4. Root Directory: `./`.
5. Click **Deploy**.

Every `git push` to `main` will automatically trigger a fresh Vercel deployment.

---

## 💻 Local Development

Run with Node.js:
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Student** | `student@edutrack.ai` | `password123` |
| **Faculty** | `faculty@edutrack.ai` | `password123` |
| **Admin** | `admin@edutrack.ai` | `password123` |
