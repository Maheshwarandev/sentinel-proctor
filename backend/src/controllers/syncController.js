// Real-time Cross-Device State Synchronization Hub
// Allows Candidate (Laptop 2) and Admin/Supervisor (Laptop 1) to share instant live state

const INITIAL_SYNC_TASKS = [
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

import { getQuestionLimit, setQuestionLimit } from './quizController.js';

let globalSyncState = {
  version: Date.now(),
  tasks: JSON.parse(JSON.stringify(INITIAL_SYNC_TASKS)),
  notifications: [],
  strikes: 0,
  isRedLockdown: false,
  activeBreach: null,
  alarmHistory: [],
  module2QuestionLimit: getQuestionLimit()
};

// GET /api/sync/state -> returns current shared global state
export const getSyncState = (req, res) => {
  return res.status(200).json({
    success: true,
    version: globalSyncState.version,
    data: {
      ...globalSyncState,
      module2QuestionLimit: getQuestionLimit()
    }
  });
};

// GET /api/sync/version -> fast polling endpoint for change detection
export const getSyncVersion = (req, res) => {
  return res.status(200).json({
    success: true,
    version: globalSyncState.version
  });
};

// POST /api/sync/task-submit -> Candidate submits any of the 3 modules
export const submitTaskSync = (req, res) => {
  try {
    const { taskId, taskData, notification } = req.body;
    if (!taskId) {
      return res.status(400).json({ success: false, message: 'taskId is required' });
    }

    let found = false;
    globalSyncState.tasks = globalSyncState.tasks.map(t => {
      if (t.id === taskId) {
        found = true;
        return {
          ...t,
          ...taskData,
          status: 'SUBMITTED',
          submittedAt: taskData?.submittedAt || new Date().toISOString()
        };
      }
      return t;
    });

    if (!found && taskData) {
      globalSyncState.tasks.push({
        id: taskId,
        ...taskData,
        status: 'SUBMITTED',
        submittedAt: taskData?.submittedAt || new Date().toISOString()
      });
    }

    if (notification) {
      // Avoid duplicate notification IDs
      globalSyncState.notifications = [
        notification,
        ...globalSyncState.notifications.filter(n => n.id !== notification.id)
      ].slice(0, 50);
    }

    globalSyncState.version = Date.now();

    console.log(`[SyncEngine] 📨 Task submitted: ${taskId} at ${new Date().toISOString()} (Version: ${globalSyncState.version})`);

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      tasks: globalSyncState.tasks,
      notifications: globalSyncState.notifications
    });
  } catch (err) {
    console.error('[SyncEngine] Submit error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/task-verdict -> Admin approves or rejects a task
export const setTaskVerdictSync = (req, res) => {
  try {
    const { taskId, verdict, auditorNotes } = req.body;
    if (!taskId || !verdict) {
      return res.status(400).json({ success: false, message: 'taskId and verdict are required' });
    }

    globalSyncState.tasks = globalSyncState.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          auditorVerdict: verdict,
          auditorNotes: auditorNotes || t.auditorNotes || '',
          status: verdict === 'APPROVED' ? 'VERIFIED' : 'REDO'
        };
      }
      return t;
    });

    if (verdict === 'REJECTED') {
      globalSyncState.strikes = (globalSyncState.strikes || 0) + 1;
    }

    globalSyncState.version = Date.now();

    console.log(`[SyncEngine] ⚖️ Task verdict: ${taskId} -> ${verdict} (Notes: ${auditorNotes})`);

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      tasks: globalSyncState.tasks
    });
  } catch (err) {
    console.error('[SyncEngine] Verdict error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/breach -> Anti-cheat infraction triggered
export const registerBreachSync = (req, res) => {
  try {
    const { breachData, strikes } = req.body;
    globalSyncState.isRedLockdown = true;
    globalSyncState.activeBreach = breachData || {
      title: 'Anti-Cheat Violation Detected',
      category: 'UNSPECIFIED_BREACH',
      severity: 'CRITICAL',
      timestamp: new Date().toISOString()
    };
    if (typeof strikes === 'number') {
      globalSyncState.strikes = strikes;
    } else {
      globalSyncState.strikes = (globalSyncState.strikes || 0) + 1;
    }

    if (breachData) {
      globalSyncState.alarmHistory = [
        {
          id: `alarm-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...breachData
        },
        ...(globalSyncState.alarmHistory || [])
      ].slice(0, 50);
    }

    globalSyncState.version = Date.now();

    console.log(`[SyncEngine] 🚨 Red Lockdown engaged by anti-cheat: ${breachData?.title || 'Infraction'}`);

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      isRedLockdown: true
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/disarm -> Admin physically disarms alarm or clears lockdown
export const disarmAlarmSync = (req, res) => {
  try {
    globalSyncState.isRedLockdown = false;
    globalSyncState.activeBreach = null;
    globalSyncState.version = Date.now();

    console.log(`[SyncEngine] 🛡️ Alarm physically disarmed by Admin`);

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      isRedLockdown: false
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/reset-task -> Reset a specific task for redo
export const resetTaskSync = (req, res) => {
  try {
    const { taskId } = req.body;
    const defaultTask = INITIAL_SYNC_TASKS.find(t => t.id === taskId);

    globalSyncState.tasks = globalSyncState.tasks.map(t => {
      if (t.id === taskId) {
        return defaultTask ? JSON.parse(JSON.stringify(defaultTask)) : { ...t, status: 'PENDING', submissionText: '', auditorVerdict: null };
      }
      return t;
    });

    globalSyncState.version = Date.now();

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      tasks: globalSyncState.tasks
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/reset-all -> Reset entire workspace for fresh day
export const resetAllSync = (req, res) => {
  try {
    const currentLimit = globalSyncState.module2QuestionLimit || getQuestionLimit();
    globalSyncState = {
      version: Date.now(),
      tasks: JSON.parse(JSON.stringify(INITIAL_SYNC_TASKS)),
      notifications: [],
      strikes: 0,
      isRedLockdown: false,
      activeBreach: null,
      alarmHistory: [],
      module2QuestionLimit: currentLimit
    };

    console.log(`[SyncEngine] 🔄 Global workspace reset for new session`);

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      data: globalSyncState
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/sync/settings -> Update cross-device global settings
export const updateSettingsSync = (req, res) => {
  try {
    const { module2QuestionLimit } = req.body;
    if (module2QuestionLimit !== undefined) {
      const limit = setQuestionLimit(module2QuestionLimit);
      globalSyncState.module2QuestionLimit = limit;
      globalSyncState.version = Date.now();
      console.log(`[SyncEngine] ⚙️ Module 2 question limit synchronized to ${limit}`);
    }

    return res.status(200).json({
      success: true,
      version: globalSyncState.version,
      module2QuestionLimit: globalSyncState.module2QuestionLimit
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
