import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ForensicContext = createContext(null);

const INITIAL_TASKS = [
  {
    id: 'mod-1-keyboard',
    moduleId: 1,
    type: 'keyboard',
    title: 'Module 1: Keyboard Practice',
    subtitle: 'Secure Text-Entry Terminal UI',
    status: 'PENDING',
    submissionText: '',
    telemetry: null,
    submittedAt: null,
    auditorVerdict: null,
    auditorNotes: '',
    strikesCount: 0
  },
  {
    id: 'mod-2-duolingo',
    moduleId: 2,
    type: 'image_ocr',
    title: 'Module 2: English Practice (Duolingo)',
    subtitle: 'UI Screenshot OCR Verification (Optical Character Recognition Active)',
    status: 'PENDING',
    image: null,
    fileName: '',
    fileSize: '',
    hash: null,
    ocrData: null,
    proctorSnapshots: [],
    submittedAt: null,
    auditorVerdict: null,
    auditorNotes: '',
    strikesCount: 0
  },
  {
    id: 'mod-3-writing',
    moduleId: 3,
    type: 'image_exif',
    title: 'Module 3: Writing Practice',
    subtitle: 'Handwritten Notes (EXIF Extraction & Cryptographic Duplicate Hashing)',
    status: 'PENDING',
    image: null,
    fileName: '',
    fileSize: '',
    hash: null,
    exifData: null,
    submittedAt: null,
    auditorVerdict: null,
    auditorNotes: '',
    strikesCount: 0
  }
];

const INITIAL_NOTIFICATIONS = [];

// Futuristic audio chime
const playCyberChime = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

// Categorize anti-cheat infractions and generate plain-English explanations
export const analyzeBreachReason = (reason = '', details = {}) => {
  const lower = (reason + ' ' + (details?.type || '') + ' ' + (details?.module || '')).toLowerCase();
  
  if (lower.includes('clipboard') || lower.includes('paste')) {
    return {
      category: 'CLIPBOARD_INJECTION',
      categoryLabel: 'Clipboard Injection Attempt',
      title: 'Unauthorized Clipboard Paste Intercepted',
      module: details?.module || 'Module 1: Keyboard Practice',
      severity: 'CRITICAL',
      ruleBroken: 'Rule #1: Strict Organic Keystroke Cadence Enforcement',
      explanation: 'The student attempted to paste copied text into the practice canvas (via Ctrl+V, Command+V, or middle-click). The anti-cheat sentinel prohibits external text injection to guarantee 100% genuine typing practice and authentic muscle memory development.',
      actionTaken: 'Clipboard contents blocked immediately. Emergency Red Lockdown and acoustic siren alarm engaged.'
    };
  }
  
  if (lower.includes('tab switch') || lower.includes('window blur') || lower.includes('navigated away') || lower.includes('focus loss')) {
    const isQuiz = lower.includes('english') || lower.includes('assessment') || (details?.module && details.module.toLowerCase().includes('english'));
    return {
      category: 'WINDOW_BLUR_TAB_SWITCH',
      categoryLabel: 'Focus Loss / Tab Switch',
      title: isQuiz ? 'Assessment Tab Switch / Window Blur' : 'Practice Canvas Focus Lost (Tab Switch)',
      module: details?.module || (isQuiz ? 'Module 2: English Assessment' : 'Module 1: Keyboard Practice'),
      severity: 'CRITICAL',
      ruleBroken: 'Rule #2: Continuous On-Screen Window & Focus Integrity',
      explanation: isQuiz 
        ? 'The student switched tabs, minimized the browser window, or opened a secondary window during the active English Assessment. Uninterrupted focus is required to prevent online lookup of questions, Google searches, or translation aids.'
        : 'The student minimized or navigated away from the active writing terminal. The security perimeter demands undivided attention during the timed practice session.',
      actionTaken: 'Focus loss strike recorded in audit telemetry. Emergency Red Lockdown broadcasted across supervisor terminals.'
    };
  }
  
  if (lower.includes('context menu') || lower.includes('right-click')) {
    return {
      category: 'PROHIBITED_SHORTCUT',
      categoryLabel: 'Context Menu Inspection',
      title: 'Prohibited Right-Click Context Menu Attempt',
      module: details?.module || 'Module 1: Keyboard Practice',
      severity: 'CRITICAL',
      ruleBroken: 'Rule #3: Inspection & DOM Modification Prevention',
      explanation: 'The student right-clicked to access the browser context menu inside the secured workspace. Context menus are locked to prevent inspect-element tampering, browser dev tools access, and right-click paste bypasses.',
      actionTaken: 'Context menu invocation blocked. Incident logged with immediate supervisor siren alert.'
    };
  }
  
  if (lower.includes('binary') || lower.includes('drag') || lower.includes('drop')) {
    return {
      category: 'DRAG_DROP_INJECTION',
      categoryLabel: 'Drag & Drop Bypass',
      title: 'External Drag & Drop Text/File Injection',
      module: details?.module || 'Module 1: Keyboard Practice',
      severity: 'CRITICAL',
      ruleBroken: 'Rule #4: Direct Input Stream Perimeter Defense',
      explanation: 'An attempt was made to drag and drop external text, documents, or files directly into the input canvas to bypass manual typing requirements.',
      actionTaken: 'Dropped contents neutralized. Emergency Red Lockdown triggered.'
    };
  }
  
  if (lower.includes('simulation') || lower.includes('manual') || lower.includes('test')) {
    return {
      category: 'ADMIN_SIMULATION',
      categoryLabel: 'Supervisor Security Drill',
      title: 'Admin Security Drill & Siren Test',
      module: details?.module || 'Admin Surveillance Deck',
      severity: 'TEST_DRILL',
      ruleBroken: 'N/A — Authorized Supervisor Operational Verification Drill',
      explanation: 'An authorized administrator triggered a synthetic Red Lockdown drill from the management console to test siren synthesizers, cross-tab BroadcastChannel synchronization, and disarm protocols.',
      actionTaken: 'Simulated breach broadcast to all active sessions; sirens and red lockdown UI verified operational.'
    };
  }

  return {
    category: 'SECURITY_ANOMALY',
    categoryLabel: 'Security Anomaly',
    title: 'Anti-Cheat Sentinel Perimeter Breach',
    module: details?.module || 'System Perimeter',
    severity: 'HIGH',
    ruleBroken: 'General Integrity & Surveillance Security Policy',
    explanation: reason || 'An unauthorized event breached the real-time anti-cheat surveillance perimeter.',
    actionTaken: 'Security alarm activated; strike logged and sent to supervisor audit queue.'
  };
};

// Realistic Tsunami / Civil Defense Warning Siren Synthesizer
// Simulates the classic 10:12 dual-port rotor horn wail with motor wind-up and continuous undulating pitch curves
const startSirenAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return () => {};
    const ctx = new AudioContextClass();

    const ensureResumed = () => {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    };
    ensureResumed();
    window.addEventListener('pointerdown', ensureResumed, { once: true });
    window.addEventListener('keydown', ensureResumed, { once: true });

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.20, ctx.currentTime);

    // Biquad Filter to mimic acoustic horn resonance and outdoor distance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, ctx.currentTime);
    filter.Q.setValueAtTime(2.2, ctx.currentTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Dual-tone rotors (10:12 port ratio - standard mechanical tsunami & air raid siren)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    gain1.gain.setValueAtTime(0.5, ctx.currentTime);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGain);
    gain2.connect(masterGain);

    // Initial wind-up from low rumble
    const now = ctx.currentTime;
    osc1.frequency.setValueAtTime(220, now);
    osc2.frequency.setValueAtTime(264, now);

    // Ramp up to initial peak over 2.4s
    osc1.frequency.exponentialRampToValueAtTime(620, now + 2.4);
    osc2.frequency.exponentialRampToValueAtTime(744, now + 2.4);

    osc1.start(now);
    osc2.start(now);

    let interval = null;

    // Continuous Undulating Tsunami Wail (3.6s cycle: 1.8s down, 1.8s up)
    const sweepSiren = () => {
      try {
        if (ctx.state === 'closed') return;
        const t = ctx.currentTime;

        // Downward sweep: pitch drops to ~420Hz (10-port) and ~504Hz (12-port)
        osc1.frequency.cancelScheduledValues(t);
        osc2.frequency.cancelScheduledValues(t);
        osc1.frequency.setValueAtTime(osc1.frequency.value || 620, t);
        osc2.frequency.setValueAtTime(osc2.frequency.value || 744, t);

        // Fall over 1.8s
        osc1.frequency.exponentialRampToValueAtTime(420, t + 1.8);
        osc2.frequency.exponentialRampToValueAtTime(504, t + 1.8);

        // Gain dips slightly as air rotor slows down
        masterGain.gain.cancelScheduledValues(t);
        masterGain.gain.setValueAtTime(masterGain.gain.value || 0.20, t);
        masterGain.gain.linearRampToValueAtTime(0.13, t + 1.8);

        // Rise over next 1.8s (back to ~680Hz / ~816Hz)
        osc1.frequency.exponentialRampToValueAtTime(680, t + 3.6);
        osc2.frequency.exponentialRampToValueAtTime(816, t + 3.6);
        masterGain.gain.linearRampToValueAtTime(0.20, t + 3.6);
      } catch (e) {}
    };

    // Start undulating cycle after initial wind-up
    const initialTimer = setTimeout(() => {
      sweepSiren();
      interval = setInterval(sweepSiren, 3600);
    }, 2400);

    return () => {
      window.removeEventListener('pointerdown', ensureResumed);
      window.removeEventListener('keydown', ensureResumed);
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
      try {
        const stopTime = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(stopTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.6);
        osc1.frequency.exponentialRampToValueAtTime(140, stopTime + 0.6);
        osc2.frequency.exponentialRampToValueAtTime(168, stopTime + 0.6);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            ctx.close();
          } catch (e) {}
        }, 650);
      } catch (e) {
        try { ctx.close(); } catch (err) {}
      }
    };
  } catch (e) {
    return () => {};
  }
};

export const ForensicProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('forensic_admin_authenticated') === 'true';
  });

  const [role, setRole] = useState(() => {
    const isAuthed = localStorage.getItem('forensic_admin_authenticated') === 'true';
    if (isAuthed && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'subject';
  });

  const [tasks, setTasks] = useState(() => {
    const isCleaned = localStorage.getItem('forensic_clean_empty_state_v4');
    if (!isCleaned) {
      localStorage.removeItem('forensic_tasks_state');
      localStorage.removeItem('forensic_notifications_state');
      localStorage.removeItem('forensic_strikes_count');
      localStorage.removeItem('forensic_red_lockdown');
      localStorage.removeItem('forensic_active_breach');
      localStorage.setItem('forensic_clean_empty_state_v4', 'true');
      return INITIAL_TASKS;
    }
    try {
      const saved = localStorage.getItem('forensic_tasks_state');
      if (!saved) return INITIAL_TASKS;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 3 && parsed[0]?.id && parsed[1]?.id && parsed[2]?.id) {
        return parsed;
      }
      return INITIAL_TASKS;
    } catch (e) {
      return INITIAL_TASKS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const isCleaned = localStorage.getItem('forensic_clean_empty_state_v4');
      if (!isCleaned) {
        return INITIAL_NOTIFICATIONS;
      }
      const saved = localStorage.getItem('forensic_notifications_state');
      if (!saved) return INITIAL_NOTIFICATIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activePopupNotification, setActivePopupNotification] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('finished');
  const [selectedTaskId, setSelectedTaskId] = useState('mod-1-keyboard');
  const [strikes, setStrikes] = useState(() => {
    const saved = localStorage.getItem('forensic_strikes_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // DAILY SUBMISSION ARCHIVE STATE
  const [archive, setArchive] = useState(() => {
    try {
      const saved = localStorage.getItem('forensic_archive_state');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // -------------------------------------------------------------
  // DAILY CADENCE: 1 DAY = 3 MODULES -> UNLOCKS TOMORROW
  // -------------------------------------------------------------
  const getTodayDateKey = () => new Date().toISOString().split('T')[0];

  const [lastCompletedDateKey, setLastCompletedDateKey] = useState(() => {
    return localStorage.getItem('forensic_last_completed_date') || null;
  });

  const isAllTasksCompleted = tasks.length > 0 && tasks.every(t => t.status === 'SUBMITTED' || t.status === 'VERIFIED');

  // Unlock tasks for tomorrow (or manual admin trigger)
  const unlockNewDayTasks = () => {
    const resetTasks = INITIAL_TASKS.map(t => ({
      ...t,
      status: 'PENDING',
      submissionText: '',
      telemetry: null,
      submittedAt: null,
      auditorVerdict: null,
      auditorNotes: '',
      image: null,
      fileName: '',
      fileSize: '',
      hash: null,
      ocrData: null,
      exifData: null
    }));

    setTasks(resetTasks);
    setLastCompletedDateKey(null);
    localStorage.removeItem('forensic_last_completed_date');
    localStorage.setItem('forensic_tasks_state', JSON.stringify(resetTasks));

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'NEW_DAY_UNLOCKED',
        tasks: resetTasks
      });
    }
  };

  // Automatic midnight / next-day unlock detector:
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getTodayDateKey();
      const savedCompletedDate = localStorage.getItem('forensic_last_completed_date');
      
      // If we had completed yesterday's session and now a new day has arrived:
      if (savedCompletedDate && savedCompletedDate !== today) {
        console.log('[Daily Discipline Engine] New calendar day detected! Unlocking tomorrow tasks for today...');
        unlockNewDayTasks();
      }
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // When all 3 tasks become completed, record today as completed
  useEffect(() => {
    if (isAllTasksCompleted) {
      const today = getTodayDateKey();
      setLastCompletedDateKey(today);
      localStorage.setItem('forensic_last_completed_date', today);
    }
  }, [isAllTasksCompleted]);

  // KEYBOARD PRACTICE SET TARGET TIME (MINUTES)
  const [keyboardTargetMinutes, setKeyboardTargetMinutes] = useState(() => {
    const saved = localStorage.getItem('forensic_target_keyboard_mins');
    return saved ? parseInt(saved, 10) : 10;
  });

  const updateKeyboardTargetMinutes = (mins) => {
    const parsed = Math.max(1, parseInt(mins, 10) || 10);
    setKeyboardTargetMinutes(parsed);
    localStorage.setItem('forensic_target_keyboard_mins', parsed.toString());
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TARGET_TIME_UPDATED',
        targetMinutes: parsed
      });
    }
  };

  // MODULE 2: ENGLISH ASSESSMENT QUESTION LIMIT
  const [module2QuestionLimit, setModule2QuestionLimit] = useState(() => {
    const saved = localStorage.getItem('forensic_module2_question_limit');
    return saved ? parseInt(saved, 10) : 50;
  });

  const updateModule2QuestionLimit = async (limit) => {
    const parsed = Math.max(3, Math.min(100, parseInt(limit, 10) || 50));
    setModule2QuestionLimit(parsed);
    localStorage.setItem('forensic_module2_question_limit', parsed.toString());

    // 1. Broadcast locally across browser tabs
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'MODULE2_LIMIT_UPDATED',
          module2QuestionLimit: parsed
        });
      } catch (e) {}
    }

    // 2. Sync to backend for remote candidate laptop
    try {
      await fetch('/api/sync/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module2QuestionLimit: parsed })
      });
      await fetch('/api/quiz/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionLimit: parsed })
      });
    } catch (err) {
      console.warn('Failed to sync question limit to server:', err);
    }
  };

  // RED LOCKDOWN ALARM THEME STATE (Strict persistence - requires supervisor disarm)
  const [isRedLockdownActive, setIsRedLockdownActive] = useState(() => {
    return localStorage.getItem('forensic_red_lockdown') === 'true';
  });

  const [activeBreach, setActiveBreach] = useState(() => {
    try {
      const saved = localStorage.getItem('forensic_active_breach');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });

  // ALARM BREACH INCIDENT HISTORY
  const [alarmHistory, setAlarmHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('forensic_alarm_history');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading forensic_alarm_history:', err);
      return [];
    }
  });

  // SYSTEM THEME IS PERMANENTLY LOCKED TO CYBER DARK
  const [theme] = useState('dark');

  const [isSirenMuted, setIsSirenMuted] = useState(false);

  const broadcastChannelRef = useRef(null);
  const sirenCleanupRef = useRef(null);
  const lastSyncedVersionRef = useRef(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('forensic_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('forensic_tasks_state', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('forensic_notifications_state', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('forensic_strikes_count', strikes.toString());
  }, [strikes]);

  useEffect(() => {
    localStorage.setItem('forensic_archive_state', JSON.stringify(archive));
  }, [archive]);

  // Permanently enforce dark theme on HTML root
  useEffect(() => {
    localStorage.setItem('forensic_theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('theme-dark');
    document.documentElement.classList.remove('theme-light');
  }, []);

  // Sync Red Lockdown flag to document.body
  useEffect(() => {
    if (isRedLockdownActive) {
      document.body.classList.add('lockdown-active');
    } else {
      document.body.classList.remove('lockdown-active');
    }
  }, [isRedLockdownActive]);

  // Manage Siren Sound when Red Lockdown is active
  useEffect(() => {
    if (isRedLockdownActive && !isSirenMuted) {
      sirenCleanupRef.current = startSirenAudio();
    } else {
      if (sirenCleanupRef.current) {
        sirenCleanupRef.current();
        sirenCleanupRef.current = null;
      }
    }

    return () => {
      if (sirenCleanupRef.current) {
        sirenCleanupRef.current();
        sirenCleanupRef.current = null;
      }
    };
  }, [isRedLockdownActive, isSirenMuted]);

  // Set up BroadcastChannel for real-time multi-tab synchronization
  useEffect(() => {
    try {
      broadcastChannelRef.current = new BroadcastChannel('forensic_sync_channel');
      broadcastChannelRef.current.onmessage = (event) => {
        const data = event.data;
        if (data?.type === 'TASK_SUBMITTED') {
          if (data.updatedTasks) {
            setTasks(data.updatedTasks);
          }
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
            setActivePopupNotification(data.notification);
            playCyberChime();
          }
        } else if (data?.type === 'TASK_VERDICT_UPDATED') {
          if (data.updatedTasks) {
            setTasks(data.updatedTasks);
          }
        } else if (data?.type === 'SECURITY_LOCKDOWN_TRIGGERED') {
          setIsRedLockdownActive(true);
          setActiveBreach(data.breach);
          setStrikes(s => s + 1);
          if (data.breach) {
            setAlarmHistory(prev => {
              if (prev.some(x => x.id === data.breach.id)) return prev;
              const updated = [data.breach, ...prev].slice(0, 50);
              try {
                localStorage.setItem('forensic_alarm_history', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          }
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
          }
        } else if (data?.type === 'SECURITY_LOCKDOWN_DISARMED') {
          setIsRedLockdownActive(false);
          setActiveBreach(null);
          const disarmedTime = data.disarmedAt || new Date().toISOString();
          setAlarmHistory(prev => {
            const updated = prev.map(item => {
              if (item.status === 'ACTIVE') {
                const durationSeconds = Math.max(1, Math.round((new Date(disarmedTime).getTime() - new Date(item.timestamp).getTime()) / 1000));
                return {
                  ...item,
                  status: 'DISARMED',
                  disarmedAt: disarmedTime,
                  activeDurationSec: durationSeconds
                };
              }
              return item;
            });
            try {
              localStorage.setItem('forensic_alarm_history', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        } else if (data?.type === 'ALARM_HISTORY_CLEARED') {
          setAlarmHistory([]);
          try {
            localStorage.removeItem('forensic_alarm_history');
          } catch (e) {}
        } else if (data?.type === 'TARGET_TIME_UPDATED') {
          if (data.targetMinutes) {
            setKeyboardTargetMinutes(data.targetMinutes);
          }
        } else if (data?.type === 'MODULE2_LIMIT_UPDATED') {
          if (data.module2QuestionLimit) {
            setModule2QuestionLimit(data.module2QuestionLimit);
            try {
              localStorage.setItem('forensic_module2_question_limit', data.module2QuestionLimit.toString());
            } catch (e) {}
          }
        } else if (data?.type === 'STRIKES_RESET') {
          setStrikes(0);
          setTasks(prev => prev.map(t => ({ ...t, strikesCount: 0 })));
        } else if (data?.type === 'TASK_CLEARED') {
          if (data.updatedTasks) {
            setTasks(data.updatedTasks);
          }
        } else if (data?.type === 'ARCHIVE_UPDATED') {
          if (data.archive) {
            setArchive(data.archive);
          }
        } else if (data?.type === 'THEME_CHANGED') {
          if (data.theme) {
            setTheme(data.theme);
          }
        } else if (data?.type === 'NEW_DAY_UNLOCKED') {
          if (data.tasks) {
            setTasks(data.tasks);
          }
          setLastCompletedDateKey(null);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'forensic_red_lockdown') {
        setIsRedLockdownActive(e.newValue === 'true');
      }
      if (e.key === 'forensic_active_breach') {
        try {
          setActiveBreach(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {}
      }
      if (e.key === 'forensic_alarm_history') {
        try {
          setAlarmHistory(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {}
      }
      if (e.key === 'forensic_strikes_count') {
        const val = e.newValue ? parseInt(e.newValue, 10) : 0;
        setStrikes(val);
      }
      if (e.key === 'forensic_archive_state') {
        try {
          setArchive(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (err) {}
      }
      if (e.key === 'forensic_theme') {
        if (e.newValue) {
          setTheme(e.newValue);
        }
      }
      if (e.key === 'forensic_module2_question_limit') {
        const val = e.newValue ? parseInt(e.newValue, 10) : 50;
        setModule2QuestionLimit(val);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // REAL-TIME MULTI-DEVICE NETWORK SYNCHRONIZATION ENGINE
  // Connects Candidate (Laptop 2) and Admin / CCTV Supervisor (Laptop 1) via Backend API
  const fetchServerSyncState = async () => {
    try {
      const res = await fetch('/api/sync/state');
      if (!res.ok) return;
      const json = await res.json();
      if (!json?.success || !json?.data) return;

      const serverData = json.data;
      if (json.version > lastSyncedVersionRef.current) {
        lastSyncedVersionRef.current = json.version;

        if (Array.isArray(serverData.tasks) && serverData.tasks.length > 0) {
          setTasks(serverData.tasks);
          try {
            localStorage.setItem('forensic_tasks_state', JSON.stringify(serverData.tasks));
          } catch (e) {}
        }

        if (Array.isArray(serverData.notifications)) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const brandNew = serverData.notifications.filter(n => !existingIds.has(n.id));
            if (brandNew.length > 0) {
              setActivePopupNotification(brandNew[0]);
              playCyberChime();
            }
            try {
              localStorage.setItem('forensic_notifications_state', JSON.stringify(serverData.notifications));
            } catch (e) {}
            return serverData.notifications;
          });
        }

        if (typeof serverData.strikes === 'number') {
          setStrikes(serverData.strikes);
          try {
            localStorage.setItem('forensic_strikes_count', serverData.strikes.toString());
          } catch (e) {}
        }

        if (typeof serverData.module2QuestionLimit === 'number' && serverData.module2QuestionLimit > 0) {
          setModule2QuestionLimit(serverData.module2QuestionLimit);
          try {
            localStorage.setItem('forensic_module2_question_limit', serverData.module2QuestionLimit.toString());
          } catch (e) {}
        }

        if (serverData.isRedLockdown !== undefined) {
          setIsRedLockdownActive(serverData.isRedLockdown);
          setActiveBreach(serverData.activeBreach || null);
          if (serverData.isRedLockdown) {
            localStorage.setItem('forensic_red_lockdown', 'true');
            if (serverData.activeBreach) {
              localStorage.setItem('forensic_active_breach', JSON.stringify(serverData.activeBreach));
            }
          } else {
            localStorage.removeItem('forensic_red_lockdown');
            localStorage.removeItem('forensic_active_breach');
          }
        }
      }
    } catch (err) {
      // Network error / offline mode
    }
  };

  useEffect(() => {
    // 1. Auto-push any locally submitted tasks that may have been submitted before server sync was active
    try {
      const savedTasks = localStorage.getItem('forensic_tasks_state');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          parsed.forEach(t => {
            if (t.status === 'SUBMITTED' || t.status === 'VERIFIED') {
              fetch('/api/sync/task-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  taskId: t.id,
                  taskData: t,
                  notification: {
                    id: `notif-sync-${t.id}`,
                    taskId: t.id,
                    taskTitle: t.title,
                    moduleName: t.id === 'mod-1-keyboard' ? 'Module 1' : t.id === 'mod-2-duolingo' ? 'Module 2' : 'Module 3',
                    type: t.type,
                    message: `Subject submitted ${t.title}. Artifact ready for audit.`,
                    timestamp: t.submittedAt || new Date().toISOString(),
                    read: false,
                    snippet: t.submissionText ? `Words: ${t.submissionText.trim().split(/\s+/).length}` : 'Task Submitted'
                  }
                })
              }).then(r => r.json()).then(res => {
                if (res?.version) lastSyncedVersionRef.current = res.version;
              }).catch(() => {});
            }
          });
        }
      }
    } catch (e) {}

    // 2. Fetch server state immediately
    fetchServerSyncState();

    // 3. Fast polling loop (every 1.5 seconds)
    const syncInterval = setInterval(async () => {
      try {
        const vRes = await fetch('/api/sync/version');
        if (vRes.ok) {
          const vData = await vRes.json();
          if (vData?.version > lastSyncedVersionRef.current) {
            fetchServerSyncState();
          }
        }
      } catch (e) {}
    }, 1500);

    return () => clearInterval(syncInterval);
  }, []);

  const loginAdmin = (passcode) => {
    if (passcode === 'admin123' || passcode === 'admin' || passcode === 'brother2026') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('forensic_admin_authenticated', 'true');
      setRole('admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('forensic_admin_authenticated');
    setRole('subject');
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      setRole('subject');
      return;
    }
    setRole(newRole);
  };

  // TRIGGER THE FULL RED THEME EMERGENCY LOCKDOWN
  const triggerRedLockdown = (reason, details = {}) => {
    const analysis = analyzeBreachReason(reason, details);
    const incidentId = `breach-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const breach = {
      id: incidentId,
      reason: reason || 'Anti-cheat violation detected in Subject session!',
      timestamp: nowIso,
      status: 'ACTIVE',
      category: analysis.category,
      categoryLabel: analysis.categoryLabel,
      title: analysis.title,
      module: analysis.module,
      severity: analysis.severity,
      ruleBroken: analysis.ruleBroken,
      explanation: analysis.explanation,
      actionTaken: analysis.actionTaken,
      details
    };

    setIsRedLockdownActive(true);
    setActiveBreach(breach);
    setStrikes(s => s + 1);

    setAlarmHistory(prev => {
      const updated = [breach, ...prev.filter(b => b.id !== breach.id)].slice(0, 50);
      try {
        localStorage.setItem('forensic_alarm_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    localStorage.setItem('forensic_red_lockdown', 'true');
    localStorage.setItem('forensic_active_breach', JSON.stringify(breach));

    const notif = {
      id: `notif-${Date.now()}`,
      taskId: 'mod-1-keyboard',
      taskTitle: '🚨 CRITICAL SECURITY BREACH: ANTI-CHEAT ALARM',
      moduleName: 'Anti-Cheat Sentinel',
      type: 'breach',
      message: `${analysis.title}: ${breach.reason}`,
      timestamp: breach.timestamp,
      read: false,
      snippet: analysis.explanation
    };
    setNotifications(prev => [notif, ...prev]);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'SECURITY_LOCKDOWN_TRIGGERED',
        breach,
        notification: notif
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Push breach & lockdown to backend
    fetch('/api/sync/breach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        breachData: breach,
        strikes: strikes + 1
      })
    }).then(r => r.json()).then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    }).catch(() => {});
  };

  // MANUALLY / PHYSICALLY DISARM THE RED LOCKDOWN
  const disarmRedLockdown = () => {
    setIsRedLockdownActive(false);
    setActiveBreach(null);

    localStorage.removeItem('forensic_red_lockdown');
    localStorage.removeItem('forensic_active_breach');

    const disarmedTime = new Date().toISOString();

    setAlarmHistory(prev => {
      const updated = prev.map(item => {
        if (item.status === 'ACTIVE') {
          const durationSeconds = Math.max(1, Math.round((new Date(disarmedTime).getTime() - new Date(item.timestamp).getTime()) / 1000));
          return {
            ...item,
            status: 'DISARMED',
            disarmedAt: disarmedTime,
            activeDurationSec: durationSeconds
          };
        }
        return item;
      });
      try {
        localStorage.setItem('forensic_alarm_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (sirenCleanupRef.current) {
      sirenCleanupRef.current();
      sirenCleanupRef.current = null;
    }

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'SECURITY_LOCKDOWN_DISARMED',
        disarmedAt: disarmedTime
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Disarm alarm on backend
    fetch('/api/sync/disarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json()).then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    }).catch(() => {});
  };

  const clearAlarmHistory = () => {
    setAlarmHistory([]);
    try {
      localStorage.removeItem('forensic_alarm_history');
    } catch (e) {}
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'ALARM_HISTORY_CLEARED'
      });
    }
  };

  const toggleSirenMute = () => {
    setIsSirenMuted(prev => !prev);
  };

  // Internal helper to record notification and broadcast
  const registerSubmission = (taskId, title, type, snippet, updatedTasks) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      taskId,
      taskTitle: title,
      moduleName: taskId === 'mod-1-keyboard' ? 'Module 1' : taskId === 'mod-2-duolingo' ? 'Module 2' : 'Module 3',
      type,
      message: `Subject submitted ${title}. Artifact ready for audit.`,
      timestamp: new Date().toISOString(),
      read: false,
      snippet
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActivePopupNotification(newNotif);
    playCyberChime();

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TASK_SUBMITTED',
        notification: newNotif,
        updatedTasks
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Push to backend so Laptop 1 receives it instantly!
    const targetTask = updatedTasks?.find(t => t.id === taskId);
    fetch('/api/sync/task-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        taskData: targetTask,
        notification: newNotif
      })
    })
    .then(r => r.json())
    .then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    })
    .catch(err => console.warn('[ForensicSync] Push failed:', err));
  };

  // Subject Submissions
  const submitKeyboardPractice = (text, telemetry) => {
    const updated = tasks.map(t => {
      if (t.id === 'mod-1-keyboard') {
        return {
          ...t,
          status: 'SUBMITTED',
          submissionText: text,
          telemetry,
          submittedAt: new Date().toISOString(),
          auditorVerdict: null,
          auditorNotes: ''
        };
      }
      return t;
    });

    setTasks(updated);
    registerSubmission(
      'mod-1-keyboard', 
      'Module 1: Keyboard Practice', 
      'keyboard', 
      `Words: ${text.trim().split(/\s+/).length} | WPM: ${telemetry.wpm} | Active Writing Time: ${Math.floor(telemetry.durationSec / 60)}m ${telemetry.durationSec % 60}s`,
      updated
    );
  };

  const submitDuolingoPractice = (fileData) => {
    const isQuiz = fileData.type === 'english_quiz' || fileData.quizScore !== undefined;

    const updated = tasks.map(t => {
      if (t.id === 'mod-2-duolingo') {
        return {
          ...t,
          status: 'SUBMITTED',
          type: isQuiz ? 'english_quiz' : t.type,
          ...fileData,
          submittedAt: new Date().toISOString(),
          auditorVerdict: null,
          auditorNotes: ''
        };
      }
      return t;
    });

    setTasks(updated);

    const snippet = isQuiz
      ? `Score: ${fileData.quizScore}/${fileData.totalQuestions || 10} (${fileData.percentage || 100}%) | ${fileData.xpEarned || '+30 XP'} | Certified via Windows 11 Engine`
      : `Streak: ${fileData.ocrData?.streakDetected || '42 Days'} | File: ${fileData.fileName || 'Screenshot.png'}`;

    registerSubmission(
      'mod-2-duolingo',
      'Module 2: English Assessment (Windows 11 Engine)',
      isQuiz ? 'english_quiz' : 'image_ocr',
      snippet,
      updated
    );
  };

  const submitWritingPractice = (fileData) => {
    const updated = tasks.map(t => {
      if (t.id === 'mod-3-writing') {
        return {
          ...t,
          status: 'SUBMITTED',
          ...fileData,
          submittedAt: new Date().toISOString(),
          auditorVerdict: null,
          auditorNotes: ''
        };
      }
      return t;
    });

    setTasks(updated);
    registerSubmission(
      'mod-3-writing',
      'Module 3: Writing Practice',
      'image_exif',
      `Device: ${fileData.exifData?.deviceModel || 'Camera'} | Sensor: ${fileData.exifData?.lens || 'Original'}`,
      updated
    );
  };

  const clearTask = (taskId) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        if (taskId === 'mod-1-keyboard') {
          return {
            ...t,
            status: 'PENDING',
            submissionText: '',
            telemetry: null,
            submittedAt: null,
            auditorVerdict: null,
            auditorNotes: ''
          };
        } else if (taskId === 'mod-2-duolingo') {
          return {
            ...t,
            status: 'PENDING',
            image: null,
            fileName: null,
            fileSize: null,
            hash: null,
            ocrData: null,
            submittedAt: null,
            auditorVerdict: null,
            auditorNotes: ''
          };
        } else if (taskId === 'mod-3-writing') {
          return {
            ...t,
            status: 'PENDING',
            image: null,
            images: null,
            fileName: null,
            fileSize: null,
            fileCount: null,
            hash: null,
            exifData: null,
            submittedAt: null,
            auditorVerdict: null,
            auditorNotes: ''
          };
        }
      }
      return t;
    });

    setTasks(updated);
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TASK_CLEARED',
        taskId,
        updatedTasks: updated
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Reset task on server
    fetch('/api/sync/reset-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    }).then(r => r.json()).then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    }).catch(() => {});
  };

  // ARCHIVE HANDLERS
  const archiveTaskSubmission = (taskToArchive, notes = '') => {
    const now = new Date();
    const newEntry = {
      id: `arch-${now.getTime()}-${taskToArchive.id}`,
      taskId: taskToArchive.id,
      taskTitle: taskToArchive.title,
      moduleName: taskToArchive.id === 'mod-1-keyboard' ? 'Module 1: Keyboard Practice' : taskToArchive.id === 'mod-2-duolingo' ? 'Module 2: Duolingo English' : 'Module 3: Writing Practice',
      type: taskToArchive.type,
      submissionText: taskToArchive.submissionText || '',
      telemetry: taskToArchive.telemetry ? { ...taskToArchive.telemetry } : null,
      image: taskToArchive.image || null,
      fileName: taskToArchive.fileName || null,
      fileSize: taskToArchive.fileSize || null,
      hash: taskToArchive.hash ? { ...taskToArchive.hash } : null,
      ocrData: taskToArchive.ocrData ? { ...taskToArchive.ocrData } : null,
      exifData: taskToArchive.exifData ? { ...taskToArchive.exifData } : null,
      quizScore: taskToArchive.quizScore !== undefined ? taskToArchive.quizScore : null,
      totalQuestions: taskToArchive.totalQuestions || null,
      percentage: taskToArchive.percentage !== undefined ? taskToArchive.percentage : null,
      xpEarned: taskToArchive.xpEarned || null,
      avgTimePerQuestionSec: taskToArchive.avgTimePerQuestionSec || null,
      totalDurationSec: taskToArchive.totalDurationSec || null,
      integrityScore: taskToArchive.integrityScore !== undefined ? taskToArchive.integrityScore : null,
      violations: taskToArchive.violations || [],
      results: taskToArchive.results || [],
      proctorSnapshots: taskToArchive.proctorSnapshots || [],
      cameraDevice: taskToArchive.cameraDevice || null,
      submittedAt: taskToArchive.submittedAt || now.toISOString(),
      approvedAt: now.toISOString(),
      dateKey: now.toISOString().split('T')[0],
      formattedDate: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      auditorVerdict: 'APPROVED',
      auditorNotes: notes || taskToArchive.auditorNotes || 'Artifact verified and approved by Auditor.'
    };

    setArchive(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('forensic_archive_state', JSON.stringify(updated));
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'ARCHIVE_UPDATED',
          archive: updated
        });
      }
      return updated;
    });

    return newEntry;
  };

  const deleteArchivedItem = (archiveId) => {
    setArchive(prev => {
      const updated = prev.filter(a => a.id !== archiveId);
      localStorage.setItem('forensic_archive_state', JSON.stringify(updated));
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'ARCHIVE_UPDATED',
          archive: updated
        });
      }
      return updated;
    });
  };

  const clearArchive = () => {
    setArchive([]);
    localStorage.removeItem('forensic_archive_state');
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'ARCHIVE_UPDATED',
        archive: []
      });
    }
  };

  const resetActiveTaskForTomorrow = (taskId) => {
    clearTask(taskId);
  };

  // Admin Actions
  const approveTask = (taskId, notes = '') => {
    let targetTask = null;
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        targetTask = {
          ...t,
          status: 'VERIFIED',
          auditorVerdict: 'APPROVED',
          auditorNotes: notes || 'Artifact verified and approved by Auditor.',
          approvedAt: new Date().toISOString()
        };
        return targetTask;
      }
      return t;
    });

    setTasks(updated);

    // Save into Daily Submission Archive
    if (targetTask) {
      archiveTaskSubmission(targetTask, notes);
    }

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TASK_VERDICT_UPDATED',
        updatedTasks: updated
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Push approval verdict to backend
    fetch('/api/sync/task-verdict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        verdict: 'APPROVED',
        auditorNotes: notes || 'Artifact verified and approved by Auditor.'
      })
    }).then(r => r.json()).then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    }).catch(() => {});
  };

  const rejectTask = (taskId, reason = '') => {
    setStrikes(s => s + 1);
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'FLAGGED',
          auditorVerdict: 'REJECTED',
          strikesCount: (t.strikesCount || 0) + 1,
          auditorNotes: reason || 'NON-COMPLIANCE DETECTED: Artifact failed forensic validation standards. Redo required.'
        };
      }
      return t;
    });

    setTasks(updated);

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TASK_VERDICT_UPDATED',
        updatedTasks: updated
      });
    }

    // MULTI-DEVICE NETWORK SYNC: Push rejection verdict to backend
    fetch('/api/sync/task-verdict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        verdict: 'REJECTED',
        auditorNotes: reason || 'NON-COMPLIANCE DETECTED: Artifact failed forensic validation standards. Redo required.'
      })
    }).then(r => r.json()).then(res => {
      if (res?.version) lastSyncedVersionRef.current = res.version;
    }).catch(() => {});
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('forensic_notifications_state');
  };

  const dismissPopupNotification = () => {
    setActivePopupNotification(null);
  };

  const checkTaskFromNotification = (taskId) => {
    setSelectedTaskId(taskId);
    setAdminActiveTab('finished');
    setActivePopupNotification(null);
    setNotifications(prev => prev.map(n => n.taskId === taskId ? { ...n, read: true } : n));
  };

  const resetStrikes = () => {
    setStrikes(0);
    localStorage.setItem('forensic_strikes_count', '0');
    setTasks(prev => prev.map(t => ({ ...t, strikesCount: 0 })));
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'STRIKES_RESET'
      });
    }
  };

  const toggleTheme = () => {
    // Theme is locked permanently to Cyber Dark
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setStrikes(0);
    setIsRedLockdownActive(false);
    setActiveBreach(null);
    setAlarmHistory([]);
    localStorage.removeItem('forensic_tasks_state');
    localStorage.removeItem('forensic_notifications_state');
    localStorage.removeItem('forensic_red_lockdown');
    localStorage.removeItem('forensic_active_breach');
    localStorage.removeItem('forensic_strikes_count');
    localStorage.removeItem('forensic_alarm_history');

    // MULTI-DEVICE NETWORK SYNC: Reset all state on server
    fetch('/api/sync/reset-all', { method: 'POST' })
      .then(r => r.json())
      .then(res => {
        if (res?.version) lastSyncedVersionRef.current = res.version;
      })
      .catch(() => {});
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  return (
    <ForensicContext.Provider value={{
      role,
      switchRole,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      tasks,
      selectedTaskId,
      setSelectedTaskId,
      selectedTask,
      adminActiveTab,
      setAdminActiveTab,
      notifications,
      activePopupNotification,
      dismissPopupNotification,
      checkTaskFromNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      submitKeyboardPractice,
      submitDuolingoPractice,
      submitWritingPractice,
      clearTask,
      approveTask,
      rejectTask,
      strikes,
      resetStrikes,
      isRedLockdownActive,
      activeBreach,
      alarmHistory,
      clearAlarmHistory,
      triggerRedLockdown,
      disarmRedLockdown,
      isSirenMuted,
      toggleSirenMute,
      keyboardTargetMinutes,
      updateKeyboardTargetMinutes,
      module2QuestionLimit,
      updateModule2QuestionLimit,
      archive,
      archiveTaskSubmission,
      deleteArchivedItem,
      clearArchive,
      resetActiveTaskForTomorrow,
      resetAllData,
      theme,
      setTheme,
      toggleTheme,
      isAllTasksCompleted,
      lastCompletedDateKey,
      unlockNewDayTasks,
      getTodayDateKey
    }}>
      {children}
    </ForensicContext.Provider>
  );
};

export const useForensics = () => {
  const context = useContext(ForensicContext);
  if (!context) {
    throw new Error('useForensics must be used within a ForensicProvider');
  }
  return context;
};

export { INITIAL_TASKS };
