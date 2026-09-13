import { SessionLog } from '../models/SessionLog.js';
import { Task } from '../models/Task.js';
import { calculateIntegrityScore } from '../services/complianceScorer.js';
import { inspectContent, extractDocumentText } from '../services/ocrService.js';
import { registerKnownHash } from '../services/hashService.js';
import { findSessionRecordById } from '../services/sessionRepository.js';
import { getIsConnected } from '../config/db.js';

// In-memory fallback session store
export const SESSION_STORE = [];

export const processSubmission = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { submissionText } = req.body;

    if (!submissionText || submissionText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Submission text cannot be empty.'
      });
    }

    // Parse JSON payloads if transmitted as multipart/form-data strings
    let keystrokeMetrics = {};
    let telemetryEvents = {};

    try {
      keystrokeMetrics = typeof req.body.keystrokeMetrics === 'string'
        ? JSON.parse(req.body.keystrokeMetrics)
        : (req.body.keystrokeMetrics || {});
    } catch (e) {
      keystrokeMetrics = {};
    }

    try {
      telemetryEvents = typeof req.body.telemetryEvents === 'string'
        ? JSON.parse(req.body.telemetryEvents)
        : (req.body.telemetryEvents || {});
    } catch (e) {
      telemetryEvents = {};
    }

    // 1. Gather Task configuration
    let taskTitle = 'Compliance Attestation';
    let expectedKeywords = [];
    let antiCheatingConfig = {
      blockPaste: true,
      maxTabSwitches: 1,
      requireFullscreen: true
    };

    if (getIsConnected()) {
      try {
        const t = await Task.findById(taskId);
        if (t) {
          taskTitle = t.title;
          expectedKeywords = t.expectedKeywords || [];
          antiCheatingConfig = t.antiCheatingConfig || antiCheatingConfig;
        }
      } catch (err) {
        // use fallback
      }
    }

    // 2. OCR & Content AI Analysis
    const contentAnalysis = inspectContent(submissionText, expectedKeywords);

    // 3. Process Uploaded Files with Gatekeeper results
    const files = req.files || (req.file ? [req.file] : []);
    const fileSubmissions = [];
    let duplicateFileDetected = false;
    const allExifWarnings = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const exif = req.exifAnalysis && req.exifAnalysis[i] ? req.exifAnalysis[i] : null;
      const hashData = req.hashAudit && req.hashAudit.fileHashes ? req.hashAudit.fileHashes[i] : null;

      if (exif && exif.warnings) {
        allExifWarnings.push(...exif.warnings);
      }

      if (hashData && hashData.isDuplicate) {
        duplicateFileDetected = true;
      }

      const ocrResult = await extractDocumentText(file.buffer, file.originalname, file.mimetype);

      const fileRecord = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        fileHash: hashData ? hashData.fileHash : 'hash_unavailable',
        exifData: {
          cameraMake: exif?.cameraMake || 'Unknown',
          cameraModel: exif?.cameraModel || 'Unknown',
          dateTimeOriginal: exif?.dateTimeOriginal || null,
          software: exif?.software || null,
          hasExif: !!exif?.hasExif,
          integrityStatus: exif?.integrityStatus || 'OK',
          warnings: exif?.warnings || []
        },
        ocrFindings: {
          extractedKeywords: contentAnalysis.matchedKeywords,
          suspiciousTermsDetected: contentAnalysis.detectedSuspiciousPatterns,
          confidence: ocrResult.confidence
        },
        isDuplicate: hashData ? hashData.isDuplicate : false
      };

      fileSubmissions.push(fileRecord);
    }

    // 4. Compute Compliance Integrity Score
    const hashAudit = req.hashAudit || {};
    const scoringResult = calculateIntegrityScore({
      pasteAttempts: keystrokeMetrics.pasteAttempts || 0,
      tabSwitches: telemetryEvents.tabSwitches || 0,
      blurEvents: telemetryEvents.blurEvents || 0,
      fullscreenExits: telemetryEvents.fullscreenExits || 0,
      wpm: keystrokeMetrics.wpm || 0,
      cadenceAnomalyScore: keystrokeMetrics.cadenceAnomalyScore || 0,
      isDuplicateText: hashAudit.isDuplicateText || false,
      duplicateFileDetected,
      exifWarnings: allExifWarnings,
      hasAIPatterns: contentAnalysis.hasSuspiciousAIPatterns,
      taskConfig: antiCheatingConfig
    });

    // 5. Construct Session Record
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionData = {
      _id: sessionId,
      taskId,
      taskTitle: req.body.taskTitle || taskTitle,
      userId: req.user?.id || 'guest_worker',
      userName: req.user?.name || req.body.userName || 'Compliance Operative',
      userEmail: req.user?.email || req.body.userEmail || 'operative@brother.ai',
      submissionText,
      textHash: hashAudit.textHash || 'hash_pending',
      fileSubmissions,
      keystrokeMetrics: {
        totalKeystrokes: keystrokeMetrics.totalKeystrokes || 0,
        pasteAttempts: keystrokeMetrics.pasteAttempts || 0,
        backspaceCount: keystrokeMetrics.backspaceCount || 0,
        avgDwellTimeMs: keystrokeMetrics.avgDwellTimeMs || 0,
        avgFlightTimeMs: keystrokeMetrics.avgFlightTimeMs || 0,
        wpm: keystrokeMetrics.wpm || 0,
        cadenceAnomalyScore: keystrokeMetrics.cadenceAnomalyScore || 0
      },
      telemetryEvents: {
        tabSwitches: telemetryEvents.tabSwitches || 0,
        blurEvents: telemetryEvents.blurEvents || 0,
        fullscreenExits: telemetryEvents.fullscreenExits || 0,
        mouseLeaves: telemetryEvents.mouseLeaves || 0,
        totalSessionDurationSec: telemetryEvents.totalSessionDurationSec || 0,
        eventTimeline: telemetryEvents.eventTimeline || []
      },
      integrityScore: scoringResult.score,
      violations: scoringResult.violations,
      verdict: scoringResult.verdict,
      createdAt: new Date()
    };

    // 6. Save in DB or In-Memory
    if (getIsConnected()) {
      try {
        const created = await SessionLog.create(sessionData);
        sessionData._id = created._id;
      } catch (dbErr) {
        console.warn('[SubmissionController] Mongo save failed, storing in memory:', dbErr.message);
      }
    }

    SESSION_STORE.unshift(sessionData);

    // 7. Register Hashes for subsequent duplicate checks
    if (hashAudit.textHash) {
      registerKnownHash(hashAudit.textHash, {
        sessionId: sessionData._id,
        userName: sessionData.userName,
        type: 'text'
      });
    }

    for (const f of fileSubmissions) {
      if (f.fileHash) {
        registerKnownHash(f.fileHash, {
          sessionId: sessionData._id,
          userName: sessionData.userName,
          type: 'file',
          filename: f.originalName
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Compliance submission analyzed and verified.',
      sessionId: sessionData._id,
      verdict: scoringResult.verdict,
      integrityScore: scoringResult.score,
      violations: scoringResult.violations,
      contentAudit: contentAnalysis,
      session: sessionData
    });
  } catch (err) {
    console.error('[SubmissionController] Error processing submission:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process compliance submission',
      error: err.message
    });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    if (getIsConnected()) {
      try {
        const logs = await SessionLog.find().sort({ createdAt: -1 }).limit(50);
        if (logs && logs.length > 0) {
          return res.status(200).json({ success: true, count: logs.length, submissions: logs });
        }
      } catch (err) {
        console.warn('[SubmissionController] Mongo fetch fallback');
      }
    }

    return res.status(200).json({
      success: true,
      count: SESSION_STORE.length,
      submissions: SESSION_STORE
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch submissions', error: err.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await findSessionRecordById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session log not found' });
    }

    return res.status(200).json({ success: true, submission: session });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving session', error: err.message });
  }
};
