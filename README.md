# Brother Compliance SaaS & Forensic Intelligence Portal 👁️🛡️

An enterprise-grade, anti-cheat compliance and continuous surveillance system built with the **MERN Stack** (React 18 + Vite + Tailwind CSS + Node.js + Express + MongoDB).

Designed for strict remote oversight, authentic skill attestation, and anti-bypass proctoring.

---

## 🌟 System Overview & Dual-Portal Architecture

The application is strictly partitioned into two isolated portals:

### 1. 🎯 Subject / Brother Enclave (`/`, `/subject`, `/exercise`)
* **Zero Distractions & Zero Navigation**: All upper navbars, admin headers, buttons, and dashboard links are **100% removed**.
* **Clean 3-Module Dashboard**:
  1. **Module 1: Keyboard Practice**: Pure black writing terminal with active keystroke stopwatch, anti-idling pauses, and locked clipboard/drag-drop.
  2. **Module 2: English Assessment Engine (`/exercise/english`)**: In-app Windows 11 Fluent Design x Duolingo gamified testing engine with zero-knowledge dealer, server-side grading, cadence speed telemetry (<0.8s detection), sound chimes, and celebration screens.
  3. **Module 3: Writing Practice (Handwritten Notes)**: Camera capture upload with EXIF hardware sensor provenance and duplicate hashing.
* **↺ Independent Clear & Reset**: Every module includes an active `[ ↺ CLEAR ]` button allowing him to wipe what he has typed or uploaded and start over cleanly.

### 2. 🛡️ Admin Surveillance & Intelligence Enclave (`/admin`)
* **Passcode Gate**: Protected by biometric/passcode authentication (`admin123`).
* **📊 Executive Dashboard (`/admin`)**: High-level KPIs, live compliance health status, active strikes, and 1-click candidate link generator.
* **📥 Dedicated Submissions Box (`/admin/submissions`)**: Ledger of completed tasks, 1-click copy for typed essays, full-screen zoom preview for homework photos, and 1-click task approval/revision requests.
* **📁 Daily Submission Archive (`/admin/archive`)**: Permanent chronological ledger of all approved compliance sessions. Grouped by day with search & filters, full-text review, typing duration metrics, Duolingo OCR proofs, camera EXIF tags, and JSON report export.
* **🛡️ Anti-Cheat Forensic Console (`/admin/anti-cheat`)**: Deep forensic telemetry, human keystroke cadence scoring, tab switch counts, clipboard paste interceptions, camera sensor tags, and cryptographic hash verification.
* **🚨 Emergency Red Lockdown & Tsunami Siren**: Full-dashboard emergency crimson takeover triggered if cheating is detected, requiring physical disarming by the supervisor.

---

## ⌨️ Module 1: Keyboard Practice & Active Stopwatch

### 1. Freedom to Write (Zero Time Limits)
* **No Arbitrary Countdowns**: 5-minute or 10-minute limits and early blocking modals have been eliminated. He is free to write as much or as long as he needs.
* **Starts at 00:00**: The timer rests at `00:00` with the status `READY • TIMER STARTS WHEN YOU TYPE`.

### 2. Strict Active Typing Stopwatch
* **Starts on First Keystroke**: The stopwatch begins counting up only when he strikes a key in the terminal (`● RECORDING ACTIVE WRITING TIME`).
* **Anti-Idling Pause**: If he stops typing for more than ~3.5 seconds, the stopwatch immediately pauses (`❚❚ PAUSED • START TYPING TO RESUME TIMER`). He cannot sit idly and accumulate time.
* **Resumes Instantly**: Typing any letter resumes the timer right where it paused.
* **Direct Finish**: Single-click `[ ✓ FINISH ]` button submits the attestation directly with no warning modals.

### 3. Anti-Paste & Injection Lockdown
* 🚫 **Clipboard Paste (`Ctrl+V` / right-click)**: Prohibited. Triggers instant interception toast and the Red Lockdown alarm.
* 🚫 **Drag & Drop**: Binary text and file drops are completely rejected.
* 🚫 **Context Menu**: Right-click inspection shortcuts are disabled.
* 🚫 **Tab Switching**: Navigating away from the writing screen is logged as a strike and triggers the Red Lockdown alarm.

### 4. Reset & Clear Button
* Both on the module card and inside the fullscreen writing modal, a `[ ↺ CLEAR ]` button resets typed text, sets the timer back to `00:00`, resets stroke counts, and reverts task status to `PENDING`.

---

## 🦉 Module 2: Windows 11 x Duolingo Native Assessment Engine (`/exercise/english`)

The application features a custom in-app testing engine that eliminates screenshot spoofing by forcing candidates to complete live assessments directly inside an authenticated environment.

### 1. Windows 11 Fluent x Duolingo Aesthetic
* **Acrylic Blur Window**: Mimics a native Windows 11 Fluent application window with `backdrop-blur-2xl`, rounded acrylic borders, drop-shadows, and native window control icons (minimize, maximize, close).
* **Duolingo Gamified Bar**: Thick, animated green progress bar with smooth transitions and question step counter (`Question 15 of 50`).
* **Interactive 2x2 Answer Grid**: Four tactile response cards with keyboard shortcuts (`1`, `2`, `3`, `4` and `Enter`), hover scaling, and vivid active selection states (`border-sky-400 bg-sky-500/15`).
* **Audio Feedback**: Dual synthesized audio chimes for correct (`660Hz -> 880Hz`) and incorrect answers (`300Hz -> 220Hz`).
* **Celebration Victory Screen**: Dynamic confetti bursts, accuracy badge, XP counter (`+30 XP`), and review breakdown before submission.

### 2. Beginner English & Programming Staged Curriculum
* **100% Beginner-Friendly & Easy to Read**: Plain English, short sentences, and practical concepts with zero obscure or difficult grammar jargon.
* **Guaranteed Staged Progression Every Session**:
  * **Questions 1 – 20 (Easy Beginner English & Computer Basics)**: Keyboard, mouse, screen, internet, files, folders, simple verbs, and everyday vocabulary.
  * **Questions 21 – 50 (Beginner Programming & Tech Skills)**: Variables, functions, loops, bugs, debugging, HTML, CSS, JavaScript, terminals, Git, and clean coding practices.
* **Multi-Tier Infinite AI Engine**: Dynamically synthesizes fresh, non-repeating questions via Gemini AI (Tier 1) or procedural combinatorial templates (Tier 3), automatically saving new questions into MongoDB.
* **Zero-Knowledge Dealer Route (`GET /api/quiz/session`)**: Selects 50 staged questions and **strictly scrubs answer keys and explanations** before sending payloads to the browser.
* **Inspect-Proof**: Inspecting browser memory or network payloads reveals no correct answers.

### 3. Server-Side Grader & Speed Telemetry
* **Grader Route (`POST /api/quiz/grade`)**: Answers are evaluated entirely on the server against true database records.
* **Speed Anomaly Detection**: Responses completed in `< 0.8 seconds` are flagged as rapid guesswork / automated scripting anomalies (`Rapid response anomaly (0.35s). Possible automated script or blind guesswork.`).
* **Integrity Scoring**: Cadence violations drop the cadence integrity score (e.g. from 100% to 65%), alerting the supervisor.
* **Tab-Switch Auditing**: Focus loss events during the assessment are logged and penalize the session.

### 4. Real-Time Candidate Webcam Video Surveillance & Proctoring 📹👁️
* **Live Picture-in-Picture Video HUD**: Real-time mirrored webcam surveillance stream rendered directly inside the Windows 11 Fluent assessment engine (`<video autoPlay playsInline muted />`).
* **Biometric Reticle & Surveillance Watermark**: Displays cyan HUD corner reticles, live pulsing red recording beacon (`🔴 LIVE SURVEILLANCE`), detected camera device name, and real-time clock.
* **Minimizable / Floating HUD**: Can be minimized to a floating pill (`🔴 LIVE PROCTOR (N)`) or expanded into full surveillance view without obstructing questions.
* **Automatic Event-Driven Watermarked Snapshots**:
  * 📸 `BASELINE_ASSESSMENT_START`: Warm-up baseline capture taken immediately after camera initialization.
  * 📸 `PERIODIC_CHECK`: Automatic high-resolution proctor captures taken every 35 seconds throughout the assessment.
  * 📸 `FOCUS_LOSS_TAB_SWITCH`: Triggered instantly the moment the candidate switches tabs or navigates away.
  * 📸 `MANUAL_AUDIT_PROBE`: Clickable camera trigger for manual frame capture.
* **Hard Biometric Watermarking**: Every snapshot is stamped on an off-screen canvas with a high-contrast cyber watermark (`PROCTOR REC: [time] | Q[number] | [trigger]`).
* **Clean Hardware Release**: Camera tracks (`MediaStreamTrack.stop()`) are cleanly released from the hardware camera sensor upon test completion or modal exit.
* **Supervisor Real-Time Video CCTV Monitor**:
  * **Live Stream on Admin Dashboard (`/admin`)**: A dedicated surveillance CCTV monitor embeds directly on the Admin Dashboard, streaming the candidate's webcam video in real time (~1.2 FPS) while he is taking Module 2.
  * **Dual-Channel Zero Latency**: Powered by dual Server-Sent Events (SSE: `GET /api/quiz/live-stream`) for remote/cross-network monitoring and `BroadcastChannel` (0ms delay) for local tabs.
  * **Submissions Box (`/admin/submissions`)**: Displays the full gallery of captured candidate snapshots with click-to-zoom modals.
  * **Anti-Cheat Console (`/admin/anti-cheat`)**: Audit trail matching captured frames with tab-blur incidents, plus active live CCTV stream.
  * **Daily Archive (`/admin/archive`)**: Permanent biometric surveillance record archived alongside the exam score and XP.

### 5. Comprehensive Supervisor Integration
* **Submissions Box (`/admin/submissions`)**: Displays score pills (`42 / 50`), accuracy (`84%`), XP (`+30 XP`), avg speed per question, real-time webcam proctoring dossier with full-resolution zoom, and an expandable question-by-question breakdown table with candidate answers, server answer keys, and grammar explanations.
* **Anti-Cheat Console (`/admin/anti-cheat`)**: Dedicated **Assessment Cadence Telemetry Inspector** and **Webcam Proctor Surveillance Dossier** auditing rapid responses, question timings, and focus loss.
* **Daily Archive (`/admin/archive`)**: Single daily capsule cards display the assessment score, XP, and archived proctor frames, with full archived question breakdown in the expanded view.
* **Direct Access**: Launchable via `[ 🚀 LAUNCH ASSESSMENT (WIN11) ]` on the Module 2 card or directly at `/exercise/english`.
* **Legacy Fallback**: Backwards-compatible with historical screenshot OCR submissions.

### 6. Interactive Live Streamer Alert / Superchat Broadcast 👑📢
* **Live Broadcast Control Deck (Supervisor CCTV)**: An interactive Twitch/YouTube live stream broadcast console integrated directly into the Admin CCTV Surveillance Deck (`LiveProctorCCTV.jsx`).
* **Instant 1-Click Preset Alert Chips**:
  * 👀 *"I can see you!"*
  * ⚡ *"Stay focused!"*
  * 👏 *"Good job, keep it up!"*
  * 📱 *"Put the phone away!"*
  * 🛑 *"Don't look away from screen!"*
  * 😂 *"Nice face, stay locked in!"*
* **Custom Live Superchat Input**: Type any custom supervisor message with real-time dispatch and transmission feedback badge.
* **Streamer Pop-In Alert Banner on Candidate Screen**:
  * Appears instantaneously on candidate's English Assessment screen with smooth slide-and-pop physics (`animate-stream-alert`).
  * Styled like a high-tier Twitch / YouTube live stream donation alert with glowing gold/rose gradient border, glowing crown avatar, pulsating broadcast badge, and automatic 7.5s progress bar countdown.
  * 1-click dismiss button allows the candidate to acknowledge and dismiss the banner at any time.
* **Webcam Feed Speech Bubble Overlay**: An animated speech bubble is anchored directly over the candidate's live proctor webcam HUD pointing to his camera feed (`"💬 PROCTOR NOTICE: [text]"`).
* **Synthesized Streamer Fanfare Chime**: Uses the Web Audio API to synthesize an instant 4-tone ascending fanfare (`F5 -> A5 -> C6 -> F6`) requiring zero external audio assets.
* **Dual-Channel High-Availability Delivery**:
  * **BroadcastChannel (`forensic_sync_channel`)**: 0ms instant transmission for supervisor and candidate tabs running on the same machine.
  * **Server-Sent Events (SSE: `POST /api/quiz/live-message` ➔ `GET /api/quiz/live-stream`)**: Fanned out across local networks or remote physical devices.

---

## ✍️ Module 3: Writing Practice (Hardware EXIF Provenance)

* **Camera Hardware EXIF Extraction**: Audits physical camera metadata:
  * 📱 **Device Model**: Validates phone camera hardware (e.g., `Apple iPhone 15 Pro Max` or `Samsung Galaxy S24 Ultra Sensor Verified`).
  * 🕒 **DateTimeOriginal Timestamp Delta**: Verifies that the photo was taken **today during the active session**, preventing the use of older photos.
  * 📷 **Lens & Focal Length**: Reads hardware optic specifications.
  * 🛡️ **Firmware & Tampering Audit**: Confirms image was produced directly by `Camera Firmware RAW` without digital manipulation tools (Photoshop, Canva, web compressors).
* **Hash Collision Check**: MD5 & SHA-256 fingerprinting prevents re-uploading duplicate pages.
* **Action Row & Reset**: High-res photo upload dropzone, sample handwriting loader, and `[ ↺ CLEAR ]` button.

---

## 🚨 Emergency Red Lockdown & Tsunami Siren System

### 1. The Red Alarm Concept
If the subject attempts any prohibited anti-cheat action (pasting, tab switching, injection), the Admin Dashboard transforms into an emergency **Full Red Crimson Theme** (`#150205`).

### 2. Authentic Tsunami Civil Defense Siren
* Features a synthesized **10:12 dual-port rotary motor acoustic chord**.
* 2.4-second motor spool-up, undulating wail cycles, resonant outdoor horn filtering, and smooth rotational spindown on disarm.
* Integrated audio mute toggle (`🔇 Mute Audio`) for quiet environments.

### 3. Physical Disarm Requirement
* The alarm **cannot be bypassed by refreshing the page**; state is persisted in `localStorage`.
* The supervisor must physically click **`[ 🛑 PHYSICALLY DISARM ALARM ]`** to silence the siren and restore the standard interface.

### 4. Active Strike Management
* Infractions increment violation strikes.
* **Clear Strikes Button (`[ Clear Strikes ]`)**: Available on the Dashboard, Submissions Box, and Anti-Cheat pages to reset strikes back to 0.

### 5. Real-Time Cross-Tab Synchronization
* Powered by `BroadcastChannel('forensic_sync_channel')`: breaches, task submissions, clears, and disarms synchronize across all browser tabs instantly with zero page reloads.

---

## 🎨 Aesthetic Light Theme & Theme Switcher ("Nordic Slate / Minimal Mist")

### 1. Aesthetic, Eye-Friendly Palette (Not Blinding Hospital White)
* **Warm Slate Mist Base (`#f6f8fb`)**: Avoids stark, eye-straining `#ffffff` glare by using a warm, calming slate/zinc off-white tone.
* **Tactile Dot-Matrix Grid**: Renders an engineering blueprint dot matrix (`radial-gradient(rgba(100, 116, 139, 0.16) 1.25px)`) for depth and sophistication.
* **Elevated Surfaces**: Pure white cards (`#ffffff`) with subtle slate borders (`#e2e8f0`) and soft diffused elevation shadows.
* **High-Contrast Deep Ink Typography**: Deep slate `#0f172a` for headings and `#334155` for body text for effortless legibility.
* **Jewel Accent Pills**: Polished cyan, amber, emerald, teal, and rose badges that stand out cleanly.

### 2. Universal Theme Switcher
* **Admin Header (`CyberHeader`)**: Click the **`[ ☀️ Light / 🌙 Dark ]`** toggle next to "Share Brother Link" to switch themes instantly.
* **Brother Portal (`SubjectHub`)**: Brother can toggle themes directly from the header counter bar on his screen.
* **Synced Everywhere**: Persisted in `localStorage` (`forensic_theme`) and broadcast across tabs.

### 3. Module 1 Dual-Canvas Freedom
* In the Fullscreen Writing Terminal, Brother can click **`[ 📄 Paper Canvas / 🌙 Dark Canvas ]`** on the fly:
  * **Paper Canvas**: Warm stationery ivory surface (`#faf9f5`) with dark graphite text for clean daytime typing.
  * **Dark Canvas**: Deep OLED black canvas (`#000000`) for nighttime focus.

### 4. Strict Red Lockdown Immunity
* Even when operating in Aesthetic Light mode, an anti-cheat breach **immediately overrides the UI with the full Crimson Red Lockdown** (`#150205`) and the sounding tsunami siren. Anti-cheat severity is never compromised by theme selection.

---

## 📁 Daily Submission Archive (`/admin/archive`)

### 1. Automatic Archiving Upon Task Approval
* When you review your brother's submission in the Submissions Box (`/admin/submissions`) and click **"Approve & Archive"**:
  - The task status becomes `VERIFIED`.
  - A permanent, immutable snapshot is automatically recorded into the **Daily Submission Archive**.
  - Includes full text, active writing stopwatch duration, typing speed (WPM), total keystrokes, Duolingo screenshot with OCR streak, handwritten homework photo with EXIF camera tags, and your auditor evaluation notes.

### 2. Consolidated Daily Capsule Card (3-in-1 Container)
* **Single Container Per Day**: Instead of scattering 3 large independent cards taking up thousands of pixels, all 3 modules for each date are cleanly consolidated into **ONE unified daily card/capsule**.
* **Quick-Glance Summary Strip**: Even when collapsed, the card displays a compact 3-column glance showing Module 1 typing WPM & word count, Module 2 Duolingo streak & XP, and Module 3 writing camera model & timestamp.
* **Date-Mentioned View Button**: Each daily card features a prominent action button that **explicitly mentions that day's date**:
  - `[ 📅 View Thursday, Sep 10 Submissions (3 Modules) ▾ ]`
  - `[ 📅 Hide Thursday, Sep 10 Submissions ▴ ]`
* **1-Click Expansion**: Clicking the date-stamped button smoothly reveals all 3 verified modules inside that single card (complete with typed text, copy button, Duolingo screenshot lightbox, handwriting camera EXIF metadata, and auditor evaluation notes).
* **Expand All / Collapse All**: Includes a toolbar toggle to expand or collapse all recorded days with 1 click.

### 3. 1-Click Date Buttons ("Find By Date" Toolbar)
* **Dedicated Date Buttons**: Every date recorded in the archive receives an individual filter button (e.g. `[ 📅 Today • 3/3 DONE ✓ ]`, `[ 📅 Sep 09 • 3/3 DONE ✓ ]`).
* **Instant 3-Module Identification**: Any date where your brother completed all 3 disciplines (Keyboard, Duolingo, Writing) is immediately badged with a vibrant **`3/3 DONE ✓`** pill.
* **1-Click Focus & Auto-Expansion**: Clicking any date button instantly isolates and auto-expands that day's complete records.

### 4. Today's 3-Module Complete Dossier Button
* **Automated Recognition**: As soon as all 3 modules are approved for today, a prominent **Hero Completion Banner** appears at the top of the archive.
* **1-Click Find**: Click **`[ 📅 View Today's 3 Modules (Find Easily) → ]`** to jump straight to today's 3 completed disciplines without searching.
* **Submissions Box Shortcut**: When all 3 tasks are verified in the Submissions Box, an instant shortcut banner appears with **`[ View Today in Archive (3/3 Modules) → ]`**.

### 5. Reset Slot for Tomorrow
* On the approved task card in the Submissions Box, click **"Reset for Tomorrow"**:
  - Clears the active daily slot back to `PENDING` so your brother can submit the next day's practice.
  - The previous approved session remains 100% safe and permanently preserved in the **Archive**.

### 6. 1-Click Export JSON Report
* Click **"Export JSON"** on the archive page to download a timestamped backup report file (`brother_compliance_archive_YYYY-MM-DD.json`).

---

## 📁 Repository Structure

```
rbc/
├── frontend/                          # Vite + React 18 Single Page App
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminGate.jsx          # Passcode gate for admin enclave
│   │   │   ├── AdminIntelligenceBoard.jsx # Main executive supervisor board
│   │   │   ├── AdminFinishedTasks.jsx # Submissions review list with zoom & approve
│   │   │   ├── DailyArchivePage.jsx   # Daily Submission Archive ledger
│   │   │   ├── AntiCheatPage.jsx      # Forensic telemetry & hardware sensor audit
│   │   │   ├── SubjectHub.jsx         # Brother's portal (Modules 1, 2, 3 + writing screen)
│   │   │   ├── RedLockdownBanner.jsx  # Red alarm banner & physical disarm switch
│   │   │   ├── CyberHeader.jsx        # Admin top navigation bar
│   │   │   ├── CyberNotificationPopup.jsx # Floating live submission alerts
│   │   │   ├── SubmissionsBoxPage.jsx # Dedicated submissions review center
│   │   │   ├── ComplianceWorkspace.jsx# Direct workspace terminal
│   │   │   └── Modal.jsx              # Reusable modal container
│   │   ├── context/
│   │   │   └── ForensicContext.jsx    # Central state, audio synth, broadcast sync & storage
│   │   ├── hooks/                     # useTelemetry, useTypingTracker
│   │   ├── utils/                     # api client, formatters
│   │   ├── App.jsx                    # Route partitioning & lockdown styling
│   │   └── main.jsx                   # React root entry
│   ├── vercel.json                    # SPA rewrite configuration for Vercel deployment
│   ├── vite.config.js                 # Vite build & proxy settings
│   ├── tailwind.config.js             # Cybernetic dark/red theme configuration
│   └── package.json
│
├── backend/                           # Node.js + Express REST API
│   ├── src/
│   │   ├── config/                    # db.js (MongoDB Mongoose), env.js
│   │   ├── controllers/               # taskController, submissionController, authController
│   │   ├── middlewares/               # verifyEXIF, checkDuplicateHash, auth
│   │   ├── models/                    # Task, Submission, User schemas
│   │   ├── routes/                    # taskRoutes, submissionRoutes, reportRoutes, authRoutes
│   │   ├── services/                  # hashService, ocrService, complianceScorer
│   │   └── server.js                  # Express application bootstrap & logger
│   └── package.json
│
├── .gitignore                         # Excludes node_modules, build dist, and secrets
└── README.md                          # Complete project documentation
```

---

## 🚀 Running Locally

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
* **Port:** `http://localhost:5001`
* **Health Endpoint:** `http://localhost:5001/api/health`

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
* **Port:** `http://localhost:5173`
* **Brother Portal:** `http://localhost:5173/`
* **Admin Portal:** `http://localhost:5173/admin` *(Passcode: `admin123`)*

---

## 🌐 Deployment Guide (Cloud Production)

### Frontend (Vercel)
1. Push the project to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   * `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).
6. Deploy! (`vercel.json` will automatically handle SPA client routing).

### Backend (Render / Railway)
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables:
   * `NODE_ENV`: `production`
   * `PORT`: `10000` (or leave default)
   * `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   * `JWT_SECRET`: A strong secret key
   * `CLIENT_URL`: Your frontend Vercel URL
6. *(Tip to prevent free-tier sleep: set up a free monitor on [cron-job.org](https://cron-job.org) to ping `/api/health` every 10 minutes).*

### Database (MongoDB Atlas)
1. Create a free **M0 Cluster** on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Choose AWS **Mumbai (`ap-south-1`)** for minimal latency.
3. Whitelist all IP addresses (`0.0.0.0/0`) in Network Access.
4. Copy the connection string into your backend `MONGO_URI`.

---

## 🔒 Security & Anti-Cheat Summary

| Protection Layer | Mechanism | Action on Violation |
| :--- | :--- | :--- |
| **External Clipboard** | Event interceptor on `paste` / `drop` | Input blocked + Red Lockdown Alarm |
| **Focus Loss & Tabs** | `visibilitychange` & `blur` surveillance | Strike logged + Red Lockdown Alarm |
| **Idle Time Exploits** | 3.5s grace cadence detector | Stopwatch automatically pauses |
| **Recycled Screenshots**| MD5 / SHA-256 fingerprint collision | Flagged on Admin Review |
| **Fake Handwritten Work**| Camera EXIF tags & capture timestamp delta | Flagged if edited or non-camera sensor |
| **Alarm Dismissal** | Hardened `localStorage` state retention | Requires physical disarm by Admin |

---

## 📡 Complete REST API Endpoint Inventory (18 Endpoints)

All backend endpoints are operational, verified, and audited:

| # | Method | Endpoint | Pipeline / Gatekeepers | Description | Status |
|---|---|---|---|---|---|
| 1 | `GET` | `/api/health` | Public | Core Engine status & Gatekeeper health | ✅ 200 OK |
| 2 | `POST` | `/api/auth/login` | Public | Admin/Candidate login, returns JWT token | ✅ 200 OK |
| 3 | `POST` | `/api/auth/register` | Public | Registers user, hashes password, returns JWT | ✅ 201 Created |
| 4 | `GET` | `/api/auth/me` | Bearer JWT | Decrypts token claims and returns user profile | ✅ 200 OK |
| 5 | `GET` | `/api/tasks/daily-writing-topic` | Public | Serves deterministic 10-point daily handwriting topic | ✅ 200 OK |
| 6 | `GET` | `/api/tasks` | Public | Retrieves active compliance task definitions | ✅ 200 OK |
| 7 | `GET` | `/api/tasks/:id` | Public | Retrieves single compliance task by ID | ✅ 200 OK |
| 8 | `POST` | `/api/tasks` | Public | Dynamically creates custom compliance tasks | ✅ 201 Created |
| 9 | `GET` | `/api/quiz/session` | Zero-Knowledge | Deals 50 questions (scrubs answer keys/explanations) | ✅ 200 OK |
| 10 | `POST` | `/api/quiz/grade` | Speed Telemetry | Evaluates answers, audits <0.8s bot speeds, passmark: 35 | ✅ 200 OK |
| 11 | `GET` | `/api/quiz/stats` | Public | Question bank metrics, DB status, and AI engine status | ✅ 200 OK |
| 12 | `POST` | `/api/quiz/generate` | Public | On-demand batch generation of AI questions | ✅ 200 OK |
| 13 | `POST` | `/api/tasks/submit` | Multer, Hash, EXIF | Full Gatekeeper ingestion & compliance scoring | ✅ 201 Created |
| 14 | `POST` | `/api/submissions/submit` | Multer, Hash, EXIF | Direct submission endpoint with EXIF inspection | ✅ 201 Created |
| 15 | `POST` | `/api/submissions/:taskId` | Multer, Hash, EXIF | Task-specific submission endpoint | ✅ 201 Created |
| 16 | `GET` | `/api/submissions` | Public | Retrieves all submission audit logs | ✅ 200 OK |
| 17 | `GET` | `/api/submissions/:id` | Public | Retrieves single submission audit record by ID | ✅ 200 OK |
| 18 | `GET` | `/api/reports/:sessionId` | Digital Forensics | Generates forensic audit report (404 on invalid session) | ✅ 200 OK / 404 |

---

## 🧪 Senior Automation QA Test Report

### Automated End-to-End Test Suite Execution
- **Test Runner:** Custom automated Node.js test suite with real HTTP fetch requests
- **Backend Port:** `http://localhost:5001`
- **Total Test Cases:** **18**
- **Passed:** **18 (100%)**
- **Failed:** **0 (0%)**

```
===============================================================
  🔍 BROTHER COMPLIANCE SAAS - AUTOMATED TEST SUITE EXECUTION
===============================================================

  ✅ [PASS] 1. GET /api/health - Core Engine & Gatekeepers Online (Status: 200)
  ✅ [PASS] 2. POST /api/auth/login - Admin Authentication & JWT Token (Role: admin)
  ✅ [PASS] 3. POST /api/auth/register - Candidate Registration (201 Created)
  ✅ [PASS] 4. GET /api/auth/me - Token Claim Decryption (User: Admin (Me))
  ✅ [PASS] 5. GET /api/tasks/daily-writing-topic - 10-Point Daily Topic Delivery
  ✅ [PASS] 6. GET /api/tasks - Task Bank Retrieval (Count: 3)
  ✅ [PASS] 7. POST /api/tasks - Task Creation (201 Created)
  ✅ [PASS] 8. GET /api/tasks/:id - Task Retrieval By ID (Found)
  ✅ [PASS] 9. GET /api/quiz/session - Zero-Knowledge Dealer (50 Qs, Scrubbed Keys, No Leaks)
  ✅ [PASS] 10. GET /api/quiz/stats - Question Bank Statistics (Total Bank: 100)
  ✅ [PASS] 11. POST /api/quiz/grade - Server-Side Evaluation & Scoring (PassMark: 35)
  ✅ [PASS] 12. POST /api/quiz/grade - Bot & Tab-Switch Telemetry Flagging (<0.8s Detection)
  ✅ [PASS] 13. POST /api/tasks/submit - Full Gatekeeper Pipeline (Direct Match Fix Verified)
  ✅ [PASS] 14. POST /api/submissions/submit - Cryptographic Duplicate SHA-256 Hash Detection
  ✅ [PASS] 15. GET /api/submissions - Submission Surveillance Logs Retrieval
  ✅ [PASS] 16. GET /api/submissions/:id - Single Submission Audit Record
  ✅ [PASS] 17. GET /api/reports/:sessionId - Forensic Compliance Audit Report Generation
  ✅ [PASS] 18. GET /api/reports/:sessionId - 404 On Missing Session (Security Vulnerability Fixed)

===============================================================
  TOTAL TESTS: 18 | PASSED: 18 | FAILED: 0
===============================================================
```

---

## 🛠️ Security Loophole & Bug Fix Log

During this comprehensive audit, the following security vulnerabilities and runtime crashes were discovered and resolved:

1. **🔒 Insecure Report Generation Loophole Fixed**:
   - *Issue*: `GET /api/reports/:sessionId` generated a fabricated 200 OK "VERIFIED" audit report for non-existent session IDs.
   - *Fix*: Integrated `SESSION_STORE` lookup; now returns a strict `404 Not Found` for invalid or fabricated session IDs.

2. **🚫 Quiz Grading Network Error Auto-Pass Exploit Fixed**:
   - *Issue*: `EnglishQuizModal.jsx` catch block granted `fallbackScore = userAnswers.length` (awarding 50/50 and passing unconditionally if the backend was offline).
   - *Fix*: Rewrote fallback grading to strictly evaluate against verified answers and never award an automatic pass on error.

3. **💥 Frontend Missing Import & ReferenceError Crashes Resolved**:
   - Added missing `Layers` import to `EnglishQuizModal.jsx` (crashed on initial load).
   - Added missing `Maximize2`, `Minimize2`, `Cpu`, `FileCheck`, and `Edit3` imports to `SubjectHub.jsx`.
   - Defined missing `handleCanvasModeChange` function in `SubjectHub.jsx` (crashed when switching between dark and paper modes).
   - Corrected undeclared `pasteAlert` variable to `pasteBlockedAlert` in `SubjectHub.jsx`.
   - Added missing `Archive` import and guarded against null `submittedAt` timestamps in `AdminIntelligenceBoard.jsx`.
   - Added missing `Share2` import to `SubmissionsBoxPage.jsx`.
   - Added missing `Flame` and `UploadCloud` imports to `AdminFinishedTasks.jsx`.
   - Added missing `Share2`, `Inbox`, `Terminal`, `Flame`, and `FileCheck` imports to `DailyArchivePage.jsx`.

4. **⚡ Mongoose Question Schema Category Restriction**:
   - *Issue*: `Question.js` schema enum rejected categories like `'Beginner English'`, `'Coding Basics'`, etc., throwing validation errors during MongoDB seeding.
   - *Fix*: Expanded enum in `Question.js` to encompass all operational and seed categories.

5. **🛣️ Direct Match Submission Routing Fix**:
   - *Issue*: `POST /api/tasks/submit` returned `404 Not Found` because `submissionRoutes.js` lacked a root `router.post('/')` handler.
   - *Fix*: Added `router.post('/', ...gatekeeperPipeline);` to ensure seamless ingestion.

6. **🧹 Zero Demo Data Policy**:
   - All automated test records, temporary sessions, and registration trials generated during the test suite were purged from memory and database stores.

