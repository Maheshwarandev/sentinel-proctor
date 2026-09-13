import { SessionLog } from '../models/SessionLog.js';
import { getIsConnected } from '../config/db.js';
import { SESSION_STORE } from '../controllers/submissionController.js';

/**
 * Unified session finder that attempts MongoDB lookup first and falls back to SESSION_STORE.
 * Centralizes error handling and avoids duplicate lookup logic across controllers.
 */
export const findSessionRecordById = async (sessionId) => {
  if (!sessionId) return null;

  if (getIsConnected()) {
    try {
      const dbRecord = await SessionLog.findById(sessionId);
      if (dbRecord) return dbRecord;
    } catch (err) {
      console.warn(`[SessionRepository] DB lookup error for ${sessionId}:`, err.message);
    }
  }

  return SESSION_STORE.find(s => s._id === sessionId || String(s._id) === String(sessionId)) || null;
};
