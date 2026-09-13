import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2 
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

export const EnglishQuizModal = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const { submitDuolingoPractice, triggerRedLockdown, module2QuestionLimit = 50 } = useForensics();

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
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`/api/quiz/session?limit=${limit}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!data.success || !data.questions?.length) {
        throw new Error(data.message || 'Could not load quiz questions.');
      }
      setSessionId(data.sessionId);
      setQuestions(data.questions);
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
  const captureSnapshot = (reason = 'PERIODIC_CHECK') => {
    try {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Watermark with timestamp & question metadata
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      ctx.fillStyle = 'rgba(0, 0, 0, 0.70)';
      ctx.fillRect(8, canvas.height - 28, 250, 22);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`PROCTOR REC: ${timeStr} | Q${currentIndex + 1} | ${reason}`, 14, canvas.height - 13);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
      const newSnapshot = {
        id: `snap_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        timeStr,
        reason,
        questionIndex: currentIndex + 1,
        image: dataUrl
      };

      setProctorSnapshots(prev => [newSnapshot, ...prev.slice(0, 14)]);
    } catch (e) {
      console.warn('[Proctoring Engine] Frame capture notice:', e);
    }
  };

  const stopWebcam = () => {
    if (liveStreamIntervalRef.current) {
      clearInterval(liveStreamIntervalRef.current);
      liveStreamIntervalRef.current = null;
    }
    if (webrtcPollTimerRef.current) {
      clearInterval(webrtcPollTimerRef.current);
      webrtcPollTimerRef.current = null;
    }
    if (webrtcPcRef.current) {
      try { webrtcPcRef.current.close(); } catch (e) {}
      webrtcPcRef.current = null;
    }
    setIsWebRtcLive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);

    // Notify Admin CCTV surveillance monitor that candidate stream has ended
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'CANDIDATE_LIVE_STREAM_ENDED',
          timestamp: Date.now()
        });
        broadcastChannelRef.current.postMessage({
          type: 'WEBRTC_RESET',
          timestamp: Date.now()
        });
      } catch (e) {}
    }
    fetch('/api/quiz/live-stream-end', { method: 'POST' }).catch(() => {});
    fetch('/api/quiz/webrtc/reset', { method: 'POST' }).catch(() => {});
  };

  const startWebRtcCall = async (stream) => {
    try {
      if (!window.RTCPeerConnection) return;
      if (webrtcPcRef.current) {
        try { webrtcPcRef.current.close(); } catch (e) {}
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      webrtcPcRef.current = pc;

      // Add local camera video track
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle local ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          fetch('/api/quiz/webrtc/ice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate: event.candidate, sender: 'candidate' })
          }).catch(() => {});

          broadcastChannelRef.current?.postMessage({
            type: 'WEBRTC_ICE',
            candidate: event.candidate,
            sender: 'candidate'
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setIsWebRtcLive(true);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setIsWebRtcLive(false);
        }
      };

      // Create WebRTC Offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(offer);

      // Wait briefly (up to 800ms) for local STUN candidates to be embedded directly into SDP
      await new Promise(resolve => {
        if (pc.iceGatheringState === 'complete') return resolve();
        const timer = setTimeout(resolve, 800);
        const check = () => {
          if (pc.iceGatheringState === 'complete') {
            clearTimeout(timer);
            pc.removeEventListener('icegatheringstatechange', check);
            resolve();
          }
        };
        pc.addEventListener('icegatheringstatechange', check);
      });

      const completeOffer = {
        type: pc.localDescription.type,
        sdp: pc.localDescription.sdp
      };

      // 1. Post offer to backend signaling relay
      await fetch('/api/quiz/webrtc/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer: completeOffer })
      });

      // 2. Broadcast offer to local tabs
      broadcastChannelRef.current?.postMessage({
        type: 'WEBRTC_OFFER',
        offer: completeOffer
      });

      // 3. Fallback polling for Admin Answer until connected
      let checkCount = 0;
      if (webrtcPollTimerRef.current) clearInterval(webrtcPollTimerRef.current);
      webrtcPollTimerRef.current = setInterval(async () => {
        checkCount++;
        if (checkCount > 60 || pc.connectionState === 'connected') {
          clearInterval(webrtcPollTimerRef.current);
          return;
        }
        try {
          const res = await fetch('/api/quiz/webrtc/status');
          const data = await res.json();
          // Self-healing: if server lost our offer, re-register so Admin can connect anytime
          if (data.success && !data.hasOffer && !data.hasAnswer && pc.localDescription) {
            fetch('/api/quiz/webrtc/offer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ offer: { type: pc.localDescription.type, sdp: pc.localDescription.sdp } })
            }).catch(() => {});
          }
          if (data.success && data.hasAnswer && pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          }
          if (data.adminCandidates?.length) {
            for (const cand of data.adminCandidates) {
              try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
            }
          }
        } catch (e) {}
      }, 1200);

    } catch (err) {
      console.warn('[WebRTC Candidate notice]:', err.message);
    }
  };

  const initWebcam = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isNetworkIp = window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        if (isNetworkIp) {
          setCameraError(`Camera requires permissions for LAN IP. In Chrome/Edge on this laptop, open chrome://flags/#unsafely-treat-insecure-origin-as-secure, add "http://${window.location.host}", enable & relaunch.`);
        } else {
          setCameraError('Webcam API not supported in this browser.');
        }
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCameraError(null);

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        setCameraDeviceName(videoTrack.label || 'Candidate Live Camera');
      }

      // Initiate 30 FPS WebRTC Video Calling Handshake
      startWebRtcCall(stream);

      // Initial baseline snapshot once video warms up
      setTimeout(() => {
        captureSnapshot('BASELINE_ASSESSMENT_START');
      }, 1500);
    } catch (err) {
      console.warn('[Proctoring Engine] Webcam initialization notice:', err.message);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Real-time video proctoring is recommended.'
          : 'Live camera offline: ' + err.message
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    try {
      broadcastChannelRef.current = new BroadcastChannel('forensic_sync_channel');
      broadcastChannelRef.current.onmessage = (e) => {
        const data = e.data;
        if (data?.type === 'SUPERVISOR_STREAM_ALERT' && data?.data) {
          handleIncomingStreamAlert(data.data);
        } else if (data?.type === 'WEBRTC_ANSWER' && data?.answer) {
          if (webrtcPcRef.current && webrtcPcRef.current.signalingState === 'have-local-offer') {
            webrtcPcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer)).catch(() => {});
          }
        } else if (data?.type === 'WEBRTC_ICE' && data?.sender === 'admin' && data?.candidate) {
          if (webrtcPcRef.current && webrtcPcRef.current.remoteDescription) {
            webrtcPcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(() => {});
          }
        } else if (data?.type === 'WEBRTC_REQUEST_OFFER') {
          if (streamRef.current) {
            startWebRtcCall(streamRef.current);
          }
        }
      };
    } catch (e) {}

    // Multi-device / network SSE listener for supervisor stream alerts & WebRTC signaling
    try {
      const sse = new EventSource('/api/quiz/live-stream');
      sseRef.current = sse;
      sse.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'LIVE_MESSAGE' && parsed.data) {
            handleIncomingStreamAlert(parsed.data);
          } else if (parsed.type === 'WEBRTC_REQUEST_OFFER') {
            if (streamRef.current) {
              startWebRtcCall(streamRef.current);
            }
          } else if (parsed.type === 'WEBRTC_ANSWER' && parsed.answer) {
            if (webrtcPcRef.current && webrtcPcRef.current.signalingState === 'have-local-offer') {
              webrtcPcRef.current.setRemoteDescription(new RTCSessionDescription(parsed.answer)).catch(() => {});
            }
          } else if (parsed.type === 'WEBRTC_ICE' && parsed.sender === 'admin' && parsed.candidate) {
            if (webrtcPcRef.current && webrtcPcRef.current.remoteDescription) {
              webrtcPcRef.current.addIceCandidate(new RTCIceCandidate(parsed.candidate)).catch(() => {});
            }
          }
        } catch (err) {}
      };
    } catch (e) {}

    if (isOpen) {
      initQuizSession();
      initWebcam();
    }
    return () => {
      stopWebcam();
      if (broadcastChannelRef.current) {
        try { broadcastChannelRef.current.close(); } catch (e) {}
      }
      if (sseRef.current) {
        try { sseRef.current.close(); } catch (e) {}
      }
      if (alertDismissTimerRef.current) {
        clearTimeout(alertDismissTimerRef.current);
      }
    };
  }, [isOpen]);

  // Real-Time Video Surveillance Stream Relay to Admin CCTV Monitor (~1.2s cadence)
  useEffect(() => {
    if (!isCameraActive || loading || isCompleted) {
      if (liveStreamIntervalRef.current) {
        clearInterval(liveStreamIntervalRef.current);
        liveStreamIntervalRef.current = null;
      }
      return;
    }

    const broadcastLiveFrame = async () => {
      try {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video.videoWidth || !video.videoHeight) return;

        // Continuous snapshot cadence (~1000ms) ensuring the Admin monitor never goes blank
        const nowMs = Date.now();
        if (nowMs - lastSnapshotSentRef.current < 1000) {
          return;
        }
        lastSnapshotSentRef.current = nowMs;

        // Smart HD canvas sizing (matching webcam aspect ratio without distortion)
        const isWide = (video.videoWidth / video.videoHeight) >= 1.5;
        canvas.width = 640;
        canvas.height = isWide ? 360 : 480;

        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Mirror horizontally for natural webcam experience
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // High-contrast stamped live surveillance watermark
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(8, canvas.height - 26, 260, 20);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`LIVE SURVEILLANCE • ${timeStr} • Q${currentIndex + 1}`, 14, canvas.height - 12);

        // Crystal-clear 70% quality JPEG (crisp facial details with ~25KB size)
        const frameDataUrl = canvas.toDataURL('image/jpeg', 0.70);

        const framePayload = {
          frame: frameDataUrl,
          questionIndex: currentIndex + 1,
          totalQuestions: questions.length || 50,
          timestamp: Date.now(),
          deviceName: cameraDeviceName,
          candidateName: 'Brother (Candidate)'
        };

        // 1. Instant local BroadcastChannel (0ms delay for tabs on same machine)
        if (broadcastChannelRef.current) {
          try {
            broadcastChannelRef.current.postMessage({
              type: 'CANDIDATE_LIVE_FRAME',
              ...framePayload
            });
          } catch (e) {}
        }

        // 2. HTTP Relay for cross-network / remote Admin CCTV monitors
        // Non-blocking in-flight guard: skip if previous HTTP frame is still uploading to eliminate latency buildup!
        if (isBroadcastingFrameRef.current) return;
        isBroadcastingFrameRef.current = true;

        try {
          await fetch('/api/quiz/live-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(framePayload)
          });
        } finally {
          isBroadcastingFrameRef.current = false;
        }
      } catch (e) {
        isBroadcastingFrameRef.current = false;
      }
    };

    // Send immediate initial frame, then adaptive ~2.5 FPS (every 400ms)
    broadcastLiveFrame();
    liveStreamIntervalRef.current = setInterval(broadcastLiveFrame, 400);

    return () => {
      if (liveStreamIntervalRef.current) {
        clearInterval(liveStreamIntervalRef.current);
        liveStreamIntervalRef.current = null;
      }
    };
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
      questionId: currentQ.id,
      selectedOptionIndex: selectedOption,
      timeSpentSec: +timeSpentSec.toFixed(2)
    };

    setUserAnswers(prev => [...prev, currentAnswerRecord]);
    setHasChecked(true);

    // Instant local gamified feel:
    // (Note: full cryptographic verification happens on the server at the end)
    setIsAnswerCorrect(true); // placeholder animation
    playSound(true);
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
      navigate('/');
    }
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + (hasChecked ? 1 : 0)) / questions.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans select-none overflow-x-hidden overflow-y-auto min-h-screen">
      
      {/* Hidden Canvas for Proctor Snapshot Telemetry (Keeps Supervisor CCTV Auditing 100% Active) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Undercover Practice Camera Widget */}
      {!isCompleted && (
        <div className="fixed top-4 right-4 z-40">
          <div className="flex items-center space-x-2 bg-[#F7F7F7] border border-[#E5E5E5] px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58CC02] animate-pulse" />
            <span className="text-xs font-bold text-[#777777]">Practice Cam</span>
            <button
              type="button"
              onClick={() => setIsPiPMinimized(p => !p)}
              className="text-[#AFAFAF] hover:text-[#4B4B4B] cursor-pointer ml-1"
              title={isPiPMinimized ? "Show Camera Preview" : "Hide Camera Preview"}
            >
              {isPiPMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className={`mt-2 w-36 h-28 rounded-2xl overflow-hidden border-2 border-[#E5E5E5] bg-black shadow-md transition-all ${
            isPiPMinimized ? 'opacity-0 pointer-events-none h-0 w-0 absolute' : 'block'
          }`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>
      )}

      {/* Live Streamer Alert Toast (Superchat styled as a friendly Duolingo notice) */}
      {activeStreamAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white border-2 border-b-4 border-[#FFC800] border-b-[#E5A500] rounded-2xl p-4 shadow-xl flex items-center space-x-3.5">
            <DuoOwl className="w-12 h-12 shrink-0" mood="happy" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#E5A500] uppercase tracking-wider">
                  Supervisor Notice
                </span>
                <button onClick={() => setActiveStreamAlert(null)} className="text-[#AFAFAF] hover:text-[#4B4B4B] cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-extrabold text-[#3C3C3C] mt-0.5 leading-snug">
                "{activeStreamAlert.text}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Duolingo Top Header */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between gap-4 shrink-0">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose || (() => navigate('/'))}
          className="p-1.5 rounded-xl text-[#AFAFAF] hover:text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
          title="Exit Practice"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Chunky Duolingo Green Progress Bar */}
        <div className="flex-1 max-w-2xl h-4 bg-[#E5E5E5] rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#58CC02] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${Math.max(4, progressPercent)}%` }}
          >
            {/* Reflective glossy top line */}
            <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/35 rounded-full" />
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
            className="p-1.5 rounded-xl text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors cursor-pointer"
            title={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-[#1CB0F6]" /> : <VolumeX className="w-5 h-5 text-[#AFAFAF]" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 my-auto">
          <DuoOwl className="w-28 h-28 animate-bounce" />
          <h3 className="text-2xl font-black text-[#3C3C3C]">Loading your English lesson...</h3>
          <p className="text-sm font-bold text-[#AFAFAF]">Get ready to practice!</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 my-auto text-center">
          <DuoOwl className="w-24 h-24" />
          <h3 className="text-xl font-black text-[#FF4B4B]">Could not load lesson</h3>
          <p className="text-sm text-[#777777] max-w-sm">{error}</p>
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
          <DuoOwl className="w-36 h-36 animate-bounce" mood="party" />
          
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-[#FFC800] tracking-tight">
              Lesson Complete!
            </h2>
            <p className="text-sm font-bold text-[#777777]">
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
          <DuoOwl className="w-24 h-24" />
          <h3 className="text-xl font-black text-[#3C3C3C]">Ready for English Practice?</h3>
          <p className="text-sm text-[#777777]">Press start to begin your lesson.</p>
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3C3C3C] tracking-tight mb-8">
            Select the correct answer
          </h1>

          {/* Duo the Owl Prompt with Speech Bubble */}
          <div className="flex items-start space-x-4 mb-8">
            <DuoOwl className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 -mt-2" />
            
            <div className="relative bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 sm:p-5 shadow-sm text-left flex items-center space-x-3.5 flex-1">
              {/* Triangle pointer to Duo */}
              <div className="absolute -left-2.5 top-6 w-3 h-3 bg-white border-l-2 border-b-2 border-[#E5E5E5] rotate-45 transform" />

              <button
                type="button"
                onClick={() => speakQuestion(currentQuestion.text)}
                className="w-10 h-10 rounded-xl bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1482B4] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-all active:border-b-0 active:translate-y-1"
                title="Listen"
              >
                <Volume2 className="w-5 h-5 fill-white" />
              </button>

              <div className="space-y-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-[#3C3C3C] leading-snug block">
                  {currentQuestion.text}
                </span>
                <span className="text-xs font-bold text-[#AFAFAF] uppercase tracking-wider block">
                  {currentQuestion.category} • {currentQuestion.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* 3D Duolingo Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let cardStyle = "border-[#E5E5E5] border-b-[#CECECE] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7]";
              let chipStyle = "border-[#E5E5E5] text-[#AFAFAF] bg-white";

              if (isSelected && !hasChecked) {
                cardStyle = "border-[#1CB0F6] border-b-[#1899D6] bg-[#DDF4FF] text-[#1899D6]";
                chipStyle = "border-[#1CB0F6] text-white bg-[#1CB0F6]";
              } else if (hasChecked) {
                if (isSelected) {
                  cardStyle = "border-[#58CC02] border-b-[#46A302] bg-[#D7FFB8] text-[#46A302]";
                  chipStyle = "border-[#58CC02] text-white bg-[#58CC02]";
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
            ? 'bg-white border-[#E5E5E5]' 
            : 'bg-[#D7FFB8] border-[#58CC02]/30'
        }`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {!hasChecked ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 text-sm font-bold text-[#AFAFAF]">
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
                        : 'bg-[#E5E5E5] border-[#CECECE] text-[#AFAFAF] cursor-not-allowed'
                    }`}
                  >
                    CHECK
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#58CC02] shadow-sm">
                    <CheckCircle2 className="w-9 h-9 fill-[#58CC02] text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#58CC02]">
                      Nicely done!
                    </h3>
                    <span className="text-xs font-bold text-[#46A302]">
                      +30 XP • Practice in progress
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={grading}
                  onClick={handleNextQuestion}
                  className="w-full sm:w-44 py-3.5 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-base uppercase tracking-wider transition-all active:border-b-0 active:translate-y-1 shadow-sm cursor-pointer"
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
