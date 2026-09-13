/**
 * Brother Compliance Scoring Engine
 * Computes a weighted integrity score (0-100) and extracts concrete violation flags.
 */

export const calculateIntegrityScore = ({
  pasteAttempts = 0,
  tabSwitches = 0,
  blurEvents = 0,
  fullscreenExits = 0,
  wpm = 0,
  cadenceAnomalyScore = 0,
  isDuplicateText = false,
  duplicateFileDetected = false,
  exifWarnings = [],
  hasAIPatterns = false,
  taskConfig = {}
}) => {
  let score = 100;
  const violations = [];

  // 1. Paste Attempts
  if (pasteAttempts > 0) {
    const pastePenalty = pasteAttempts * 20;
    score -= pastePenalty;
    violations.push(`Security Breach: ${pasteAttempts} clipboard paste attempt(s) intercepted.`);
  }

  // 2. Tab Switches / Window Blur
  const maxAllowedTabs = taskConfig.maxTabSwitches ?? 1;
  if (tabSwitches > maxAllowedTabs) {
    const excessTabs = tabSwitches - maxAllowedTabs;
    const tabPenalty = excessTabs * 15;
    score -= tabPenalty;
    violations.push(`Brother Telemetry: ${tabSwitches} tab switches detected (exceeds limit of ${maxAllowedTabs}).`);
  }

  if (blurEvents > 2) {
    score -= (blurEvents - 2) * 5;
    violations.push(`Focus Loss: Window lost focus ${blurEvents} times during session.`);
  }

  // 3. Fullscreen Exits
  if (taskConfig.requireFullscreen && fullscreenExits > 0) {
    score -= fullscreenExits * 15;
    violations.push(`Proctoring Violation: Fullscreen dropped ${fullscreenExits} time(s).`);
  }

  // 4. Biometric Typing Cadence
  if (wpm > 180) {
    score -= 25;
    violations.push(`Keystroke Anomaly: Superhuman typing speed detected (${Math.round(wpm)} WPM) indicating automated injection.`);
  } else if (cadenceAnomalyScore > 60) {
    score -= 15;
    violations.push(`Keystroke Rhythm Anomaly: Unnatural dwell/flight distribution detected.`);
  }

  // 5. Duplicate Hash Check
  if (isDuplicateText) {
    score -= 50;
    violations.push('Plagiarism Alert: Submission text hash matches an existing record in Brother Compliance registry.');
  }

  if (duplicateFileDetected) {
    score -= 40;
    violations.push('File Tampering: Uploaded document hash matches a previous submission.');
  }

  // 6. EXIF Metadata Checks
  if (exifWarnings && exifWarnings.length > 0) {
    score -= exifWarnings.length * 10;
    exifWarnings.forEach(w => violations.push(`EXIF Audit Warning: ${w}`));
  }

  // 7. AI Generated Text Patterns
  if (hasAIPatterns) {
    score -= 25;
    violations.push('Content Analysis: Detected LLM assistant conversational markers.');
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Verdict determination
  let verdict = 'VERIFIED';
  if (score < 60) {
    verdict = 'FLAGGED_CHEATING';
  } else if (score < 85) {
    verdict = 'SUSPICIOUS';
  }

  return {
    score,
    verdict,
    violations
  };
};
