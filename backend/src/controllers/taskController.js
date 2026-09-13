import { Task } from '../models/Task.js';
import { getIsConnected } from '../config/db.js';
import { getDailyTopicForDate } from '../services/dailyWritingTopicService.js';

const SEED_TASKS = [
  {
    _id: 'task_aml_001',
    title: 'Quarterly Anti-Money Laundering (AML) Compliance Attestation',
    category: 'Financial Regulatory Compliance',
    priority: 'critical',
    status: 'active',
    description: 'Provide your personal affirmation regarding Section 314(a) patriot act verifications and unflagged suspicious activity reports for Q3 operations.',
    instructions: [
      'Type your full compliance affidavit by hand into the monitored terminal.',
      'Copy-pasting from external documents or generative models is strictly prohibited and instantly flagged.',
      'Do not switch browser tabs or leave fullscreen mode while the session is active.',
      'Upload an unedited photo or signed scan of your physical badge or authorization voucher for EXIF validation.'
    ],
    samplePrompt: 'I hereby attest under penalty of regulatory sanction that all transaction logs reviewed during this audit cycle comply with international AML and KYC requirements...',
    expectedKeywords: ['affidavit', 'compliance', 'transaction', 'regulatory', 'patriot act', 'attest'],
    antiCheatingConfig: {
      blockPaste: true,
      maxTabSwitches: 1,
      requireFullscreen: true,
      minTypingDurationSec: 15,
      requireExifVerification: true,
      enforceKeystrokeCadence: true
    },
    createdAt: new Date('2026-09-01T10:00:00Z')
  },
  {
    _id: 'task_sec_002',
    title: 'Security Incident Containment & Non-Disclosure Oath',
    category: 'Information Security & GDPR',
    priority: 'high',
    status: 'active',
    description: 'Attest to the containment measures deployed for CVE-2026-9041 and certify zero unauthorized exfiltration of European resident PII.',
    instructions: [
      'Draft your sworn containment log within the high-security AntiPaste editor.',
      'Maintain continuous focus on this workspace window. Blurring or minimizing triggers a penalty.',
      'Provide your cryptographic confirmation statement.'
    ],
    samplePrompt: 'I confirm that zero unauthorized records were compromised and patch revisions have been implemented across all production enclaves...',
    expectedKeywords: ['containment', 'security', 'exfiltration', 'authorized', 'compromised', 'revisions'],
    antiCheatingConfig: {
      blockPaste: true,
      maxTabSwitches: 2,
      requireFullscreen: false,
      minTypingDurationSec: 10,
      requireExifVerification: false,
      enforceKeystrokeCadence: true
    },
    createdAt: new Date('2026-09-05T14:30:00Z')
  },
  {
    _id: 'task_eth_003',
    title: 'Code of Ethics & Conflict of Interest Annual Filing',
    category: 'Corporate Governance',
    priority: 'medium',
    status: 'active',
    description: 'Declare any financial holdings, secondary employment, or vendor relationships that could pose an objective conflict of interest.',
    instructions: [
      'State your disclosures explicitly without utilizing macro text expanders or automated scripts.',
      'Submit signed conflict waiver form if applicable.'
    ],
    samplePrompt: 'I certify that neither I nor any immediate family member hold personal financial stakes in assigned procurement vendors...',
    expectedKeywords: ['certify', 'conflict', 'vendor', 'interest', 'financial', 'disclosures'],
    antiCheatingConfig: {
      blockPaste: true,
      maxTabSwitches: 3,
      requireFullscreen: false,
      minTypingDurationSec: 10,
      requireExifVerification: false,
      enforceKeystrokeCadence: false
    },
    createdAt: new Date('2026-09-08T09:15:00Z')
  }
];

export const getTasks = async (req, res) => {
  try {
    if (getIsConnected()) {
      try {
        const dbTasks = await Task.find({ status: 'active' }).sort({ createdAt: -1 });
        if (dbTasks && dbTasks.length > 0) {
          return res.status(200).json({ success: true, count: dbTasks.length, tasks: dbTasks });
        }
      } catch (dbErr) {
        console.warn('[TaskController] DB query failed, using seeded tasks:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: SEED_TASKS.length,
      tasks: SEED_TASKS
    });
  } catch (err) {
    console.error('[TaskController] Error fetching tasks:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      try {
        const task = await Task.findById(id);
        if (task) {
          return res.status(200).json({ success: true, task });
        }
      } catch (e) {
        // Fallback to memory search
      }
    }

    const matched = SEED_TASKS.find(t => t._id === id || String(t._id) === String(id));
    if (!matched) {
      return res.status(404).json({ success: false, message: 'Compliance task not found' });
    }

    return res.status(200).json({ success: true, task: matched });
  } catch (err) {
    console.error('[TaskController] Error fetching task:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving task', error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, category, instructions, expectedKeywords, antiCheatingConfig, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newTask = {
      _id: `task_${Date.now()}`,
      title,
      description,
      category: category || 'General Compliance',
      instructions: instructions || ['Complete the form accurately.'],
      expectedKeywords: expectedKeywords || [],
      antiCheatingConfig: antiCheatingConfig || {
        blockPaste: true,
        maxTabSwitches: 1,
        requireFullscreen: true
      },
      priority: priority || 'medium',
      status: 'active',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      try {
        const created = await Task.create(newTask);
        return res.status(201).json({ success: true, task: created });
      } catch (err) {
        console.warn('[TaskController] Mongo task creation failed:', err.message);
      }
    }

    SEED_TASKS.unshift(newTask);
    return res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create task', error: err.message });
  }
};

export const getDailyWritingTopic = async (req, res) => {
  try {
    const dateKey = req.query.date || new Date().toISOString().split('T')[0];
    const topic = await getDailyTopicForDate(dateKey);
    return res.status(200).json({
      success: true,
      dateKey,
      topic
    });
  } catch (err) {
    console.error('[TaskController] Error fetching daily writing topic:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve daily writing topic', 
      error: err.message 
    });
  }
};
