import { findSessionRecordById } from '../services/sessionRepository.js';

export const generateReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await findSessionRecordById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Compliance audit session '${sessionId}' not found.`
      });
    }

    const {
      integrityScore,
      verdict,
      violations,
      keystrokeMetrics,
      telemetryEvents,
      textHash,
      fileSubmissions,
      taskTitle,
      userName,
      userEmail,
      createdAt
    } = session;

    const report = {
      reportId: `REP-${session._id}`,
      generatedAt: new Date().toISOString(),
      sessionSummary: {
        sessionId: session._id,
        taskTitle,
        subjectName: userName,
        subjectEmail: userEmail,
        timestamp: createdAt,
        integrityScore,
        verdict,
        statusLabel: verdict === 'VERIFIED' ? 'PASSED_AUDIT' : verdict === 'SUSPICIOUS' ? 'MANUAL_REVIEW_REQUIRED' : 'BREACH_DETECTED'
      },
      violationsList: violations || [],
      telemetryAudit: {
        tabSwitches: telemetryEvents?.tabSwitches || 0,
        blurEvents: telemetryEvents?.blurEvents || 0,
        fullscreenExits: telemetryEvents?.fullscreenExits || 0,
        mouseLeaves: telemetryEvents?.mouseLeaves || 0,
        sessionDurationSec: telemetryEvents?.totalSessionDurationSec || 0,
        eventTimeline: telemetryEvents?.eventTimeline || []
      },
      keystrokeDynamicsAudit: {
        totalKeystrokes: keystrokeMetrics?.totalKeystrokes || 0,
        wpm: keystrokeMetrics?.wpm || 0,
        pasteAttemptsIntercepted: keystrokeMetrics?.pasteAttempts || 0,
        backspaceCorrections: keystrokeMetrics?.backspaceCount || 0,
        avgDwellTimeMs: keystrokeMetrics?.avgDwellTimeMs || 0,
        avgFlightTimeMs: keystrokeMetrics?.avgFlightTimeMs || 0,
        cadenceStatus: (keystrokeMetrics?.wpm || 0) > 160 ? 'ANOMALOUS_SPEED' : 'NATURAL_HUMAN_CADENCE'
      },
      digitalForensics: {
        textFingerprintSHA256: textHash,
        fileAudits: (fileSubmissions || []).map(f => ({
          filename: f.originalName,
          fileHash: f.fileHash,
          cameraProvenance: `${f.exifData?.cameraMake || 'Unknown'} ${f.exifData?.cameraModel || ''}`.trim(),
          exifTampered: f.exifData?.integrityStatus === 'TAMPERED',
          isDuplicate: f.isDuplicate,
          warnings: f.exifData?.warnings || []
        }))
      },
      auditorSignOff: {
        auditorName: req.user?.name || 'Chief Compliance Officer',
        decision: verdict === 'VERIFIED' ? 'APPROVED' : verdict === 'SUSPICIOUS' ? 'FLAGGED_FOR_HEARING' : 'IMMEDIATE_TERMINATION_RECOMMENDED',
        notes: session.auditorNotes || 'Telemetry logs and cryptographic hashes sealed into regulatory audit trail.'
      }
    };

    return res.status(200).json({ success: true, report });
  } catch (err) {
    console.error('[ReportController] Error generating report:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate report', error: err.message });
  }
};
