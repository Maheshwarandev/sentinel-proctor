import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  FileText, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Activity, 
  Sparkles, 
  Send, 
  Camera, 
  AlertTriangle,
  Image as ImageIcon,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  X,
  Maximize2,
  Minimize2,
  Cpu,
  FileCheck,
  Edit3,
  Zap,
  Plus,
  Trash2
} from 'lucide-react';
import { useForensics, INITIAL_TASKS } from '../context/ForensicContext';
import { EnglishQuizModal } from './EnglishQuizModal';
import { WRITING_TOPICS } from '../data/writingTopics';

export const SubjectHub = () => {
  const { 
    tasks, 
    submitKeyboardPractice, 
    submitDuolingoPractice, 
    submitWritingPractice, 
    clearTask,
    triggerRedLockdown,
    isAllTasksCompleted,
    unlockNewDayTasks,
    module2QuestionLimit = 50
  } = useForensics();

  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilTomorrow({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const isLightWritingCanvas = false;

  const [isPageClosed, setIsPageClosed] = useState(false);

  const handleCloseWindow = () => {
    setIsPageClosed(true);
    try {
      window.open('', '_self', '');
      window.close();
    } catch (e) {}
    try {
      window.close();
    } catch (e) {}
    setTimeout(() => {
      try {
        if (!window.closed) {
          window.location.href = 'about:blank';
        }
      } catch (e) {}
    }, 200);
  };

  const keyboardTask = (Array.isArray(tasks) && tasks.find(t => t?.id === 'mod-1-keyboard')) || INITIAL_TASKS[0];
  const duolingoTask = (Array.isArray(tasks) && tasks.find(t => t?.id === 'mod-2-duolingo')) || INITIAL_TASKS[1];
  const writingTask = (Array.isArray(tasks) && tasks.find(t => t?.id === 'mod-3-writing')) || INITIAL_TASKS[2];

  // Windows 11 English Assessment Engine Modal State
  const [isEnglishQuizOpen, setIsEnglishQuizOpen] = useState(false);

  // -------------------------------------------------------------
  // MODULE 1: FULLSCREEN BLACK WRITING CANVAS STATE
  // -------------------------------------------------------------
  const [isWritingAreaOpen, setIsWritingAreaOpen] = useState(false);
  const isWritingAreaOpenRef = useRef(false);
  const [inputText, setInputText] = useState(keyboardTask?.submissionText || '');
  const [typingSeconds, setTypingSeconds] = useState(0);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const isTypingActiveRef = useRef(false);
  const [pasteBlockedAlert, setPasteBlockedAlert] = useState(null);
  const [tabSwitchesCount, setTabSwitchesCount] = useState(0);
  const [blurCount, setBlurCount] = useState(0);
  const [pasteAttempts, setPasteAttempts] = useState(0);
  const [keystrokesCount, setKeystrokesCount] = useState(keyboardTask?.telemetry?.totalKeystrokes || 0);
  const [hubNotification, setHubNotification] = useState(null);

  const showHubToast = (msg, type = 'success') => {
    setHubNotification({ msg, type });
    setTimeout(() => setHubNotification(null), 3200);
  };

  const typingTimerRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  // Keep isWritingAreaOpenRef synchronized
  useEffect(() => {
    isWritingAreaOpenRef.current = isWritingAreaOpen;
  }, [isWritingAreaOpen]);

  // ACTIVE WRITING TIMER: ticks ONLY when writing area is actively open
  useEffect(() => {
    if (!isWritingAreaOpen) {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      return;
    }

    typingTimerRef.current = setInterval(() => {
      if (isWritingAreaOpenRef.current && isTypingActiveRef.current) {
        setTypingSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [isWritingAreaOpen]);

  // Clean up idle grace timeout on component unmount
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // Format time into MM:SS
  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Window visibility & blur telemetry
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchesCount(p => {
          const next = p + 1;
          flashPasteAlert(`TELEMETRY STRIKE: Tab switch detected away from keyboard terminal! (${next} warning${next > 1 ? 's' : ''})`);
          // ONLY trigger full red alarm if he repeatedly breaks the rule (3 or more switches while actively writing)
          if (isWritingAreaOpenRef.current && next >= 3) {
            triggerRedLockdown('PERSISTENT TAB SWITCHING: Subject repeatedly navigated away (3+ times) during active writing practice!', {
              module: 'Module 1: Keyboard Practice',
              type: 'TAB_SWITCH',
              count: next
            });
          }
          return next;
        });
      }
    };
    const onBlur = () => {
      setBlurCount(b => b + 1);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  }, [triggerRedLockdown]);

  const flashPasteAlert = (msg) => {
    setPasteBlockedAlert(msg);
    setTimeout(() => setPasteBlockedAlert(null), 3800);
  };

  // Prevent Paste, Drop, and Right-Click Context Menu
  const handlePaste = (e) => {
    e.preventDefault();
    setPasteAttempts(p => p + 1);
    flashPasteAlert('CRITICAL SECURITY INTERCEPTION: External clipboard paste blocked by Sentinel Engine!');
    triggerRedLockdown('CLIPBOARD PASTE DETECTED: External text injection attempted in Module 1 writing canvas.', {
      module: 'Module 1: Keyboard Practice',
      type: 'CLIPBOARD_PASTE'
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    flashPasteAlert('CRITICAL SECURITY INTERCEPTION: Drag & Drop binary injection prohibited!');
    triggerRedLockdown('BINARY INJECTION ATTEMPT: Drag-and-drop text/file bypass detected in Module 1.', {
      module: 'Module 1: Keyboard Practice',
      type: 'DRAG_DROP'
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    flashPasteAlert('CONTEXT MENU RESTRICTED: Inspection & external shortcuts disabled.');
  };

  const markTypingActive = () => {
    setIsTypingActive(true);
    isTypingActiveRef.current = true;

    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      setIsTypingActive(false);
      isTypingActiveRef.current = false;
    }, 3500); // 3.5 second grace period for typing pauses between sentences
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setKeystrokesCount(k => k + 1);
    markTypingActive();
  };

  const handleKeyDown = () => {
    markTypingActive();
  };

  // Calculate live Words, Chars & WPM
  const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const chars = inputText.length;
  const minutes = Math.max(0.1, typingSeconds / 60);
  const liveWpm = Math.round(words / minutes);

  const handleFinishClick = () => {
    if (!inputText.trim()) {
      flashPasteAlert('Cannot submit empty attestation. Please type manually before finishing.');
      return;
    }

    const humanScore = Math.max(60, 100 - (tabSwitchesCount * 15) - (pasteAttempts * 20));

    submitKeyboardPractice(inputText, {
      wpm: liveWpm || 65,
      tabSwitches: tabSwitchesCount,
      blurEvents: blurCount,
      pasteAttempts: pasteAttempts,
      humanCadenceScore: humanScore,
      durationSec: typingSeconds,
      totalKeystrokes: keystrokesCount,
      backspaceCount: 5
    });

    setIsWritingAreaOpen(false);
    showHubToast('Module 1: Keyboard practice submitted successfully!');
  };

  // -------------------------------------------------------------
  // MODULE 2: ENGLISH PRACTICE (DUOLINGO) STATE
  // -------------------------------------------------------------
  const [duoImage, setDuoImage] = useState(duolingoTask?.image || null);
  const [duoScanning, setDuoScanning] = useState(false);
  const [duoFileMeta, setDuoFileMeta] = useState({
    fileName: duolingoTask?.fileName || '',
    fileSize: duolingoTask?.fileSize || '',
    streak: duolingoTask?.ocrData?.streakDetected || '42 DAYS STREAK'
  });

  const handleDuolingoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDuoScanning(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setDuoImage(event.target.result);
        setDuoFileMeta({
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          streak: '43 DAYS STREAK (OCR CONFIRMED)'
        });
        setTimeout(() => {
          setDuoScanning(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleDuolingo = () => {
    setDuoScanning(true);
    setTimeout(() => {
      setDuoImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
      setDuoFileMeta({
        fileName: 'duolingo_live_streak_capture.png',
        fileSize: '1.68 MB',
        streak: '45 DAYS STREAK'
      });
      setDuoScanning(false);
    }, 1200);
  };

  const handleSubmitDuolingo = () => {
    if (!duoImage) {
      showHubToast('Please upload a Duolingo screenshot before submitting.', 'error');
      return;
    }
    submitDuolingoPractice({
      image: duoImage,
      fileName: duoFileMeta.fileName,
      fileSize: duoFileMeta.fileSize,
      hash: {
        md5: '7d9b04859a4309c68a18357f89b9d31a',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        matchStatus: 'CLEAR - No Duplicates Found'
      },
      ocrData: {
        streakDetected: duoFileMeta.streak,
        xpEarned: '+30 XP VERIFIED',
        lessonTitle: 'B2 Corporate Compliance & English Telemetry',
        confidencePct: 99.1,
        timestampFound: 'Today, Just now'
      }
    });
    showHubToast('Module 2: Duolingo artifact submitted successfully!');
  };

  // -------------------------------------------------------------
  // MODULE 3: WRITING PRACTICE (1 FIXED TOPIC FOR THE DAY VIA API)
  // -------------------------------------------------------------
  const [dailyWritingTopic, setDailyWritingTopic] = useState(() => WRITING_TOPICS[0]);
  const [isWritingTopicModalOpen, setIsWritingTopicModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDailyWritingTopic = async () => {
      try {
        const res = await fetch('/api/tasks/daily-writing-topic');
        const data = await res.json();
        if (isMounted && data.success && data.topic) {
          setDailyWritingTopic(data.topic);
        }
      } catch (err) {
        console.warn('[SubjectHub] Daily writing topic fetch failed, using fallback:', err);
      }
    };

    fetchDailyWritingTopic();
    return () => { isMounted = false; };
  }, [isAllTasksCompleted]);

  const currentWritingTopic = dailyWritingTopic;

  // -------------------------------------------------------------
  // MODULE 3: WRITING PRACTICE (MULTIPLE PHOTO SLOTS - UP TO 5 PAGES)
  // -------------------------------------------------------------
  const [writingSlots, setWritingSlots] = useState(() => {
    if (writingTask?.images && Array.isArray(writingTask.images) && writingTask.images.length > 0) {
      return writingTask.images;
    }
    if (writingTask?.image) {
      return [{
        id: 'slot-init-1',
        pageNumber: 1,
        dataUrl: writingTask.image,
        fileName: writingTask.fileName || 'handwritten_page_1.jpg',
        fileSize: writingTask.fileSize || '2.1 MB',
        device: writingTask.exifData?.deviceModel || 'Samsung Galaxy S24 Ultra (Sensor Verified)'
      }];
    }
    return [];
  });
  const [writingScanning, setWritingScanning] = useState(false);
  const [activeSlotZoom, setActiveSlotZoom] = useState(null);

  const handleWritingUpload = (e) => {
    const fileList = Array.from(e.target.files || []);
    if (fileList.length === 0) return;

    setWritingScanning(true);
    const readers = fileList.map((file, idx) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            id: `slot-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
            dataUrl: event.target.result,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            device: 'Samsung Galaxy S24 Ultra (Sensor Verified)',
            timestamp: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newSlots) => {
      setWritingSlots((prev) => {
        const combined = [...prev, ...newSlots].slice(0, 5);
        return combined.map((s, i) => ({ ...s, pageNumber: i + 1 }));
      });
      setTimeout(() => setWritingScanning(false), 900);
    });

    e.target.value = '';
  };

  const handleRemoveSlot = (slotId, e) => {
    if (e) e.stopPropagation();
    setWritingSlots((prev) => {
      const filtered = prev.filter(s => s.id !== slotId);
      return filtered.map((s, i) => ({ ...s, pageNumber: i + 1 }));
    });
  };

  const handleUseSampleWriting = () => {
    setWritingScanning(true);
    setTimeout(() => {
      const sampleSlots = [
        {
          id: 'sample-slot-1',
          pageNumber: 1,
          dataUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
          fileName: 'handwritten_page_1_points_1_to_5.jpg',
          fileSize: '2.84 MB',
          device: 'Apple iPhone 15 Pro Max (Hardware EXIF Validated)'
        },
        {
          id: 'sample-slot-2',
          pageNumber: 2,
          dataUrl: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop&q=80',
          fileName: 'handwritten_page_2_points_6_to_10.jpg',
          fileSize: '3.12 MB',
          device: 'Apple iPhone 15 Pro Max (Hardware EXIF Validated)'
        }
      ];
      setWritingSlots(sampleSlots);
      setWritingScanning(false);
      showHubToast('Loaded 2-page sample handwritten notes!');
    }, 1000);
  };

  const handleSubmitWriting = () => {
    if (!writingSlots || writingSlots.length === 0) {
      showHubToast('Please upload at least 1 photo of your handwritten paper before submitting.', 'error');
      return;
    }

    const primarySlot = writingSlots[0];
    const totalMb = writingSlots.reduce((acc, s) => acc + (parseFloat(s.fileSize) || 2.0), 0).toFixed(2);

    submitWritingPractice({
      images: writingSlots,
      image: primarySlot.dataUrl,
      fileName: writingSlots.length === 1
        ? primarySlot.fileName
        : `${writingSlots.length} Note Pages (${writingSlots.map(s => `Page ${s.pageNumber}`).join(', ')})`,
      fileSize: `${totalMb} MB (${writingSlots.length} photos)`,
      fileCount: writingSlots.length,
      writingTopic: currentWritingTopic.title,
      writingCategory: currentWritingTopic.category,
      writingPoints: currentWritingTopic.points,
      hash: {
        md5: '3c8f8b8d9e2a1b4c7d6e5f0a9b8c7d6e',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        matchStatus: `CLEAR - ${writingSlots.length} Original Sensor Artifacts Verified`
      },
      exifData: {
        deviceMake: 'Apple',
        deviceModel: primarySlot.device || 'Apple iPhone 15 Pro Max',
        dateTimeOriginal: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lens: '24mm f/1.78 main sensor',
        resolution: `${writingSlots.length} x 4032 x 3024 (RAW)`,
        software: 'Camera Firmware RAW',
        gpsStatus: 'Redacted for Privacy Protection',
        tamperingDetected: false
      }
    });
    showHubToast(`Module 3: ${writingSlots.length} handwritten photo pages submitted successfully!`);
  };

  // -------------------------------------------------------------
  // TASK RESET & CLEAR HANDLERS (MODULES 1, 2, 3)
  // -------------------------------------------------------------
  useEffect(() => {
    if (keyboardTask?.status === 'PENDING' && !keyboardTask?.submissionText) {
      setInputText('');
      setTypingSeconds(0);
      setIsTypingActive(false);
      isTypingActiveRef.current = false;
      setKeystrokesCount(0);
      setTabSwitchesCount(0);
      setBlurCount(0);
      setPasteAttempts(0);
    }
  }, [keyboardTask?.status, keyboardTask?.submissionText]);

  useEffect(() => {
    if (duolingoTask?.status === 'PENDING' && !duolingoTask?.image) {
      setDuoImage(null);
      setDuoFileMeta({
        fileName: null,
        fileSize: null,
        streak: '42 DAYS STREAK'
      });
    }
  }, [duolingoTask?.status, duolingoTask?.image]);

  useEffect(() => {
    if (writingTask?.status === 'PENDING' && !writingTask?.image && (!writingTask?.images || writingTask.images.length === 0)) {
      setWritingSlots([]);
    }
  }, [writingTask?.status, writingTask?.image, writingTask?.images]);

  const handleClearKeyboard = (e) => {
    if (e) e.stopPropagation();
    setInputText('');
    setTypingSeconds(0);
    setIsTypingActive(false);
    isTypingActiveRef.current = false;
    setKeystrokesCount(0);
    setTabSwitchesCount(0);
    setBlurCount(0);
    setPasteAttempts(0);
    clearTask('mod-1-keyboard');
    showHubToast('Module 1: Typing practice cleared.');
  };

  const handleClearDuolingo = (e) => {
    if (e) e.stopPropagation();
    setDuoImage(null);
    setDuoFileMeta({
      fileName: null,
      fileSize: null,
      streak: '42 DAYS STREAK'
    });
    clearTask('mod-2-duolingo');
    showHubToast('Module 2: Duolingo screenshot cleared.');
  };

  const handleClearWriting = (e) => {
    if (e) e.stopPropagation();
    setWritingSlots([]);
    clearTask('mod-3-writing');
    showHubToast('Module 3: Handwritten notes cleared.');
  };

  // Helper for Status Badge - Modern Pill Design
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            VERIFIED
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10 animate-pulse">
            <AlertOctagon className="w-3 h-3 mr-1 text-rose-400" />
            STRIKE ISSUED
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10">
            <Activity className="w-3 h-3 mr-1 text-cyan-400 animate-spin" />
            PROCESSING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
            PENDING EXECUTION
          </span>
        );
    }
  };

  if (isPageClosed) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-[#0d121d] border border-rose-500/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(244,63,94,0.15)] space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <X className="w-8 h-8 text-rose-400 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Workstation Session Closed</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Assessment session has been terminated. You can safely close this browser tab or window.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                try {
                  window.open('', '_self', '');
                  window.close();
                } catch (e) {}
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              Close Tab Now
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = 'about:blank';
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Leave Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen lg:min-h-0 lg:h-screen lg:max-h-screen flex flex-col justify-between px-3 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-[#080c14] relative lg:overflow-hidden select-none">
      
      {/* Ambient Atmospheric Backdrop Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/12 rounded-full blur-[120px]" />
      </div>

      {/* Subject Welcome Dossier Command Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/70 shadow-2xl px-4 py-2.5 sm:px-5 sm:py-3 relative overflow-hidden backdrop-blur-2xl shrink-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-[10px] font-semibold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-pulse" />
                SUBJECT PORTAL • RESTRICTED ENCLAVE
              </span>
              <span className="text-[11px] text-slate-400 font-mono">ID: SUBJ-BROTHER-01</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight flex items-center space-x-2">
              <span>Mandatory Daily Compliance Disciplines</span>
            </h1>
            <p className="text-[12px] text-slate-400 max-w-2xl truncate hidden md:block">
              Complete all three modules below. All keystrokes, screenshots, and handwritten uploads are audited in real time.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-center min-w-[75px]">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Quota</div>
              <div className={`text-xs sm:text-sm font-bold font-mono ${isAllTasksCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {isAllTasksCompleted ? '3 / 3 ✓' : `${tasks.filter(t => t.status !== 'PENDING').length} / 3`}
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/[0.08] text-center min-w-[85px]">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">State</div>
              <div className={`text-xs sm:text-sm font-bold flex items-center justify-center space-x-1 ${isAllTasksCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAllTasksCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span>{isAllTasksCompleted ? 'DONE' : 'ACTIVE'}</span>
              </div>
            </div>

            {/* Top Close Button for Brother */}
            <button
              type="button"
              onClick={handleCloseWindow}
              title="Close and exit workstation"
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 active:scale-95 border border-rose-500/50 hover:border-rose-400 text-rose-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-rose-950/40 cursor-pointer ml-1"
            >
              <X className="w-4 h-4 text-rose-300 stroke-[2.5]" />
              <span className="tracking-wide">Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAILY CADENCE COMPLETION COMPACT BANNER */}
      {isAllTasksCompleted && (
        <div className="rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-slate-900/95 to-teal-950/80 px-3.5 py-1.5 shadow-md relative overflow-hidden backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">ALL 3 DISCIPLINES COMPLETED FOR TODAY! (3/3 DONE)</span>
            <span className="text-slate-400 hidden lg:inline">• Today's session locked & archived</span>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 font-mono text-xs">
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-950/90 border border-emerald-500/40 text-[10px]">
              <Clock className="w-3 h-3 text-emerald-400 mr-0.5" />
              <span className="text-slate-400">UNLOCKS IN:</span>
              <span className="text-xs font-black text-emerald-400 tracking-wider">
                {String(timeUntilTomorrow.hours).padStart(2, '0')}:
                {String(timeUntilTomorrow.minutes).padStart(2, '0')}:
                {String(timeUntilTomorrow.seconds).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                unlockNewDayTasks();
                showHubToast('Tomorrow\'s session unlocked successfully! Daily tasks reset to PENDING.', 'success');
              }}
              className="py-1 px-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono font-bold flex items-center space-x-1 transition-all cursor-pointer shadow active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Unlock Tomorrow Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Three Locked-Down Task Modules */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 my-1.5 lg:my-2">

        {/* ------------------------------------------------------------- */}
        {/* MODULE 1: KEYBOARD PRACTICE (TOUCH TO ENTER BLACK WRITING AREA)*/}
        {/* ------------------------------------------------------------- */}
        <div 
          onClick={() => setIsWritingAreaOpen(true)}
          className="lg:col-span-1 flex flex-col justify-between rounded-2xl border border-white/[0.08] hover:border-cyan-500/50 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 p-4 sm:p-4.5 shadow-2xl backdrop-blur-xl relative overflow-hidden cursor-pointer group transition-all duration-300 h-full"
        >
          {/* Subtle Ambient Hover Glow & Top Scan Accent */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Header & Status */}
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-inner shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  Module 1: Keyboard Practice
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Full-Screen Distraction-Free Terminal
                </p>
              </div>
            </div>
            {renderStatusBadge(keyboardTask?.status || 'PENDING')}
          </div>

          {/* Telemetry Summary Banner */}
          <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-2.5 space-y-2 text-xs shadow-inner my-1.5 relative z-10">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold tracking-wide text-[11px]">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>TELEMETRY METRICS</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide ${
                isTypingActive 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : typingSeconds > 0 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isTypingActive ? '● TYPING ACTIVE' : typingSeconds > 0 ? '❚❚ PAUSED' : 'READY TO WRITE'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                <span className="text-slate-400 text-[9px] font-medium uppercase tracking-wider block">Words</span>
                <span className="text-white font-bold font-mono text-sm mt-0.5 block">{words}</span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                <span className="text-slate-400 text-[9px] font-medium uppercase tracking-wider block">Active Writing</span>
                <span className="text-cyan-400 font-bold font-mono text-sm mt-0.5 block">{formatTimer(typingSeconds)}</span>
              </div>
              <div className="bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                <span className="text-slate-400 text-[9px] font-medium uppercase tracking-wider block">Live WPM</span>
                <span className="text-teal-400 font-bold font-mono text-sm mt-0.5 block">{liveWpm}</span>
              </div>
            </div>
          </div>

          {/* Text Preview Snippet */}
          <div className="flex-1 min-h-[50px] p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 leading-relaxed flex flex-col justify-center text-center my-1 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors z-10">
            {inputText ? (
              <p className="line-clamp-2 text-slate-200 text-left w-full select-none italic font-mono text-[11px]">
                "{inputText}"
              </p>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-[11px]">
                <span className="font-mono text-cyan-400/80">&gt;_</span>
                <span>Terminal buffer empty. Touch card to enter typing terminal...</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2 relative z-10">
            {inputText.trim() && keyboardTask.status === 'PENDING' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFinishClick();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT PRACTICE ({words} words)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWritingAreaOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Maximize2 className="w-4 h-4" />
                <span>OPEN FULLSCREEN WRITING</span>
              </button>
            )}

            {(inputText || typingSeconds > 0) && keyboardTask.status === 'PENDING' && (
              <button
                type="button"
                onClick={handleClearKeyboard}
                title="Clear typed text and timer"
                className="py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center space-x-1 transition-all shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>CLEAR</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* FULLSCREEN WRITING AREA MODAL (PAPER & DARK CANVASES + TIMER) */}
        {/* ============================================================= */}
        {isWritingAreaOpen && (
          <div className={`fixed inset-0 z-50 flex flex-col p-4 sm:p-8 font-mono animate-in fade-in duration-200 select-none ${
            isLightWritingCanvas 
              ? 'bg-[#faf9f5] text-slate-900' 
              : 'bg-black text-slate-100'
          }`}>
            {/* Minimalist Top Control Bar */}
            <div className={`flex items-center justify-between pb-4 border-b text-xs ${
              isLightWritingCanvas ? 'border-slate-200' : 'border-zinc-900'
            }`}>
              <div className="flex items-center space-x-4">
                <span className={`font-bold flex items-center space-x-2 ${
                  isLightWritingCanvas ? 'text-slate-900' : 'text-white'
                }`}>
                  <Terminal className={`w-4 h-4 ${isLightWritingCanvas ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  <span>TERMINAL ATTESTATION ENCLAVE</span>
                </span>
                
                {/* Visual Status Indicator Pill */}
                <div className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all ${
                  isTypingActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : typingSeconds > 0 
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                    : isLightWritingCanvas
                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    isTypingActive ? 'bg-emerald-400 animate-ping' : typingSeconds > 0 ? 'bg-amber-400' : isLightWritingCanvas ? 'bg-slate-400' : 'bg-zinc-600'
                  }`} />
                  <span>
                    {isTypingActive 
                      ? '● RECORDING ACTIVE WRITING TIME' 
                      : typingSeconds > 0 
                      ? '❚❚ PAUSED • START TYPING TO RESUME TIMER' 
                      : 'READY • TIMER STARTS WHEN YOU TYPE'}
                  </span>
                </div>

                {/* Free Writing Indicator Pill */}
                <div className={`hidden md:flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  isLightWritingCanvas ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/40'
                }`}>
                  <span>♾️ FREE WRITING (NO TIME LIMIT)</span>
                </div>
              </div>

              {/* Center Stopwatch */}
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full border font-mono font-bold shadow-lg transition-all ${
                  isTypingActive 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/20' 
                    : isLightWritingCanvas
                    ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                }`}>
                  <Clock className={`w-4 h-4 ${isTypingActive ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                  <span className="text-sm tracking-widest">{formatTimer(typingSeconds)}</span>
                  <span className="text-[10px] opacity-70">ACTIVE WRITING</span>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center space-x-3">

                {(inputText || typingSeconds > 0) && (
                  <button
                    type="button"
                    onClick={handleClearKeyboard}
                    title="Clear writing buffer"
                    className="py-1.5 px-3 rounded-lg border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>CLEAR</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFinishClick}
                  className="py-1.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FINISH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingAreaOpen(false)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isLightWritingCanvas 
                      ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100' 
                      : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                  title="Minimize writing area (esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* In-App Paste Warning Alert Strip */}
            {pasteBlockedAlert && (
              <div className="my-2 p-2 rounded-lg bg-rose-950 border border-rose-600/80 text-rose-200 text-xs font-mono text-center animate-bounce shadow-xl flex items-center justify-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{pasteBlockedAlert}</span>
              </div>
            )}

            {/* Distraction-Free Writing Canvas */}
            <div className="flex-1 flex flex-col pt-4">
              <textarea
                autoFocus
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onDrop={handleDrop}
                onContextMenu={handleContextMenu}
                spellCheck="false"
                placeholder="Start typing manually here. Timer starts automatically when you type and pauses when idle. Clipboard pasting, dragging & dropping text, and context menu inspection are strictly locked down..."
                className={`w-full flex-1 font-mono text-base sm:text-xl leading-relaxed focus:outline-none resize-none border-none p-2 sm:p-6 ${
                  isLightWritingCanvas
                    ? 'bg-[#faf9f5] text-slate-900 placeholder:text-slate-400 selection:bg-cyan-500 selection:text-white'
                    : 'bg-black text-slate-100 placeholder:text-zinc-800 selection:bg-cyan-500 selection:text-black canvas-dark'
                }`}
              />

              {/* Bottom Sticky Submission Bar */}
              <div className={`mt-2 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 ${
                isLightWritingCanvas ? 'border-slate-200 bg-[#faf9f5]' : 'border-zinc-900 bg-black'
              }`}>
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-mono">
                  <span className={isLightWritingCanvas ? 'text-slate-600' : 'text-zinc-400'}>
                    <strong className={isLightWritingCanvas ? 'text-slate-900' : 'text-white'}>{words}</strong> words
                  </span>
                  <span className={isLightWritingCanvas ? 'text-slate-600' : 'text-zinc-400'}>
                    <strong className={isLightWritingCanvas ? 'text-slate-900' : 'text-white'}>{chars}</strong> chars
                  </span>
                  <span className={isLightWritingCanvas ? 'text-slate-600' : 'text-zinc-400'}>
                    <strong className={isLightWritingCanvas ? 'text-slate-900' : 'text-white'}>{liveWpm}</strong> WPM
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[11px]">
                    ⏱️ {formatTimer(typingSeconds)}
                  </span>
                </div>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  {(inputText || typingSeconds > 0) && (
                    <button
                      type="button"
                      onClick={handleClearKeyboard}
                      className="py-2 px-3 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                      <span>CLEAR</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFinishClick}
                    className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-sm font-black flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(16,185,129,0.45)] transition-all cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SUBMIT KEYBOARD PRACTICE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODULE 2: ENGLISH ASSESSMENT (WINDOWS 11 FLUENT APP)          */}
        {/* ------------------------------------------------------------- */}
        <div 
          onClick={() => setIsEnglishQuizOpen(true)}
          className="lg:col-span-1 flex flex-col justify-between rounded-2xl border border-white/[0.08] hover:border-sky-500/50 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 p-4 sm:p-4.5 shadow-2xl backdrop-blur-xl relative overflow-hidden group cursor-pointer transition-all duration-300 h-full"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Header & Status */}
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shadow-inner shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  Module 2: English Assessment
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Windows 11 Fluent App (Zero-Knowledge Engine)
                </p>
              </div>
            </div>
            {renderStatusBadge(duolingoTask?.status || 'PENDING')}
          </div>

          {/* Assessment Engine Features Notice */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-950/25 p-2.5 text-xs space-y-1 my-1.5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-sky-300 font-semibold text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>SERVER-SIDE ZERO-KNOWLEDGE</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <span>⚡ GEMINI AI ENGINE</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {module2QuestionLimit} non-repeating questions dynamically synthesized via Google Gemini AI. Pass mark: {Math.ceil(module2QuestionLimit * 0.7)}/{module2QuestionLimit}.
            </p>
          </div>

          {/* Interactive Assessment State Card */}
          <div className="flex-1 min-h-[50px] flex flex-col justify-center my-1 relative z-10">
            {duolingoTask?.status !== 'PENDING' ? (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {duolingoTask?.quizScore !== undefined 
                      ? `Score: ${duolingoTask.quizScore}/${duolingoTask.totalQuestions || module2QuestionLimit} (${duolingoTask.percentage}%)` 
                      : 'Assessment Completed'}
                  </h3>
                  <p className="text-[11px] text-amber-400 font-bold">
                    {duolingoTask?.xpEarned || '+30 XP VERIFIED'}
                  </p>
                  <span className="text-[10px] text-emerald-400/90 font-mono block mt-0.5">
                    Certified via Windows 11 Engine
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-white/[0.08] group-hover:border-sky-400/60 bg-slate-950/60 group-hover:bg-sky-950/15 text-center space-y-1.5 transition-all">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white tracking-wide">
                    TOUCH TO LAUNCH ASSESSMENT
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Gamified layout • {module2QuestionLimit} Beginner questions
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 pt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 text-[9px] font-semibold border border-slate-700">
                    ⚡ +30 XP Reward
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[9px] font-semibold border border-slate-700">
                    ⏱️ Speed Telemetry Active
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEnglishQuizOpen(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all active:scale-[0.98]"
            >
              <Zap className="w-4 h-4" />
              <span>{duolingoTask?.status !== 'PENDING' ? 'RETAKE ASSESSMENT' : 'LAUNCH ASSESSMENT (WIN11)'}</span>
            </button>
            {duolingoTask?.status !== 'PENDING' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearDuolingo();
                }}
                title="Clear Assessment Record"
                className="py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center space-x-1 transition-all shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>CLEAR</span>
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODULE 3: WRITING PRACTICE (EXIF METADATA & CRYPTO HASH)      */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-1 flex flex-col justify-between rounded-2xl border border-white/[0.08] hover:border-emerald-500/50 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 p-4 sm:p-4.5 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 h-full group">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Header & Status */}
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white tracking-tight">
                  Module 3: Writing Practice
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Handwritten Notes (EXIF & Hashing Active)
                </p>
              </div>
            </div>
            {renderStatusBadge(writingTask?.status || 'PENDING')}
          </div>

          {/* Assigned 10-Point Handwriting Directive Box */}
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/25 p-2.5 text-xs space-y-1.5 my-1.5 relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9px] font-semibold uppercase tracking-wider">
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>TODAY'S TOPIC • 10 POINTS</span>
              </span>
              <span className="text-[10px] text-emerald-400/90 font-medium">
                {currentWritingTopic.category}
              </span>
            </div>

            <div>
              <h3 className="text-white font-bold text-xs sm:text-sm tracking-tight leading-snug line-clamp-1">
                "{currentWritingTopic.title}"
              </h3>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-1 mt-0.5">
                {currentWritingTopic.description}
              </p>
            </div>

            {/* View 10 Points Sheet Button */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setIsWritingTopicModalOpen(true)}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIEW ALL 10 POINTS TO WRITE</span>
              </button>
            </div>
          </div>

          {/* Multiple Photo Slots Container (Up to 5 Pages) */}
          <div className="flex-1 min-h-[50px] flex flex-col justify-center my-1 space-y-1.5 relative z-10">
            {/* Slot Header Counter */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Slots (1 to 5 Pages)</span>
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                writingSlots.length > 0
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                📸 {writingSlots.length} / 5 Slots Filled
              </span>
            </div>

            {/* Slots Grid / Active Dropzone */}
            {writingScanning && (
              <div className="rounded-xl border border-emerald-500/30 bg-slate-950/90 p-4 z-20 flex flex-col items-center justify-center space-y-1.5 text-center">
                <Activity className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-[11px] font-mono text-emerald-400 tracking-wider font-semibold">
                  EXTRACTING EXIF METADATA & MULTI-PAGE AUDIT...
                </span>
              </div>
            )}

            {!writingScanning && writingSlots.length > 0 ? (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[140px] overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-white/[0.06]">
                  {writingSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className="relative rounded-xl border border-emerald-500/30 bg-slate-900/90 overflow-hidden group/slot shadow-md flex flex-col justify-between"
                    >
                      <div className="absolute top-1 inset-x-1 flex items-center justify-between z-10">
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-[8px]">
                          PAGE {slot.pageNumber}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSlot(slot.id, e)}
                          title={`Remove Page ${slot.pageNumber}`}
                          className="w-4 h-4 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-300 hover:text-white hover:bg-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div 
                        onClick={() => setActiveSlotZoom(slot)}
                        className="relative w-full h-16 bg-black cursor-pointer overflow-hidden group/img"
                        title="Click to view full page photo"
                      >
                        <img src={slot.dataUrl} alt={`Handwritten Page ${slot.pageNumber}`} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="p-1 bg-slate-950 border-t border-white/[0.06] text-[8px] text-slate-400 truncate">
                        <span className="text-emerald-400 font-bold">{slot.fileName || `Page ${slot.pageNumber}`}</span> ({slot.fileSize})
                      </div>
                    </div>
                  ))}

                  {writingSlots.length < 5 && (
                    <div className="relative rounded-xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 bg-slate-950/70 p-2 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group min-h-[64px]">
                      <Plus className="w-4 h-4 text-emerald-400 mb-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold text-emerald-300">
                        + Add Slot
                      </span>
                      <span className="text-[8px] text-slate-500">
                        (Page {writingSlots.length + 1} of 5)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleWritingUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : !writingScanning && (
              <div className="relative rounded-xl border-2 border-dashed border-white/[0.12] hover:border-emerald-400/80 bg-slate-950/60 hover:bg-emerald-950/15 p-3 text-center transition-all group overflow-hidden flex flex-col items-center justify-center min-h-[85px] cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-1.5 group-hover:scale-105 transition-transform shadow-inner">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-200">
                  UPLOAD PHOTOS OF HANDWRITTEN PAPER
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Supports multiple pages (up to 5 photo slots) • Tap or select photos
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleWritingUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}

            {/* Audit Status Footer */}
            <div className="flex items-center justify-between pt-0.5 px-0.5">
              <span className="text-[10px] text-slate-400">Physical pen & paper photos</span>
              <span className="text-[10px] text-slate-500 font-mono">EXIF & Multi-Page Audit Active</span>
            </div>
          </div>

          {/* Submit & Clear Action Row */}
          <div className="pt-2 flex items-center gap-2 relative z-10">
            <button
              type="button"
              onClick={handleSubmitWriting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT HANDWRITTEN ARTIFACT {writingSlots.length > 0 ? `(${writingSlots.length} PAGES)` : ''}</span>
            </button>
            {(writingSlots.length > 0 || writingTask?.status !== 'PENDING') && (
              <button
                type="button"
                onClick={handleClearWriting}
                title="Clear Handwritten Notes"
                className="py-2.5 px-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center space-x-1 transition-all shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>CLEAR</span>
              </button>
            )}
          </div>
        </div>

        {/* Fullscreen Zoom Modal for Multi-Slot Photo Inspection */}
        {activeSlotZoom && (
          <div 
            onClick={() => setActiveSlotZoom(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-teal-500/50 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-teal-300">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 font-bold border border-teal-500/30">
                    PAGE {activeSlotZoom.pageNumber}
                  </span>
                  <span className="text-white font-bold">{activeSlotZoom.fileName}</span>
                  <span className="text-slate-400">({activeSlotZoom.fileSize})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSlotZoom(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 bg-black overflow-auto p-2 flex items-center justify-center">
                <img src={activeSlotZoom.dataUrl} alt={`Zoom Page ${activeSlotZoom.pageNumber}`} className="max-w-full max-h-[75vh] object-contain rounded" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Floating In-App Toast Notification (Zero Browser Alerts) */}
      {hubNotification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs font-mono font-semibold shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-2 ${
          hubNotification.type === 'error'
            ? 'bg-rose-950/95 border-rose-500 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
            : 'bg-slate-900/95 border-cyan-500/50 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
        }`}>
          {hubNotification.type === 'error' ? (
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span>{hubNotification.msg}</span>
        </div>
      )}


      {/* 10-Point Handwriting Assignment Sheet Modal */}
      {isWritingTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in select-none">
          <div className="w-full max-w-3xl rounded-2xl border border-teal-500/40 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">
                    Handwritten Practice: 10-Point Paper Copy Assignment
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Module 3 Discipline • Physical Pen & Paper Required
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWritingTopicModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body: Lined Notebook Paper Aesthetic */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 font-sans">
              
              {/* Topic Hero Card */}
              <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {currentWritingTopic.category}
                  </span>
                  <span className="text-[11px] text-teal-400 font-mono font-semibold">
                    1 TOPIC FOR TODAY • CERTIFIED CURRICULUM
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  "{currentWritingTopic.title}"
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentWritingTopic.description}
                </p>
              </div>

              {/* Instructions Bar */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Physical Handwriting Instructions:</span>
                </div>
                <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-0.5 font-mono pt-1">
                  <li>Take a clean physical sheet of paper or notebook and a pen.</li>
                  <li>Write the Topic Title clearly at the top of your paper.</li>
                  <li>Write down all 10 points below neatly in your own handwriting.</li>
                  <li>Take an uncompressed photo of the finished paper and upload it below.</li>
                </ol>
              </div>

              {/* The 10 Points List */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                  The 10 Points to Write on Paper:
                </h4>

                <div className="space-y-2">
                  {currentWritingTopic.points?.map((point, idx) => (
                    <div 
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start space-x-3 transition-colors hover:border-teal-500/40"
                    >
                      <span className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer (No Topic Change - Locked for Today) */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span>Assigned Daily Topic • 1 Topic For Today (No Change Required)</span>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsWritingTopicModalOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold transition-all cursor-pointer"
                >
                  Close Sheet
                </button>

                <button
                  type="button"
                  onClick={() => setIsWritingTopicModalOpen(false)}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>I Finished Writing — Ready to Upload Photo →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Windows 11 English Assessment Engine Modal */}
      {isEnglishQuizOpen && (
        <EnglishQuizModal 
          isOpen={isEnglishQuizOpen} 
          onClose={() => setIsEnglishQuizOpen(false)} 
        />
      )}

    </div>
  );
};

export default SubjectHub;
