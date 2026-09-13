import crypto from 'crypto';
import { SessionLog } from '../models/SessionLog.js';
import { getIsConnected } from '../config/db.js';

// Bounded in-memory LRU registry to prevent memory leaks during prolonged sessions
class BoundedHashRegistry {
  constructor(maxEntries = 5000) {
    this.max = maxEntries;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Refresh recency
    return val;
  }

  set(key, val) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.max) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey); // Evict oldest
    }
    this.map.set(key, val);
  }

  has(key) {
    return this.map.has(key);
  }
}

const knownHashesRegistry = new BoundedHashRegistry(5000);

/**
 * Computes SHA-256 hash for buffer or string
 */
export const computeHash = (data) => {
  if (!data) return '';
  const hash = crypto.createHash('sha256');
  if (Buffer.isBuffer(data)) {
    hash.update(data);
  } else {
    hash.update(String(data).trim());
  }
  return hash.digest('hex');
};

/**
 * Checks whether this hash has already been submitted by another session
 */
export const checkDuplicateHashRecord = async (hash, currentSessionId = null) => {
  if (!hash) return { isDuplicate: false, matchedRecord: null };

  // 1. Check in-memory store
  if (knownHashesRegistry.has(hash)) {
    const existing = knownHashesRegistry.get(hash);
    if (!currentSessionId || existing.sessionId !== currentSessionId) {
      return { isDuplicate: true, matchedRecord: existing };
    }
  }

  // 2. Check MongoDB if connected
  if (getIsConnected()) {
    try {
      const match = await SessionLog.findOne({
        $or: [
          { textHash: hash },
          { 'fileSubmissions.fileHash': hash }
        ]
      }).select('_id userName userEmail createdAt');

      if (match && (!currentSessionId || match._id.toString() !== currentSessionId.toString())) {
        return {
          isDuplicate: true,
          matchedRecord: {
            sessionId: match._id,
            userName: match.userName,
            submittedAt: match.createdAt
          }
        };
      }
    } catch (err) {
      console.warn('[HashService] Mongo duplicate check warning:', err.message);
    }
  }

  return { isDuplicate: false, matchedRecord: null };
};

/**
 * Registers hash into registry
 */
export const registerKnownHash = (hash, metadata) => {
  if (!hash) return;
  knownHashesRegistry.set(hash, {
    ...metadata,
    registeredAt: new Date().toISOString()
  });
};
