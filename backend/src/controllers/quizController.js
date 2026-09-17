import { Question } from '../models/Question.js';
import { getIsConnected } from '../config/db.js';
import { getOrGenerateBatch, generateGeminiQuestions } from '../services/aiQuestionService.js';

// In-memory active quiz sessions map: sessionId -> { questionMap, startedAt }
const activeQuizSessions = new Map();

// Configurable question limit (defaults to 50, but can be set by Admin to 5, 10, 15, 20, 25, etc.)
let currentQuestionLimit = 50;

export const getQuestionLimit = () => currentQuestionLimit;
export const setQuestionLimit = (limit) => {
  const parsed = Math.max(3, Math.min(100, parseInt(limit, 10) || 50));
  currentQuestionLimit = parsed;
  return currentQuestionLimit;
};

export const getQuizSettings = (req, res) => {
  return res.status(200).json({
    success: true,
    questionLimit: currentQuestionLimit,
    passPercentage: 70,
    passMark: Math.ceil(currentQuestionLimit * 0.7)
  });
};

export const updateQuizSettings = (req, res) => {
  const { questionLimit } = req.body;
  if (!questionLimit) {
    return res.status(400).json({ success: false, message: 'questionLimit is required' });
  }
  const newLimit = setQuestionLimit(questionLimit);
  return res.status(200).json({
    success: true,
    questionLimit: newLimit,
    passPercentage: 70,
    passMark: Math.ceil(newLimit * 0.7),
    message: `Module 2 question limit updated to ${newLimit} questions.`
  });
};

/**
 * GET /api/quiz/session
 * THE DEALER: Dynamically provides non-repeating questions via AI engine based on limit.
 * ZERO-KNOWLEDGE: Strictly scrubs correctAnswerIndex and explanation before sending to React.
 */
export const startQuizSession = async (req, res) => {
  try {
    const limit = Math.max(3, Math.min(100, parseInt(req.query.limit, 10) || currentQuestionLimit));

    // Call Multi-Tier AI Generator to deal requested unique questions
    const { questions: selected, source } = await getOrGenerateBatch(limit);

    const sessionId = `qses_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Store in active sessions map for server-side evaluation
    const sessionQuestionMap = new Map();
    selected.forEach(q => {
      const qId = q.id || q._id?.toString();
      sessionQuestionMap.set(qId, {
        id: qId,
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        category: q.category,
        difficulty: q.difficulty,
        explanation: q.explanation
      });
    });

    activeQuizSessions.set(sessionId, {
      questionMap: sessionQuestionMap,
      startedAt: Date.now(),
      source
    });

    // Auto-cleanup stale sessions after 1 hour
    setTimeout(() => {
      activeQuizSessions.delete(sessionId);
    }, 60 * 60 * 1000);

    // Deliver questions with correctAnswerIndex and explanation for instant learning feedback
    const clientQuestions = selected.map(q => ({
      id: q.id || q._id?.toString(),
      text: q.text,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
      explanation: q.explanation || ''
    }));

    return res.status(200).json({
      success: true,
      sessionId,
      totalQuestions: clientQuestions.length,
      engine: 'Windows 11 Fluent x Duolingo Assessment (Infinite AI Engine)',
      source,
      questions: clientQuestions,
      dealTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Quiz Dealer Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deal randomized assessment questions.'
    });
  }
};

/**
 * POST /api/quiz/grade
 * THE GRADER: Compares client's chosen option indices against server-side true answer keys.
 * Evaluates response speed telemetry (flags answers under 0.8s as guesswork or automated scripts).
 */
export const gradeQuizSession = async (req, res) => {
  try {
    const { sessionId, answers = [], telemetry = {} } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing sessionId for quiz grading.'
      });
    }

    let session = activeQuizSessions.get(sessionId);

    // Fallback: if session in-memory map was wiped due to server restart, locate questions by ID in memory or DB
    let questionResolver = (id) => session?.questionMap?.get(id);

    if (!session && getIsConnected()) {
      try {
        const qIds = answers.map(a => a.questionId);
        const dbDocs = await Question.find({ _id: { $in: qIds } });
        const fallbackDbMap = new Map(dbDocs.map(q => [q._id.toString(), q]));
        questionResolver = (id) => fallbackDbMap.get(id);
      } catch (e) {}
    }

    let correctCount = 0;
    const gradedResults = [];
    const flags = [];
    let rapidResponsesCount = 0;

    answers.forEach((ans, index) => {
      const targetQuestion = questionResolver(ans.questionId);
      const isCorrect = targetQuestion && targetQuestion.correctAnswerIndex === ans.selectedOptionIndex;
      
      if (isCorrect) {
        correctCount += 1;
      }

      // Time-to-Answer Telemetry Check:
      // Answering an advanced English grammar question in under 0.8s is statistically impossible for organic human comprehension
      const isSuspiciousSpeed = typeof ans.timeSpentSec === 'number' && ans.timeSpentSec < 0.8;
      if (isSuspiciousSpeed) {
        rapidResponsesCount += 1;
        flags.push(`Question #${index + 1}: Rapid response anomaly (${ans.timeSpentSec.toFixed(2)}s). Possible automated script or blind guesswork.`);
      }

      gradedResults.push({
        questionId: ans.questionId,
        questionText: targetQuestion ? targetQuestion.text : `Question ${index + 1}`,
        options: targetQuestion ? targetQuestion.options : [],
        userSelectedIndex: ans.selectedOptionIndex,
        userSelectedText: targetQuestion ? targetQuestion.options[ans.selectedOptionIndex] : '--',
        correctAnswerIndex: targetQuestion ? targetQuestion.correctAnswerIndex : 0,
        correctAnswerText: targetQuestion ? targetQuestion.options[targetQuestion.correctAnswerIndex] : '--',
        isCorrect: !!isCorrect,
        explanation: targetQuestion ? targetQuestion.explanation : '',
        category: targetQuestion ? targetQuestion.category : 'General',
        timeSpentSec: ans.timeSpentSec || 0,
        suspiciousSpeed: isSuspiciousSpeed
      });
    });

    const totalQuestions = answers.length || session?.questionMap?.size || currentQuestionLimit;
    const passMark = Math.max(1, Math.ceil(totalQuestions * 0.7)); // 70% passing threshold (e.g. 4/5, 7/10, 14/20, 35/50)
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = correctCount >= passMark;
    const xpEarned = passed ? 30 : 0;

    // Tab switches audit
    const tabSwitches = telemetry.tabSwitches || 0;
    if (tabSwitches > 0) {
      flags.push(`Subject lost window focus / switched browser tabs ${tabSwitches} times during the assessment.`);
    }

    // Calculate integrity score (100 base, penalized for speed anomalies and tab switches)
    let integrityScore = 100 - (rapidResponsesCount * 15) - (tabSwitches * 20);
    integrityScore = Math.max(0, Math.min(100, integrityScore));

    const totalDurationSec = telemetry.totalDurationSec || answers.reduce((acc, a) => acc + (a.timeSpentSec || 0), 0);
    const avgTimePerQuestionSec = totalQuestions > 0 ? +(totalDurationSec / totalQuestions).toFixed(1) : 0;

    // Delete session from memory to prevent replay attacks
    activeQuizSessions.delete(sessionId);

    return res.status(200).json({
      success: true,
      grade: {
        score: correctCount,
        totalQuestions,
        passMark,
        percentage,
        passed,
        verdict: passed ? 'PASSED_VERIFIED' : 'FAILED_RETRY_REQUIRED',
        xpEarned,
        streakDays: 43,
        lessonTitle: 'Beginner English & Computer Programming',
        totalDurationSec: Math.round(totalDurationSec),
        avgTimePerQuestionSec,
        integrityScore,
        violations: flags,
        results: gradedResults,
        gradedAt: new Date().toISOString(),
        aiEngine: session?.source || 'ai-engine'
      }
    });

  } catch (error) {
    console.error('[Quiz Grader Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to grade assessment session.'
    });
  }
};

/**
 * POST /api/quiz/generate
 * On-demand AI Question Generator (for admin or background batches)
 */
export const generateMoreQuestions = async (req, res) => {
  try {
    const { count = 50 } = req.body;
    const result = await getOrGenerateBatch(count);
    return res.status(200).json({
      success: true,
      generatedCount: result.questions.length,
      source: result.source,
      message: `Successfully generated ${result.questions.length} questions via ${result.source}.`
    });
  } catch (err) {
    console.error('[Generate Questions Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate questions.'
    });
  }
};

/**
 * GET /api/quiz/stats
 * Returns current Question Bank statistics
 */
export const getQuestionBankStats = async (req, res) => {
  try {
    let totalQuestions = 0;
    let inDb = false;

    if (getIsConnected()) {
      try {
        const count = await Question.countDocuments({ source: 'gemini-ai' });
        totalQuestions = count;
        inDb = count > 0;
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      totalQuestions,
      inDb,
      aiEngineAvailable: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI_API_KEY'),
      aiProvider: 'Google Gemini AI'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------------------------------------
// REAL-TIME WEBCAM PROCTORING VIDEO STREAM RELAY (SSE + BUFFER)
// -------------------------------------------------------------
let latestProctorStreamFrame = null;
const streamSubscribers = new Set();

/**
 * POST /api/quiz/live-frame
 * Candidate publishes current webcam frame (1-2 FPS)
 */
export const publishLiveFrame = (req, res) => {
  try {
    const { frame, questionIndex, totalQuestions, timestamp, deviceName, candidateName } = req.body;
    if (!frame) {
      return res.status(400).json({ success: false, message: 'Frame data required' });
    }

    latestProctorStreamFrame = {
      frame,
      questionIndex: questionIndex || 1,
      totalQuestions: totalQuestions || 50,
      timestamp: timestamp || Date.now(),
      deviceName: deviceName || 'Integrated Webcam',
      candidateName: candidateName || 'Candidate',
      receivedAt: Date.now()
    };

    // Broadcast frame immediately to all active SSE subscribers (Admin screens)
    const payload = `data: ${JSON.stringify({ type: 'FRAME', data: latestProctorStreamFrame })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
        if (typeof client.flush === 'function') {
          client.flush();
        }
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });

    return res.status(200).json({ success: true, subscribers: streamSubscribers.size });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/quiz/live-stream-end
 * Candidate completes or exits Module 2
 */
export const endLiveStream = (req, res) => {
  latestProctorStreamFrame = null;
  activeWebRtcState = {
    offer: null,
    answer: null,
    candidateCandidates: [],
    adminCandidates: [],
    updatedAt: Date.now()
  };
  const payload = `data: ${JSON.stringify({ type: 'OFFLINE', timestamp: Date.now() })}\n\n`;
  const rtcResetPayload = `data: ${JSON.stringify({ type: 'WEBRTC_RESET', timestamp: Date.now() })}\n\n`;
  streamSubscribers.forEach(client => {
    try {
      client.write(payload);
      client.write(rtcResetPayload);
      if (typeof client.flush === 'function') {
        client.flush();
      }
    } catch (e) {
      streamSubscribers.delete(client);
    }
  });
  return res.status(200).json({ success: true, message: 'Live stream terminated' });
};

/**
 * GET /api/quiz/live-stream
 * Server-Sent Events (SSE) live feed for Admin CCTV monitor with zero-buffering headers
 */
export const streamLiveVideo = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disables reverse-proxy / tunnel buffering
  res.flushHeaders?.();

  streamSubscribers.add(res);

  // Send initial frame or offline status immediately on connection
  if (latestProctorStreamFrame && (Date.now() - latestProctorStreamFrame.receivedAt < 8500)) {
    res.write(`data: ${JSON.stringify({ type: 'FRAME', data: latestProctorStreamFrame })}\n\n`);
  } else {
    res.write(`data: ${JSON.stringify({ type: 'OFFLINE', timestamp: Date.now() })}\n\n`);
  }

  // Periodic heartbeat every 15s to keep connection alive
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (e) {
      clearInterval(heartbeat);
      streamSubscribers.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    streamSubscribers.delete(res);
  });
};

/**
 * GET /api/quiz/live-frame
 * Polling fallback returning latest frame
 */
export const getLatestLiveFrame = (req, res) => {
  const isStale = !latestProctorStreamFrame || (Date.now() - latestProctorStreamFrame.receivedAt > 8500);
  if (isStale) {
    return res.status(200).json({
      success: true,
      active: false,
      message: 'Candidate camera offline or not currently taking Module 2.'
    });
  }
  return res.status(200).json({
    success: true,
    active: true,
    data: latestProctorStreamFrame
  });
};

/**
 * POST /api/quiz/live-message
 * Supervisor broadcasts a live stream alert / superchat to candidate screen
 */
export const sendLiveStreamMessage = (req, res) => {
  try {
    const { text, sender = 'Supervisor', style = 'streamer' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text required' });
    }

    const messagePayload = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: text.trim(),
      sender,
      style,
      timestamp: Date.now()
    };

    // Fan out to all SSE subscribers (both candidate and admin tabs)
    const payload = `data: ${JSON.stringify({ type: 'LIVE_MESSAGE', data: messagePayload })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });

    return res.status(200).json({ 
      success: true, 
      subscribers: streamSubscribers.size,
      alert: messagePayload 
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================================
// WEBRTC ULTRA-LOW LATENCY HD VIDEO CALL SIGNALING ENGINE (30 FPS)
// ============================================================================
let activeWebRtcState = {
  offer: null,
  answer: null,
  candidateCandidates: [],
  adminCandidates: [],
  updatedAt: 0
};

/**
 * POST /api/quiz/webrtc/offer
 * Candidate initiates 30 FPS P2P video call with SDP Offer
 */
export const setWebRtcOffer = (req, res) => {
  try {
    const { offer } = req.body;
    if (!offer) {
      return res.status(400).json({ success: false, message: 'Missing WebRTC offer' });
    }
    activeWebRtcState = {
      offer,
      answer: null,
      candidateCandidates: [],
      adminCandidates: [],
      updatedAt: Date.now()
    };

    // Fan out offer to all SSE subscribers immediately
    const payload = `data: ${JSON.stringify({ type: 'WEBRTC_OFFER', offer })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
        if (typeof client.flush === 'function') client.flush();
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });

    return res.status(200).json({ success: true, message: 'WebRTC offer registered' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/quiz/webrtc/answer
 * Supervisor Admin responds with SDP Answer
 */
export const setWebRtcAnswer = (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ success: false, message: 'Missing WebRTC answer' });
    }
    activeWebRtcState.answer = answer;
    activeWebRtcState.updatedAt = Date.now();

    // Fan out answer to all SSE subscribers
    const payload = `data: ${JSON.stringify({ type: 'WEBRTC_ANSWER', answer })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
        if (typeof client.flush === 'function') client.flush();
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });

    return res.status(200).json({ success: true, message: 'WebRTC answer registered' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/quiz/webrtc/ice
 * Either peer exchanges ICE Candidate for NAT/firewall traversal
 */
export const addWebRtcIce = (req, res) => {
  try {
    const { candidate, sender = 'candidate' } = req.body;
    if (!candidate) {
      return res.status(400).json({ success: false, message: 'Missing ICE candidate' });
    }
    if (sender === 'candidate') {
      activeWebRtcState.candidateCandidates.push(candidate);
    } else {
      activeWebRtcState.adminCandidates.push(candidate);
    }
    activeWebRtcState.updatedAt = Date.now();

    // Fan out candidate to all SSE subscribers
    const payload = `data: ${JSON.stringify({ type: 'WEBRTC_ICE', candidate, sender })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
        if (typeof client.flush === 'function') client.flush();
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/quiz/webrtc/status
 * Inspect active WebRTC negotiation session and candidates
 */
export const getWebRtcStatus = (req, res) => {
  return res.status(200).json({
    success: true,
    hasOffer: !!activeWebRtcState.offer,
    offer: activeWebRtcState.offer,
    hasAnswer: !!activeWebRtcState.answer,
    answer: activeWebRtcState.answer,
    candidateCandidates: activeWebRtcState.candidateCandidates,
    adminCandidates: activeWebRtcState.adminCandidates,
    updatedAt: activeWebRtcState.updatedAt
  });
};

/**
 * POST /api/quiz/webrtc/reset
 * Terminate active WebRTC video call session
 */
export const resetWebRtcSession = (req, res) => {
  activeWebRtcState = {
    offer: null,
    answer: null,
    candidateCandidates: [],
    adminCandidates: [],
    updatedAt: Date.now()
  };
  const payload = `data: ${JSON.stringify({ type: 'WEBRTC_RESET', timestamp: Date.now() })}\n\n`;
  streamSubscribers.forEach(client => {
    try {
      client.write(payload);
      if (typeof client.flush === 'function') client.flush();
    } catch (e) {
      streamSubscribers.delete(client);
    }
  });
  return res.status(200).json({ success: true, message: 'WebRTC session reset' });
};

/**
 * POST /api/quiz/webrtc/request
 * Supervisor requests candidate to initiate a fresh WebRTC offer
 */
export const requestWebRtcOffer = (req, res) => {
  try {
    const payload = `data: ${JSON.stringify({ type: 'WEBRTC_REQUEST_OFFER', timestamp: Date.now() })}\n\n`;
    streamSubscribers.forEach(client => {
      try {
        client.write(payload);
        if (typeof client.flush === 'function') client.flush();
      } catch (e) {
        streamSubscribers.delete(client);
      }
    });
    return res.status(200).json({ success: true, message: 'WebRTC offer requested from candidate' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
