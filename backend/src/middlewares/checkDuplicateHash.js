import { computeHash, checkDuplicateHashRecord } from '../services/hashService.js';

/**
 * Gatekeeper Middleware: checkDuplicateHash
 * Generates cryptographic SHA-256 fingerprints for submission text and uploaded binaries,
 * then checks them against the registry to intercept recycled submissions.
 */
export const checkDuplicateHash = async (req, res, next) => {
  try {
    const { submissionText } = req.body;
    const files = req.files || (req.file ? [req.file] : []);

    const hashAudit = {
      textHash: null,
      isDuplicateText: false,
      textDuplicateMatch: null,
      fileHashes: [],
      hasDuplicateFiles: false
    };

    // 1. Audit Text Hash
    if (submissionText && typeof submissionText === 'string') {
      const textHash = computeHash(submissionText);
      hashAudit.textHash = textHash;

      const dupCheck = await checkDuplicateHashRecord(textHash);
      if (dupCheck.isDuplicate) {
        hashAudit.isDuplicateText = true;
        hashAudit.textDuplicateMatch = dupCheck.matchedRecord;
      }
    }

    // 2. Audit File Hashes
    for (const file of files) {
      const fileHash = computeHash(file.buffer);
      const dupCheck = await checkDuplicateHashRecord(fileHash);

      const fileAudit = {
        filename: file.originalname,
        fileHash,
        isDuplicate: dupCheck.isDuplicate,
        duplicateMatch: dupCheck.matchedRecord
      };

      if (dupCheck.isDuplicate) {
        hashAudit.hasDuplicateFiles = true;
      }

      hashAudit.fileHashes.push(fileAudit);
    }

    req.hashAudit = hashAudit;
    next();
  } catch (err) {
    console.error('[checkDuplicateHash] Gatekeeper error:', err);
    req.hashAudit = {
      textHash: '',
      isDuplicateText: false,
      fileHashes: [],
      hasDuplicateFiles: false,
      error: err.message
    };
    next();
  }
};
