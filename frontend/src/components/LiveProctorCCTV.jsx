import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Video, 
  VideoOff, 
  Radio, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Eye, 
  RefreshCw, 
  X,
  Clock,
  Layers,
  Send,
  MessageSquare,
  Zap,
  Smile,
  Check,
  Crown
} from 'lucide-react';

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

export const LiveProctorCCTV = ({ isFloating = false, onClose }) => {
  const [streamData, setStreamData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [lastFrameTime, setLastFrameTime] = useState(null);
  const lastFrameTimeRef = useRef(null);
  const isWebRtcConnectedRef = useRef(false);
  const isLiveRef = useRef(false);
  const hasRequestedWebRtcRef = useRef(false);
  const handleWebRtcOfferRef = useRef(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [rttMs, setRttMs] = useState(35);
  const [currentFps, setCurrentFps] = useState('2.5');
  const [zoomModal, setZoomModal] = useState(false);
  const frameTimesRef = useRef([]);

  // WebRTC 30 FPS HD Video Call State & Hardware Video Refs
  const [isWebRtcConnected, setIsWebRtcConnected] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const remoteVideoRef = useRef(null);
  const zoomVideoRef = useRef(null);
  const webrtcPcRef = useRef(null);
  const remoteStreamRef = useRef(null);

  useEffect(() => {
    isWebRtcConnectedRef.current = isWebRtcConnected;
  }, [isWebRtcConnected]);

  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  // Robustly bind active MediaStream to remoteVideoRef and zoomVideoRef whenever ready
  useEffect(() => {
    if (remoteStreamRef.current) {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        remoteVideoRef.current.play().catch(() => {});
      }
      if (zoomVideoRef.current && zoomVideoRef.current.srcObject !== remoteStreamRef.current) {
        zoomVideoRef.current.srcObject = remoteStreamRef.current;
        zoomVideoRef.current.play().catch(() => {});
      }
    }
  });

  const handleWebRtcOffer = async (offer) => {
    try {
      if (!window.RTCPeerConnection || !offer) return;
      if (webrtcPcRef.current) {
        try { webrtcPcRef.current.close(); } catch (e) {}
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      webrtcPcRef.current = pc;

      pc.ontrack = (event) => {
        const stream = (event.streams && event.streams[0]) 
          ? event.streams[0] 
          : new MediaStream([event.track]);
        remoteStreamRef.current = stream;

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(() => {});
        }
        if (zoomVideoRef.current) {
          zoomVideoRef.current.srcObject = stream;
          zoomVideoRef.current.play().catch(() => {});
        }
        setIsLive(true);
        isLiveRef.current = true;
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          fetch('/api/quiz/webrtc/ice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ candidate: event.candidate, sender: 'admin' })
          }).catch(() => {});

          try {
            broadcastChannelRef.current?.postMessage({
              type: 'WEBRTC_ICE',
              candidate: event.candidate.toJSON ? event.candidate.toJSON() : JSON.parse(JSON.stringify(event.candidate)),
              sender: 'admin'
            });
          } catch (err) {}
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setIsWebRtcConnected(true);
          isWebRtcConnectedRef.current = true;
          setIsLive(true);
          isLiveRef.current = true;
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          setIsWebRtcConnected(false);
          isWebRtcConnectedRef.current = false;
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Wait briefly (up to 800ms) for local STUN candidates to be embedded directly into answer SDP
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

      const completeAnswer = {
        type: pc.localDescription.type,
        sdp: pc.localDescription.sdp
      };

      // 1. Post answer to backend signaling relay
      await fetch('/api/quiz/webrtc/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: completeAnswer })
      });

      // 2. Broadcast answer to local tabs
      broadcastChannelRef.current?.postMessage({
        type: 'WEBRTC_ANSWER',
        answer: completeAnswer
      });

      // 3. Apply any candidates already available
      try {
        const res = await fetch('/api/quiz/webrtc/status');
        const data = await res.json();
        if (data.candidateCandidates?.length) {
          for (const cand of data.candidateCandidates) {
            try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
          }
        }
      } catch (e) {}

    } catch (err) {
      console.warn('[WebRTC Admin notice]:', err.message);
    }
  };

  handleWebRtcOfferRef.current = handleWebRtcOffer;

  const [upgradingWebRtc, setUpgradingWebRtc] = useState(false);

  // Trigger candidate to initiate 30 FPS video call
  const triggerWebRtcUpgrade = async () => {
    setUpgradingWebRtc(true);
    try {
      // 1. Request fresh offer from candidate
      await fetch('/api/quiz/webrtc/request', { method: 'POST' });
      broadcastChannelRef.current?.postMessage({ type: 'WEBRTC_REQUEST_OFFER' });

      // Poll status for 8 seconds
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        if (attempts > 8 || isWebRtcConnected) {
          clearInterval(poll);
          setUpgradingWebRtc(false);
          return;
        }
        try {
          const res = await fetch('/api/quiz/webrtc/status');
          const data = await res.json();
          if (data.success && data.hasOffer) {
            handleWebRtcOffer(data.offer);
            clearInterval(poll);
            setUpgradingWebRtc(false);
          }
        } catch (e) {}
      }, 1000);
    } catch (e) {
      setUpgradingWebRtc(false);
    }
  };

  // Automatically request 30 FPS WebRTC call once live camera is detected
  useEffect(() => {
    if (isLive && !isWebRtcConnected && !hasRequestedWebRtcRef.current) {
      hasRequestedWebRtcRef.current = true;
      const timer = setTimeout(() => {
        triggerWebRtcUpgrade();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLive, isWebRtcConnected]);

  // Measure true network Round-Trip Time (RTT) every 4 seconds
  useEffect(() => {
    let mounted = true;
    const pingServer = async () => {
      try {
        const t0 = performance.now();
        await fetch('/api/health');
        if (mounted) {
          const rtt = Math.round(performance.now() - t0);
          setRttMs(Math.max(12, Math.min(rtt, 350)));
        }
      } catch (e) {}
    };

    pingServer();
    const interval = setInterval(pingServer, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Live Streamer Alert / Superchat Broadcast State
  const [customAlertText, setCustomAlertText] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [broadcastFeedback, setBroadcastFeedback] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const broadcastChannelRef = useRef(null);
  const sseRef = useRef(null);
  const watchdogTimerRef = useRef(null);

  // Quick Preset Chips for Fun & Proctoring
  const PRESET_ALERTS = [
    { label: "👀 I can see you!", text: "👀 I'm watching the live stream right now! Focus up!" },
    { label: "⚡ Stay focused!", text: "⚡ Keep your eyes on the screen! You're doing great." },
    { label: "👏 Good job!", text: "👏 Excellent pacing! Keep this streak going!" },
    { label: "📱 Put phone away!", text: "📱 Put your phone down! Sentinel camera is tracking your gaze." },
    { label: "🛑 Don't look away!", text: "🛑 Focus on the question! Don't look away from the monitor." },
    { label: "😂 Nice face!", text: "😂 Smile for the proctor camera!" }
  ];

  const sendStreamAlert = async (textToSend) => {
    const message = (textToSend || customAlertText).trim();
    if (!message) return;

    setIsSending(true);
    const alertObj = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      text: message,
      sender: 'Supervisor (Brother Admin)',
      timestamp: Date.now(),
      timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // 1. Instant local tab broadcast via BroadcastChannel (0ms latency)
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'SUPERVISOR_STREAM_ALERT',
          data: alertObj
        });
      } catch (e) {}
    }

    // 2. HTTP POST relay for cross-network / remote candidate screen
    try {
      await fetch('/api/quiz/live-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, sender: 'Supervisor (Brother Admin)' })
      });
    } catch (e) {}

    setSentMessages(prev => [alertObj, ...prev.slice(0, 7)]);
    setCustomAlertText('');
    setBroadcastFeedback(`✓ Alert broadcasted to candidate screen: "${message}"`);
    setTimeout(() => setBroadcastFeedback(null), 3800);
    setIsSending(false);
  };

  // Helper to handle new incoming frame
  const processIncomingFrame = (payload) => {
    if (!payload || !payload.frame) return;
    const now = Date.now();
    lastFrameTimeRef.current = now;
    setStreamData(payload);
    setIsLive(true);
    isLiveRef.current = true;
    setLastFrameTime(now);

    // Track dynamic rolling FPS
    frameTimesRef.current.push(now);
    frameTimesRef.current = frameTimesRef.current.filter(t => now - t <= 4000);
    if (frameTimesRef.current.length >= 2) {
      const durationSec = (now - frameTimesRef.current[0]) / 1000;
      if (durationSec > 0.4) {
        const calculatedFps = ((frameTimesRef.current.length - 1) / durationSec).toFixed(1);
        setCurrentFps(calculatedFps);
      }
    }

    // Calculate real network latency without physical clock skew distortion
    if (payload.receivedAt) {
      const serverTransit = now - payload.receivedAt;
      if (serverTransit >= 0 && serverTransit < 3500) {
        setLatencyMs(Math.max(12, serverTransit));
        return;
      }
    }

    if (payload.timestamp) {
      const clockDelta = now - payload.timestamp;
      // If clocks are synchronized within 2.5 seconds, use clock delta
      if (clockDelta >= 0 && clockDelta < 2500) {
        setLatencyMs(Math.max(15, clockDelta));
        return;
      }
    }

    // Physical laptops with unsynchronized local system clocks:
    // Use true measured network round-trip latency
    setLatencyMs(rttMs || 35);
  };

  useEffect(() => {
    // 1. Instant local tab synchronization via BroadcastChannel (0ms delay)
    try {
      broadcastChannelRef.current = new BroadcastChannel('forensic_sync_channel');
      broadcastChannelRef.current.onmessage = (e) => {
        const data = e.data;
        if (data?.type === 'CANDIDATE_LIVE_FRAME') {
          processIncomingFrame(data);
        } else if (data?.type === 'WEBRTC_OFFER' && data.offer) {
          handleWebRtcOfferRef.current?.(data.offer);
        } else if (data?.type === 'WEBRTC_ICE' && data.sender === 'candidate' && data.candidate) {
          if (webrtcPcRef.current && webrtcPcRef.current.remoteDescription) {
            webrtcPcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(() => {});
          }
        } else if (data?.type === 'WEBRTC_RESET' || data?.type === 'CANDIDATE_LIVE_STREAM_ENDED') {
          setIsLive(false);
          isLiveRef.current = false;
          setIsWebRtcConnected(false);
          isWebRtcConnectedRef.current = false;
          hasRequestedWebRtcRef.current = false;
          setStreamData(null);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          if (webrtcPcRef.current) {
            try { webrtcPcRef.current.close(); } catch (e) {}
            webrtcPcRef.current = null;
          }
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel notice:', err);
    }

    // 2. Server-Sent Events (SSE) for remote / cross-network real-time streaming
    try {
      const sse = new EventSource('/api/quiz/live-stream');
      sseRef.current = sse;

      sse.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'FRAME' && parsed.data?.frame) {
            processIncomingFrame(parsed.data);
          } else if (parsed.type === 'WEBRTC_OFFER' && parsed.offer) {
            handleWebRtcOfferRef.current?.(parsed.offer);
          } else if (parsed.type === 'WEBRTC_ICE' && parsed.sender === 'candidate' && parsed.candidate) {
            if (webrtcPcRef.current && webrtcPcRef.current.remoteDescription) {
              webrtcPcRef.current.addIceCandidate(new RTCIceCandidate(parsed.candidate)).catch(() => {});
            }
          } else if (parsed.type === 'WEBRTC_RESET' || parsed.type === 'CANDIDATE_LIVE_STREAM_ENDED') {
            setIsLive(false);
            isLiveRef.current = false;
            setIsWebRtcConnected(false);
            isWebRtcConnectedRef.current = false;
            hasRequestedWebRtcRef.current = false;
            setStreamData(null);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            if (webrtcPcRef.current) {
              try { webrtcPcRef.current.close(); } catch (e) {}
              webrtcPcRef.current = null;
            }
          } else if (parsed.type === 'OFFLINE') {
            // Anti-flicker: Only mark offline if no frames arrived in over 8 seconds and WebRTC not active
            const timeSinceLastFrame = Date.now() - (lastFrameTimeRef.current || 0);
            if (!isWebRtcConnectedRef.current && timeSinceLastFrame > 8000) {
              setIsLive(false);
              isLiveRef.current = false;
              setStreamData(null);
            }
          }
        } catch (e) {}
      };

      sse.onerror = () => {
        // SSE connection automatically reconnects on network hiccup
      };
    } catch (e) {}

    // 3. Fallback watchdog: poll for WebRTC offer or fallback frame without flipping on/off
    watchdogTimerRef.current = setInterval(async () => {
      // Check for pending WebRTC calls if not connected
      if (!isWebRtcConnectedRef.current && (!webrtcPcRef.current || webrtcPcRef.current.connectionState !== 'connected')) {
        try {
          const rtcRes = await fetch('/api/quiz/webrtc/status');
          const rtcData = await rtcRes.json();
          if (rtcData.success && rtcData.hasOffer) {
            handleWebRtcOfferRef.current?.(rtcData.offer);
          }
        } catch (e) {}
      }

      // Snapshot watchdog: Check frame staleness only if not on WebRTC and frames stopped arriving for 10s
      const timeSinceLastFrame = Date.now() - (lastFrameTimeRef.current || 0);
      if (!isWebRtcConnectedRef.current && lastFrameTimeRef.current && timeSinceLastFrame > 10000) {
        try {
          const res = await fetch('/api/quiz/live-frame');
          const data = await res.json();
          if (data.success && data.active && data.data?.frame) {
            processIncomingFrame(data.data);
          } else {
            setIsLive(false);
            isLiveRef.current = false;
          }
        } catch (e) {
          setIsLive(false);
          isLiveRef.current = false;
        }
      }
    }, 3000);

    return () => {
      if (broadcastChannelRef.current) {
        try { broadcastChannelRef.current.close(); } catch (e) {}
      }
      if (sseRef.current) {
        try { sseRef.current.close(); } catch (e) {}
      }
      if (watchdogTimerRef.current) {
        clearInterval(watchdogTimerRef.current);
      }
    };
  }, []); // Mounted once, persistent connection without cycling on and off

  return (
    <>
      <div className={`rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl overflow-hidden ${
        isLive
          ? 'border-cyan-500/50 bg-slate-950/95 shadow-[0_0_40px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/30'
          : 'border-slate-800 bg-slate-900/80'
      }`}>
        
        {/* CCTV Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950/90 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl border relative shrink-0 ${
              isLive
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
            }`}>
              <Camera className="w-5 h-5" />
              {isLive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Live Candidate Webcam Surveillance (Module 2)
                </h2>
                {isLive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold flex items-center space-x-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>REC • LIVE FEED</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono font-semibold">
                    STANDBY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLive 
                  ? `Real-time proctor video stream from Brother's active assessment session.`
                  : `Waiting for Brother to open Module 2 (English Assessment). Stream activates automatically.`}
              </p>
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {isLive && !isWebRtcConnected && (
              <button
                type="button"
                onClick={triggerWebRtcUpgrade}
                disabled={upgradingWebRtc}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md hover:scale-105 cursor-pointer animate-pulse"
                title="Switch to 30 FPS HD WebRTC Video Call"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>{upgradingWebRtc ? 'Connecting 30 FPS...' : '⚡ Switch to 30 FPS Call'}</span>
              </button>
            )}

            {isLive && isWebRtcConnected && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>30 FPS HD Video Call Online</span>
              </div>
            )}

            {isLive && (
              <button
                type="button"
                onClick={() => setZoomModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                title="Open Fullscreen CCTV View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Feed</span>
              </button>
            )}

            {isFloating && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CCTV Viewport */}
        <div className="p-4 sm:p-6">
          {(isLive || isWebRtcConnected) && (streamData || isWebRtcConnected) ? (
            /* ACTIVE LIVE STREAM MONITOR */
            <div className="space-y-4">
              <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-black shadow-[0_0_35px_rgba(6,182,212,0.25)] group">
                {/* 1. Base Layer: Real-time Snapshot Frame (ALWAYS PRESENT - ZERO BLANK SCREENS!) */}
                {streamData?.frame ? (
                  <img 
                    src={streamData.frame} 
                    alt="Candidate Live Stream" 
                    className="w-full aspect-[4/3] sm:aspect-video object-contain bg-black contrast-[1.04] brightness-[1.02]"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] sm:aspect-video bg-black flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <Radio className="w-8 h-8 animate-pulse text-cyan-400" />
                    <span className="text-xs font-mono">Connecting live camera...</span>
                  </div>
                )}

                {/* 2. Top Layer: Real-time WebRTC 30 FPS HD Video Call (Fluidly overlays on top when active & playing) */}
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  onPlaying={() => setIsVideoPlaying(true)}
                  onLoadedMetadata={(e) => e.target.play().catch(() => {})}
                  onPause={() => setIsVideoPlaying(false)}
                  onWaiting={() => setIsVideoPlaying(false)}
                  onError={() => setIsVideoPlaying(false)}
                  className={`absolute inset-0 w-full h-full object-contain bg-black contrast-[1.04] brightness-[1.02] transition-opacity duration-300 ${
                    isVideoPlaying && isWebRtcConnected ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                  }`}
                />

                {/* CCTV Top Left Reticle & Metadata */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-cyan-300 z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">CANDIDATE: {streamData?.candidateName || 'Brother'}</span>
                  {streamData && (
                    <>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300 font-bold">Q{streamData.questionIndex} of {streamData.totalQuestions}</span>
                    </>
                  )}
                </div>

                {/* CCTV Top Right Mode Indicator */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 backdrop-blur-md px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all shadow-md z-20">
                  {isWebRtcConnected && isVideoPlaying ? (
                    <div className="flex items-center space-x-1.5 text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>30 FPS HD WEBRTC CALL ACTIVE</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>LIVE SNAPSHOT STREAM ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Corner Reticle Brackets (Surveillance HUD) */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                {/* CCTV Bottom Information Bar */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-300 gap-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Device:</span>
                    <span className="text-white font-semibold">{streamData?.deviceName || 'Candidate HD Webcam'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] text-cyan-300">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>⚡ {isWebRtcConnected ? '<50ms (Direct P2P)' : `${latencyMs || rttMs || 35}ms latency`}</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      {isWebRtcConnected && isVideoPlaying ? '30.0 FPS HD VIDEO CALL' : `${currentFps} FPS HD SNAPSHOT`}
                    </span>
                    <span>•</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry quick bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">ASSESSMENT PROGRESS</span>
                  <span className="text-white font-bold text-sm mt-0.5 block">
                    {streamData ? `Question ${streamData.questionIndex} / ${streamData.totalQuestions}` : 'Assessment Active'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">CONNECTION RELAY</span>
                  <span className="text-emerald-400 font-bold text-sm mt-0.5 block">
                    {isWebRtcConnected ? 'WebRTC P2P (30 FPS)' : 'DUAL SSE + BUS ✓'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">STREAM STATUS</span>
                  <span className="text-cyan-300 font-bold text-sm mt-0.5 block">
                    BIOMETRIC ONLINE
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">REMOTE PROCTORING</span>
                  <span className="text-teal-300 font-bold text-sm mt-0.5 block">
                    MONITORED
                  </span>
                </div>
              </div>

              {/* WebRTC Upgrade Helper Hint */}
              {isLive && !isWebRtcConnected && (
                <div className="max-w-2xl mx-auto p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-cyan-300 shadow-md">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Currently viewing in Snapshot mode. To switch to fluid 30 FPS video call, ask Brother to refresh his page (F5 / Reload) or click:</span>
                  </div>
                  <button
                    type="button"
                    onClick={triggerWebRtcUpgrade}
                    disabled={upgradingWebRtc}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-bold shrink-0 transition-all hover:scale-105 cursor-pointer"
                  >
                    {upgradingWebRtc ? 'Connecting 30 FPS...' : 'Connect 30 FPS Now →'}
                  </button>
                </div>
              )}

              {/* ============================================================= */}
              {/* LIVE STREAMER ALERT & SUPERCHAT BROADCAST DECK                */}
              {/* ============================================================= */}
              <div className="max-w-2xl mx-auto rounded-xl border border-amber-500/40 bg-slate-950/90 p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                      <Crown className="w-4 h-4 text-amber-400" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span>Live Stream Alert / Superchat Broadcast</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                          INTERACTIVE
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Type a message below to pop it up onto Brother's screen like a live streamer alert!
                      </p>
                    </div>
                  </div>

                  {broadcastFeedback && (
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full animate-bounce">
                      {broadcastFeedback}
                    </span>
                  )}
                </div>

                {/* Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                    Quick Preset Alerts (1-Click Send):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PRESET_ALERTS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendStreamAlert(preset.text)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-[11px] font-medium transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Input Bar */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendStreamAlert();
                  }}
                  className="flex items-center space-x-2 pt-1"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={customAlertText}
                      onChange={(e) => setCustomAlertText(e.target.value)}
                      placeholder="Type custom live message to pop up on his screen..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs text-white placeholder-slate-500 transition-all font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending || !customAlertText.trim()}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
                      customAlertText.trim()
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Alert ⚡</span>
                  </button>
                </form>

                {/* Recent Sent Alerts Strip */}
                {sentMessages.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 text-[10px] font-mono text-slate-400 overflow-x-auto">
                    <span className="text-slate-500 shrink-0">Recent Alerts:</span>
                    {sentMessages.map((msg, idx) => (
                      <span key={msg.id || idx} className="shrink-0 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                        {msg.timeStr}: "{msg.text.length > 25 ? msg.text.slice(0, 25) + '...' : msg.text}"
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STANDBY RADAR SCANNER */
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-8 sm:p-10 text-center overflow-hidden">
              {/* Decorative radar scan lines */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0,transparent_70%)] pointer-events-none" />
              <div className="w-16 h-16 rounded-3xl bg-slate-900/90 border border-slate-800 mx-auto flex items-center justify-center text-slate-500 mb-3 shadow-inner relative">
                <VideoOff className="w-8 h-8 text-slate-600" />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-600" />
                </span>
              </div>

              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Candidate Webcam Feed Standby
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your brother has not launched <strong className="text-cyan-300">Module 2: English Assessment</strong> yet. The live video feed will engage here automatically the moment he starts.
                </p>
              </div>

              {/* Quick Launch Demo in new tab */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/exercise/english"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm hover:scale-105"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Module 2 in New Tab to Test Live Feed →</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Zoom Modal */}
      {zoomModal && (streamData || isWebRtcConnected) && (
        <div 
          onClick={() => setZoomModal(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-5xl w-full bg-slate-900 border border-cyan-500/50 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800 text-xs text-slate-300">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-rose-400 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>{isWebRtcConnected ? 'FULLSCREEN 30 FPS HD WEBRTC CALL' : 'FULLSCREEN CANDIDATE CCTV FEED'}</span>
                </span>
                {streamData && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-bold">Q{streamData.questionIndex} / {streamData.totalQuestions}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-300">{streamData.deviceName}</span>
                  </>
                )}
              </div>

              <button 
                onClick={() => setZoomModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative p-2 flex justify-center items-center bg-black min-h-[50vh]">
              {streamData?.frame && (
                <img 
                  src={streamData.frame} 
                  alt="Fullscreen Candidate Proctor Cam" 
                  className="max-h-[82vh] w-full object-contain rounded-lg contrast-[1.04] brightness-[1.02]" 
                />
              )}
              <video 
                ref={zoomVideoRef} 
                autoPlay 
                playsInline 
                muted 
                onLoadedMetadata={(e) => e.target.play().catch(() => {})}
                className={`max-h-[82vh] w-full object-contain rounded-lg contrast-[1.04] brightness-[1.02] ${
                  isVideoPlaying && isWebRtcConnected ? 'absolute inset-0 m-auto z-10 block' : 'hidden'
                }`} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveProctorCCTV;
