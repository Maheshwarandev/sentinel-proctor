/**
 * OCR and Content Inspection Service
 * Analyzes text and file payloads for required regulatory declarations,
 * suspicious copy-pasted prompts (e.g. "As an AI...", "Here is the response"),
 * and keyword validation.
 */

const SUSPICIOUS_AI_PATTERNS = [
  /as an ai language model/i,
  /certainly, here is/i,
  /in conclusion, it is important to remember/i,
  /i cannot provide legal or financial advice/i,
  /prompt:/i,
  /chatgpt/i
];

export const inspectContent = (text = '', expectedKeywords = []) => {
  const detectedSuspiciousPatterns = [];
  
  for (const pattern of SUSPICIOUS_AI_PATTERNS) {
    if (pattern.test(text)) {
      detectedSuspiciousPatterns.push(pattern.source);
    }
  }

  const normalized = text.toLowerCase();
  const matchedKeywords = expectedKeywords.filter(k => 
    normalized.includes(k.toLowerCase())
  );

  const missingKeywords = expectedKeywords.filter(k => 
    !normalized.includes(k.toLowerCase())
  );

  const keywordCoveragePct = expectedKeywords.length > 0 
    ? Math.round((matchedKeywords.length / expectedKeywords.length) * 100) 
    : 100;

  return {
    wordCount: text.trim().split(/\s+/).filter(Boolean).length,
    characterCount: text.length,
    matchedKeywords,
    missingKeywords,
    keywordCoveragePct,
    hasSuspiciousAIPatterns: detectedSuspiciousPatterns.length > 0,
    detectedSuspiciousPatterns
  };
};

/**
 * Extracts and parses document text or simulated OCR for uploaded files
 */
export const extractDocumentText = async (fileBuffer, originalName, mimeType) => {
  // If file is text-based (.txt, .csv, .json, .md)
  if (mimeType.startsWith('text/') || originalName.endsWith('.txt') || originalName.endsWith('.md')) {
    const rawText = fileBuffer.toString('utf-8');
    return {
      extractedText: rawText.slice(0, 2000),
      confidence: 0.99,
      isTextBased: true
    };
  }

  // Simulated OCR analysis for image/pdf buffers
  const pseudoKeywords = ['Signed Compliance Affidavit', 'Anti-Bribery Policy v4.2', 'Authorized Officer Signature', 'Verification Code 0x889F'];
  return {
    extractedText: `[OCR Extracted from ${originalName}]: ${pseudoKeywords.join(' | ')} verified document buffer.`,
    confidence: 0.94,
    isTextBased: false
  };
};
