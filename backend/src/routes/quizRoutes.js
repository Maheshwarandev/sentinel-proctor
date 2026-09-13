import express from 'express';
import { 
  startQuizSession, 
  gradeQuizSession,
  generateMoreQuestions,
  getQuestionBankStats,
  publishLiveFrame,
  streamLiveVideo,
  getLatestLiveFrame,
  endLiveStream,
  sendLiveStreamMessage,
  getQuizSettings,
  updateQuizSettings,
  setWebRtcOffer,
  setWebRtcAnswer,
  addWebRtcIce,
  getWebRtcStatus,
  resetWebRtcSession,
  requestWebRtcOffer
} from '../controllers/quizController.js';

const router = express.Router();

// GET /api/quiz/settings -> Get current question limit and settings
router.get('/settings', getQuizSettings);

// POST /api/quiz/settings -> Update question limit
router.post('/settings', updateQuizSettings);

// GET /api/quiz/session -> The Dealer: deal non-repeating questions via Multi-Tier AI
router.get('/session', startQuizSession);

// POST /api/quiz/grade -> The Grader: grade responses server-side & audit speed telemetry
router.post('/grade', gradeQuizSession);

// GET /api/quiz/stats -> Bank statistics (total questions, inDb status, AI provider)
router.get('/stats', getQuestionBankStats);

// POST /api/quiz/generate -> On-demand AI question generator
router.post('/generate', generateMoreQuestions);

// REAL-TIME VIDEO SURVEILLANCE PROCTORING PIPELINE
// POST /api/quiz/live-frame -> Candidate broadcasts live video frame (1-2 FPS)
router.post('/live-frame', publishLiveFrame);

// POST /api/quiz/live-stream-end -> Candidate exits or finishes assessment
router.post('/live-stream-end', endLiveStream);

// GET /api/quiz/live-stream -> Supervisor Server-Sent Events (SSE) real-time video stream
router.get('/live-stream', streamLiveVideo);

// GET /api/quiz/live-frame -> Polling fallback for active stream status
router.get('/live-frame', getLatestLiveFrame);

// POST /api/quiz/live-message -> Supervisor broadcasts live alert/superchat to candidate screen
router.post('/live-message', sendLiveStreamMessage);

// ============================================================================
// WEBRTC ULTRA-LOW LATENCY HD VIDEO CALL (30 FPS) SIGNALING
// ============================================================================
// POST /api/quiz/webrtc/offer -> Candidate initiates P2P video call
router.post('/webrtc/offer', setWebRtcOffer);

// POST /api/quiz/webrtc/answer -> Supervisor Admin accepts and completes handshake
router.post('/webrtc/answer', setWebRtcAnswer);

// POST /api/quiz/webrtc/ice -> Exchange ICE candidates for direct UDP NAT traversal
router.post('/webrtc/ice', addWebRtcIce);

// GET /api/quiz/webrtc/status -> Check signaling state
router.get('/webrtc/status', getWebRtcStatus);

// POST /api/quiz/webrtc/reset -> Terminate WebRTC session
router.post('/webrtc/reset', resetWebRtcSession);

// POST /api/quiz/webrtc/request -> Supervisor requests fresh WebRTC call from candidate
router.post('/webrtc/request', requestWebRtcOffer);

export default router;
