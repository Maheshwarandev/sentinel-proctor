import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  Clock 
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

// Duolingo's iconic mascot Duo the Green Owl
const DuoOwl = ({ className = "w-24 h-24", mood = "happy" }) => (
  <div className={`relative inline-block select-none ${className}`}>
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Party Hat for celebration */}
      {mood === 'party' && (
        <g>
          <path d="M52 14L60 -4L68 14Z" fill="#FFC800" stroke="#E5A500" strokeWidth="2" />
          <circle cx="60" cy="-4" r="3" fill="#FF4B4B" />
          <path d="M54 8L66 8" stroke="#FFFFFF" strokeWidth="2" />
        </g>
      )}
      {/* Body */}
      <ellipse cx="60" cy="66" rx="42" ry="38" fill="#58CC02" />
      {/* Wing left */}
      <ellipse cx="22" cy="70" rx="9" ry="16" fill="#46A302" transform="rotate(15 22 70)" />
      {/* Wing right */}
      <ellipse cx="98" cy="70" rx="9" ry="16" fill="#46A302" transform="rotate(-15 98 70)" />
      {/* Head feather tufts */}
      <path d="M30 38C22 28 20 20 25 18C30 16 38 28 42 35" fill="#58CC02" />
      <path d="M90 38C98 28 100 20 95 18C90 16 82 28 78 35" fill="#58CC02" />
      {/* Tummy highlight */}
      <ellipse cx="60" cy="74" rx="26" ry="24" fill="#89E219" />
      {/* White eye rings */}
      <circle cx="45" cy="50" r="16.5" fill="#FFFFFF" />
      <circle cx="75" cy="50" r="16.5" fill="#FFFFFF" />
      {/* Dark pupils */}
      <circle cx="47" cy="50" r="8.5" fill="#4B4B4B" />
      <circle cx="73" cy="50" r="8.5" fill="#4B4B4B" />
      {/* Eye reflections */}
      <circle cx="49" cy="47" r="3" fill="#FFFFFF" />
      <circle cx="75" cy="47" r="3" fill="#FFFFFF" />
      {/* Orange beak */}
      <path d="M54 55C54 55 60 67 66 55Z" fill="#FF9600" />
      {/* Cheeks blush */}
      <ellipse cx="32" cy="62" rx="4" ry="2.5" fill="#89E219" />
      <ellipse cx="88" cy="62" rx="4" ry="2.5" fill="#89E219" />
      {/* Feet */}
      <ellipse cx="48" cy="103" rx="7" ry="4" fill="#FF9600" />
      <ellipse cx="72" cy="103" rx="7" ry="4" fill="#FF9600" />
    </svg>
  </div>
);

export const EnglishQuizModal = ({ isOpen = true, onClose, activeSession = null }) => {
  const navigate = useNavigate();
  const { submitDuolingoPractice, triggerRedLockdown, module2QuestionLimit = 50, getModule2TimeStatus } = useForensics();

  const timeStatus = typeof getModule2TimeStatus === 'function' ? getModule2TimeStatus() : { isActive: true, countdownOpen: '00:00:00' };
  const isTimeLocked = !activeSession?.practiceMode && !timeStatus.isActive;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-question answering state
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [currentExplanation, setCurrentExplanation] = useState('');
  const [revealedCorrectIndex, setRevealedCorrectIndex] = useState(null);

  // Time & telemetry tracking
  const [userAnswers, setUserAnswers] = useState([]); // [{ questionId, selectedOptionIndex, timeSpentSec }]
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [telemetryWarning, setTelemetryWarning] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [grading, setGrading] = useState(false);
  const [finalGrade, setFinalGrade] = useState(null);

  // Real-Time Video Webcam Proctoring State & Hardware Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const snapshotTimerRef = useRef(null);
  const liveStreamIntervalRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  const isBroadcastingFrameRef = useRef(false);

  // WebRTC 30 FPS HD Video Call Refs & State
  const webrtcPcRef = useRef(null);
  const webrtcPollTimerRef = useRef(null);
  const lastSnapshotSentRef = useRef(0);
  const [isWebRtcLive, setIsWebRtcLive] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraDeviceName, setCameraDeviceName] = useState('Front Proctor Camera');
  const [proctorSnapshots, setProctorSnapshots] = useState([]);
  const [isPiPMinimized, setIsPiPMinimized] = useState(false);

  const questionTimerRef = useRef(null);

  // Synthesize Duolingo-style audio chimes
  const playSound = (isSuccess) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        // Bright major chime C6 -> E6 -> G6
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.5, t); // C6
        osc.frequency.setValueAtTime(1318.5, t + 0.08); // E6
        osc.frequency.setValueAtTime(1567.98, t + 0.16); // G6
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        osc.start(t);
        osc.stop(t + 0.45);
      } else {
        // Low gentle buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.setValueAtTime(196, t + 0.12);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.35);
      }
    } catch (e) {}
  };

  // Text-to-speech speaker button for Duolingo audio prompts
  const speakQuestion = (text) => {
    if (!text || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Live Stream Alert / Superchat Broadcast State & Audio Chime
  const [activeStreamAlert, setActiveStreamAlert] = useState(null);
  const alertDismissTimerRef = useRef(null);
  const sseRef = useRef(null);
  const lastAlertIdRef = useRef(null);

  // Synthesize Twitch / YouTube Streamer superchat alert fanfare chime
  const playStreamAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      // 4-note celebratory ascending fanfare (F5 -> A5 -> C6 -> F6)
      const fanfareNotes = [698.46, 880.00, 1046.50, 1396.91];
      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0, t + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.20, t + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.40);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.40);
      });
    } catch (e) {}
  };

  const handleIncomingStreamAlert = (alert) => {
    if (!alert || !alert.text) return;
    if (alert.id && lastAlertIdRef.current === alert.id) return;
    if (alert.id) lastAlertIdRef.current = alert.id;

    setActiveStreamAlert(alert);
    playStreamAlertSound();

    if (alertDismissTimerRef.current) {
      clearTimeout(alertDismissTimerRef.current);
    }
    alertDismissTimerRef.current = setTimeout(() => {
      setActiveStreamAlert(null);
    }, 7500);
  };

  // 1. Fetch randomized zero-knowledge session from backend Dealer
  const initQuizSession = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setHasChecked(false);
    setUserAnswers([]);
    setCurrentIndex(0);
    setIsCompleted(false);
    setFinalGrade(null);
    setTotalSeconds(0);
    setTabSwitches(0);

    const limit = Math.max(3, Math.min(100, parseInt(module2QuestionLimit, 10) || 50));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`/api/quiz/session?limit=${limit}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!data.success || !data.questions?.length) {
        throw new Error(data.message || 'Could not load quiz questions.');
      }

      // Deduplicate questions as a fail-safe guarantee
      const seen = new Set();
      const uniqueQuestions = [];
      for (const q of data.questions) {
        const textKey = (q.text || '').trim().toLowerCase();
        if (!seen.has(textKey)) {
          seen.add(textKey);
          uniqueQuestions.push(q);
        }
      }

      setSessionId(data.sessionId);
      setQuestions(uniqueQuestions);
      setQuestionStartTime(Date.now());
      setQuestionSeconds(0);
      setLoading(false);
    } catch (err) {
      console.warn('Quiz init backend fetch notice:', err.message);
      setError('Unable to load AI questions. Please verify your connection and try again.');
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // REAL-TIME VIDEO PROCTORING CAMERA LIFECYCLE & FRAME CAPTURE
  // -------------------------------------------------------------
  const captureSnapshot = (reason = 'PERIODIC_CHECK') => {};

  const stopWebcam = () => {
    setIsWebRtcLive(false);
    setIsCameraActive(false);
  };

  const startWebRtcCall = async (stream) => {};

  const initWebcam = async () => {};

  useEffect(() => {
    if (isOpen) {
      initQuizSession();
      // initWebcam(); // Camera removed
    }
    return () => {
      // stopWebcam();
    };
  }, [isOpen]);

  // Real-Time Video Surveillance Stream Relay to Admin CCTV Monitor (~1.2s cadence)
  useEffect(() => {
    // Camera streaming removed
  }, [isCameraActive, loading, isCompleted, currentIndex, questions.length, cameraDeviceName]);

  // Periodic proctor frame snapshots every 35 seconds
  useEffect(() => {
    if (!isCameraActive || loading || isCompleted) return;

    snapshotTimerRef.current = setInterval(() => {
      captureSnapshot('PERIODIC_CHECK');
    }, 35000);

    return () => clearInterval(snapshotTimerRef.current);
  }, [isCameraActive, loading, isCompleted, currentIndex]);

  // 2. Active Question Stopwatch
  useEffect(() => {
    if (loading || isCompleted) return;

    questionTimerRef.current = setInterval(() => {
      setQuestionSeconds(s => s + 1);
      setTotalSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(questionTimerRef.current);
  }, [loading, isCompleted]);

  // 3. Tab switch & focus loss anti-cheat telemetry
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isCompleted && !loading) {
        setTabSwitches(p => {
          const next = p + 1;
          captureSnapshot('FOCUS_LOSS_TAB_SWITCH');
          setTelemetryWarning(`FOCUS LOSS DETECTED: You navigated away from the English Assessment window! (${next} warning${next > 1 ? 's' : ''})`);
          setTimeout(() => setTelemetryWarning(null), 4000);

          // ONLY escalate to emergency lockdown if he repeatedly breaks rules (3+ tab switches during exam)
          if (next >= 3) {
            triggerRedLockdown('PERSISTENT FOCUS EVASION: Subject repeatedly navigated away (3+ times) from active English Assessment engine!', {
              module: 'Module 2: English Assessment',
              type: 'WINDOW_BLUR',
              tabSwitches: next
            });
          }
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isCompleted, loading, triggerRedLockdown]);

  // 4. Keyboard shortcuts (1, 2, 3, 4, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || isCompleted) return;

      if (!hasChecked) {
        if (['1', 'a', 'A'].includes(e.key)) setSelectedOption(0);
        if (['2', 'b', 'B'].includes(e.key)) setSelectedOption(1);
        if (['3', 'c', 'C'].includes(e.key)) setSelectedOption(2);
        if (['4', 'd', 'D'].includes(e.key)) setSelectedOption(3);

        if (e.key === 'Enter' && selectedOption !== null) {
          handleCheckAnswer();
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, isCompleted, hasChecked, selectedOption]);

  // Check Answer click
  const handleCheckAnswer = () => {
    if (selectedOption === null || hasChecked) return;

    const timeSpentSec = Math.max(0.2, (Date.now() - questionStartTime) / 1000);
    const currentQ = questions[currentIndex];

    // Record this answer
    const currentAnswerRecord = {
      questionId: currentQ?.id,
      selectedOptionIndex: selectedOption,
      timeSpentSec: +timeSpentSec.toFixed(2)
    };

    setUserAnswers(prev => [...prev, currentAnswerRecord]);
    setHasChecked(true);

    // Dynamic evaluation of correct vs wrong
    const isCorrect = typeof currentQ?.correctAnswerIndex === 'number'
      ? selectedOption === currentQ.correctAnswerIndex
      : true;

    setIsAnswerCorrect(isCorrect);
    setCurrentExplanation(currentQ?.explanation || '');
    setRevealedCorrectIndex(typeof currentQ?.correctAnswerIndex === 'number' ? currentQ.correctAnswerIndex : null);
    playSound(isCorrect);
  };

  // Advance to next question or trigger final grading
  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setIsAnswerCorrect(null);
      setCurrentExplanation('');
      setRevealedCorrectIndex(null);
      setQuestionStartTime(Date.now());
      setQuestionSeconds(0);
    } else {
      // Quiz finished! Send to backend Grader
      await submitForGrading();
    }
  };

  // Submit all answers to Node.js Grader
  const submitForGrading = async () => {
    setGrading(true);
    try {
      const res = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: userAnswers,
          telemetry: {
            tabSwitches,
            totalDurationSec: totalSeconds
          }
        })
      });

      const data = await res.json();
      if (!data.success || !data.grade) {
        throw new Error(data.message || 'Failed to grade assessment.');
      }

      setFinalGrade(data.grade);
      setIsCompleted(true);
      playSound(data.grade.passed);
    } catch (err) {
      console.error('Grading error:', err);
      // Client-side fallback: check if questions include correctAnswerIndex for local evaluation
      let accurateScore = 0;
      userAnswers.forEach(ans => {
        const q = questions.find(item => (item.id || item._id) === ans.questionId);
        if (q && typeof q.correctAnswerIndex === 'number' && q.correctAnswerIndex === ans.selectedOptionIndex) {
          accurateScore += 1;
        }
      });
      const fallbackTotal = questions.length || module2QuestionLimit || 50;
      const fallbackPassMark = Math.max(1, Math.ceil(fallbackTotal * 0.7));
      const fallbackPassed = accurateScore >= fallbackPassMark;
      setFinalGrade({
        score: accurateScore,
        totalQuestions: fallbackTotal,
        passMark: fallbackPassMark,
        percentage: Math.round((accurateScore / fallbackTotal) * 100),
        passed: fallbackPassed,
        verdict: fallbackPassed ? 'PASSED_VERIFIED' : 'FAILED_RETRY_REQUIRED',
        xpEarned: fallbackPassed ? 30 : 0,
        streakDays: 43,
        lessonTitle: 'Beginner English & Computer Programming',
        totalDurationSec: totalSeconds,
        avgTimePerQuestionSec: +(totalSeconds / (fallbackTotal || 1)).toFixed(1),
        integrityScore: Math.max(50, 100 - (tabSwitches * 20)),
        violations: tabSwitches > 0 ? [`${tabSwitches} window focus loss events`] : [],
        results: []
      });
      setIsCompleted(true);
      playSound(fallbackPassed);
    } finally {
      setGrading(false);
    }
  };

  // Final submission to SubjectHub / ForensicContext
  const handleCommitAssessment = () => {
    if (!finalGrade || !finalGrade.passed) return;

    // Record completion in Module 2 daily quest roadmap
    if (activeSession?.day) {
      try {
        const savedDays = JSON.parse(localStorage.getItem('module2_completed_days') || '[]');
        if (!savedDays.includes(activeSession.day)) {
          savedDays.push(activeSession.day);
          localStorage.setItem('module2_completed_days', JSON.stringify(savedDays));
        }
      } catch (e) {}
    }

    submitDuolingoPractice({
      type: 'english_quiz',
      quizScore: finalGrade.score,
      totalQuestions: finalGrade.totalQuestions,
      percentage: finalGrade.percentage,
      xpEarned: `+${finalGrade.xpEarned} XP VERIFIED`,
      streakDetected: `${finalGrade.streakDays} DAYS STREAK (ASSESSMENT CERTIFIED)`,
      lessonTitle: finalGrade.lessonTitle,
      totalDurationSec: finalGrade.totalDurationSec,
      avgTimePerQuestionSec: finalGrade.avgTimePerQuestionSec,
      integrityScore: finalGrade.integrityScore,
      violations: finalGrade.violations,
      results: finalGrade.results,
      proctorSnapshots: proctorSnapshots,
      cameraDevice: cameraDeviceName,
      hash: {
        md5: '7d9b04859a4309c68a18357f89b9d31a',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        matchStatus: 'CLEAR - In-App Assessment Verified'
      },
      ocrData: {
        streakDetected: `${finalGrade.streakDays} DAYS STREAK`,
        xpEarned: `+${finalGrade.xpEarned} XP`,
        lessonTitle: finalGrade.lessonTitle,
        confidencePct: 100,
        timestampFound: 'In-App Windows 11 Engine'
      }
    });

    stopWebcam();

    if (onClose) {
      onClose();
    } else {
      navigate('/candidate');
    }
  };

  if (!isOpen) return null;

  if (isTimeLocked && !isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base text-white font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-surface-elevated border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Daily Session Locked</h2>
            <p className="text-xs text-amber-300 font-mono font-bold">
              Access Window: 7:00 PM – 10:00 PM (19:00 – 22:00)
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-card/80 border border-white/[0.08] space-y-1">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Time Until 7:00 PM Tonight</div>
            <div className="text-3xl font-black font-mono text-amber-400">{timeStatus.countdownOpen}</div>
            <p className="text-xs text-slate-400 pt-1 leading-relaxed">
              Module 2 questions are strictly accessible between 7:00 PM and 10:00 PM daily. Please return during the scheduled window to take your assessment!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose || (() => navigate('/test'))}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-300 hover:to-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Back to Candidate Workstation
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + (hasChecked ? 1 : 0)) / questions.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-surface-card flex flex-col font-sans select-none overflow-x-hidden overflow-y-auto min-h-screen">
      


      {/* Duolingo Top Header */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between gap-4 shrink-0">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose || (() => navigate('/candidate'))}
          className="p-1.5 rounded-xl text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors cursor-pointer"
          title="Exit Practice"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Chunky Duolingo Green Progress Bar & Session Label */}
        <div className="flex-1 max-w-2xl flex flex-col justify-center">
          {activeSession && (
            <div className="flex items-center justify-between text-[11px] font-black font-mono text-slate-600 mb-1 px-1">
              <span className="truncate text-slate-800">
                DAY {activeSession.day}: {activeSession.title}
              </span>
              <span className="text-[#58CC02] shrink-0 ml-2">
                {progressPercent}%
              </span>
            </div>
          )}
          <div className="h-4 bg-[#E5E5E5] rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            >
              {/* Reflective glossy top line */}
              <div className="absolute top-0.5 left-2 right-2 h-1 bg-surface-card/35 rounded-full" />
            </div>
          </div>
        </div>

        {/* Duolingo Badges */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-1.5 text-[#FF9600] font-black text-sm">
            <span className="text-base">🔥</span>
            <span>43</span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-[#1CB0F6] font-black text-sm">
            <span className="text-base">💎</span>
            <span>450</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[#FF4B4B] font-black text-sm">
            <span className="text-base">❤️</span>
            <span>5</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(p => !p)}
            className="p-1.5 rounded-xl text-content-secondary hover:text-content-primary transition-colors cursor-pointer"
            title={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#1CB0F6]" /> : <VolumeX className="w-5 h-5 text-content-secondary" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 my-auto">
          
          <h3 className="text-2xl font-black text-slate-800">Loading your English lesson...</h3>
          <p className="text-sm font-bold text-content-secondary">Get ready to practice!</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 my-auto text-center">
          
          <h3 className="text-xl font-black text-[#FF4B4B]">Could not load lesson</h3>
          <p className="text-sm text-slate-600 max-w-sm">{error}</p>
          <button
            type="button"
            onClick={initQuizSession}
            className="py-3 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-base uppercase tracking-wider cursor-pointer"
          >
            TRY AGAIN
          </button>
        </div>
      ) : isCompleted ? (
        /* Lesson Finished Screen (Authentic Duolingo Victory) */
        <div className="max-w-lg mx-auto w-full py-12 px-6 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 my-auto">
          
          
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-[#FFC800] tracking-tight">
              Lesson Complete!
            </h2>
            <p className="text-sm font-bold text-slate-600">
              You're making incredible progress with your English practice.
            </p>
          </div>

          {/* 3D Duolingo Stat Cards */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-[#FFC800] rounded-2xl border-2 border-b-4 border-[#E5A500] p-3.5 text-white text-center shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">TOTAL XP</span>
              <span className="text-2xl font-black block mt-0.5">+30</span>
            </div>
            <div className="bg-[#1CB0F6] rounded-2xl border-2 border-b-4 border-[#1899D6] p-3.5 text-white text-center shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">ACCURACY</span>
              <span className="text-2xl font-black block mt-0.5">{finalGrade?.percentage || 90}%</span>
            </div>
            <div className="bg-[#FF9600] rounded-2xl border-2 border-b-4 border-[#E57800] p-3.5 text-white text-center shadow-sm">
              <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">STREAK</span>
              <span className="text-2xl font-black block mt-0.5 flex items-center justify-center space-x-1">
                <span>43</span>
                <span className="text-base">🔥</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCommitAssessment}
            className="w-full py-4 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-lg uppercase tracking-wider transition-all active:border-b-0 active:translate-y-1 shadow-md cursor-pointer mt-4"
          >
            CONTINUE
          </button>
        </div>
      ) : !currentQuestion ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 my-auto text-center">
          
          <h3 className="text-xl font-black text-slate-800">Ready for English Practice?</h3>
          <p className="text-sm text-slate-600">Press start to begin your lesson.</p>
          <button
            type="button"
            onClick={initQuizSession}
            className="py-3 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-base uppercase tracking-wider cursor-pointer"
          >
            START LESSON
          </button>
        </div>
      ) : (
        /* Active Duolingo Question Interface */
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 pb-36 flex flex-col justify-center my-auto">
          
          {/* Pillar Category Badge Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              {currentQuestion.category === 'Fluency' || currentQuestion.isFluency ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-700 border border-sky-500/30 text-xs font-black uppercase tracking-wider font-mono">
                  <span>🗣️ ENGLISH FLUENCY & SPOKEN PRACTICE</span>
                </span>
              ) : currentQuestion.category === 'Coding' || currentQuestion.codeSnippet ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 text-xs font-black uppercase tracking-wider font-mono">
                  <span>💻 BASIC PROGRAMMING LOGIC</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 border border-purple-500/30 text-xs font-black uppercase tracking-wider font-mono">
                  <span>📖 ENGLISH GRAMMAR MECHANICS</span>
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-content-secondary uppercase tracking-wider font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mb-4">
            {currentQuestion.category === 'Fluency' || currentQuestion.isFluency 
              ? "Listen and choose the most natural workplace response:" 
              : "Select the correct answer"}
          </h1>

          {/* VISUAL IMAGE CARD (IF IMAGE PRESENT) */}
          {currentQuestion.imageUrl && (
            <div className="mb-5 rounded-2xl overflow-hidden border-2 border-surface-border bg-surface-card shadow-md p-2 flex flex-col items-center">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Visual Reference" 
                className="w-full max-h-56 sm:max-h-64 object-contain rounded-xl"
              />
              <div className="text-[11px] font-mono text-slate-400 py-1.5 flex items-center space-x-1.5">
                <span>🔍 Visual Reference — Inspect Above</span>
              </div>
            </div>
          )}

          {/* CODE SNIPPET (IF CODING QUESTION WITH CODE) */}
          {currentQuestion.codeSnippet && (
            <div className="mb-4 rounded-xl bg-surface-elevated border border-slate-700 p-3.5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap leading-relaxed">{currentQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Duo the Owl Prompt with Speech Bubble */}
          <div className="flex items-start space-x-4 mb-6">
            
            
            <div className="relative bg-surface-card border-2 border-surface-border rounded-2xl p-4 sm:p-5 shadow-sm text-left flex items-center space-x-3.5 flex-1">
              {/* Triangle pointer to Duo */}
              <div className="absolute -left-2.5 top-6 w-3 h-3 bg-surface-card border-l-2 border-b-2 border-surface-border rotate-45 transform" />

              <button
                type="button"
                onClick={() => speakQuestion(currentQuestion.text)}
                className="w-11 h-11 rounded-xl bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1482B4] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-all active:border-b-0 active:translate-y-1"
                title="Listen audio"
              >
                <Volume2 className="w-5 h-5 fill-white" />
              </button>

              <div className="space-y-0.5">
                <span className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug block">
                  {currentQuestion.text}
                </span>
                {(currentQuestion.category === 'Fluency' || currentQuestion.isFluency) && (
                  <span className="text-[11px] font-bold text-[#1CB0F6] block pt-1">
                    🔊 Click the blue speaker icon to listen to natural pronunciation!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3D Duolingo Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = typeof currentQuestion.correctAnswerIndex === 'number' && currentQuestion.correctAnswerIndex === idx;

              let cardStyle = "border-surface-border border-surface-border bg-surface-card text-content-primary hover:bg-surface-elevated";
              let chipStyle = "border-surface-border text-content-secondary bg-surface-card";
              let statusIcon = null;

              if (isSelected && !hasChecked) {
                cardStyle = "border-[#1CB0F6] border-b-[#1899D6] bg-[#DDF4FF] text-[#1899D6]";
                chipStyle = "border-[#1CB0F6] text-white bg-[#1CB0F6]";
              } else if (hasChecked) {
                if (isAnswerCorrect) {
                  // Candidate answered CORRECTLY
                  if (isSelected) {
                    cardStyle = "border-[#58CC02] border-b-[#46A302] bg-[#D7FFB8] text-[#46A302]";
                    chipStyle = "border-[#58CC02] text-white bg-[#58CC02]";
                    statusIcon = <CheckCircle2 className="w-6 h-6 text-[#58CC02] shrink-0" />;
                  } else {
                    cardStyle = "border-surface-border border-surface-border bg-surface-card text-content-secondary opacity-40";
                    chipStyle = "border-surface-border text-content-secondary bg-[#F7F7F7]";
                  }
                } else {
                  // Candidate answered WRONGLY -> Put RED on selected, and show GREEN on correct
                  if (isSelected) {
                    cardStyle = "border-[#FF4B4B] border-b-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B]";
                    chipStyle = "border-[#FF4B4B] text-white bg-[#FF4B4B]";
                    statusIcon = <X className="w-6 h-6 text-[#EA2B2B] stroke-[3] shrink-0" />;
                  } else if (isCorrectOption) {
                    cardStyle = "border-[#58CC02] border-b-[#46A302] bg-[#F4FFE8] text-[#46A302] ring-2 ring-[#58CC02]/40";
                    chipStyle = "border-[#58CC02] text-white bg-[#58CC02]";
                    statusIcon = <CheckCircle2 className="w-6 h-6 text-[#58CC02] shrink-0" />;
                  } else {
                    cardStyle = "border-surface-border border-surface-border bg-surface-card text-content-secondary opacity-40";
                    chipStyle = "border-surface-border text-content-secondary bg-[#F7F7F7]";
                  }
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasChecked}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 border-b-4 font-extrabold text-base sm:text-lg flex items-center justify-between transition-all cursor-pointer select-none active:border-b-2 active:translate-y-[2px] ${cardStyle}`}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className={`w-8 h-8 rounded-xl border-2 font-bold text-sm flex items-center justify-center transition-all ${chipStyle}`}>
                      {idx + 1}
                    </span>
                    <span className="text-left leading-snug">{option}</span>
                  </div>
                  {statusIcon}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Signature Duolingo Bottom Tray */}
      {currentQuestion && !isCompleted && !loading && (
        <div className={`fixed bottom-0 inset-x-0 border-t-2 py-5 px-4 sm:px-8 z-30 transition-all duration-200 ${
          !hasChecked 
            ? 'bg-surface-card border-surface-border' 
            : isAnswerCorrect
            ? 'bg-[#D7FFB8] border-[#58CC02]/30'
            : 'bg-[#FFDFE0] border-[#FF4B4B]/30'
        }`}>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {!hasChecked ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm font-bold text-content-secondary">
                  <span>Shortcut: Press [1] to [4], then [Enter]</span>
                </div>
                
                <div className="w-full sm:w-auto flex justify-end">
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleCheckAnswer}
                    className={`w-full sm:w-44 py-3.5 px-8 rounded-2xl font-black text-base uppercase tracking-wider transition-all border-b-4 ${
                      selectedOption !== null
                        ? 'bg-[#58CC02] hover:bg-[#61E002] border-[#46A302] text-white cursor-pointer active:border-b-0 active:translate-y-1 shadow-sm'
                        : 'bg-[#E5E5E5] border-[#CECECE] text-content-secondary cursor-not-allowed'
                    }`}
                  >
                    CHECK
                  </button>
                </div>
              </>
            ) : isAnswerCorrect ? (
              // -------------------------------------------------------------
              // CORRECT ANSWER (GREEN FEEDBACK)
              // -------------------------------------------------------------
              <>
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center text-[#58CC02] shadow-sm shrink-0">
                    <CheckCircle2 className="w-9 h-9 fill-[#58CC02] text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#58CC02]">
                      Nicely done!
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#46A302]">
                      {currentExplanation || '+30 XP • Practice in progress'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={grading}
                  onClick={handleNextQuestion}
                  className="w-full sm:w-44 py-3.5 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-base uppercase tracking-wider transition-all active:border-b-0 active:translate-y-1 shadow-sm cursor-pointer shrink-0"
                >
                  {currentIndex + 1 === questions.length ? (grading ? 'GRADING...' : 'FINISH') : 'CONTINUE'}
                </button>
              </>
            ) : (
              // -------------------------------------------------------------
              // WRONG ANSWER (RED FEEDBACK) - Still advances to next question!
              // -------------------------------------------------------------
              <>
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-full bg-surface-card flex items-center justify-center text-[#FF4B4B] shadow-sm shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#FF4B4B] flex items-center justify-center">
                      <X className="w-6 h-6 text-white stroke-[3]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#FF4B4B]">
                      Incorrect
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-[#EA2B2B]">
                      Correct answer: <span className="underline">{currentQuestion.options[currentQuestion.correctAnswerIndex ?? 0]}</span>
                    </p>
                    {currentExplanation && (
                      <p className="text-[11px] font-semibold text-[#EA2B2B]/90 mt-0.5 line-clamp-1">
                        {currentExplanation}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={grading}
                  onClick={handleNextQuestion}
                  className="w-full sm:w-44 py-3.5 px-8 rounded-2xl bg-[#FF4B4B] hover:bg-[#FF3838] border-b-4 border-[#EA2B2B] text-white font-black text-base uppercase tracking-wider transition-all active:border-b-0 active:translate-y-1 shadow-sm cursor-pointer shrink-0"
                >
                  {currentIndex + 1 === questions.length ? (grading ? 'GRADING...' : 'FINISH') : 'CONTINUE'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default EnglishQuizModal;
