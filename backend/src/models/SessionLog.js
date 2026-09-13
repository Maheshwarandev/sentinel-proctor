import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  taskTitle: { type: String, default: '' },
  userId: { type: String, required: true },
  userName: { type: String, default: 'Compliance Officer' },
  userEmail: { type: String, default: '' },
  submissionText: { type: String, required: true },
  textHash: { type: String, required: true },
  fileSubmissions: [
    {
      originalName: String,
      mimeType: String,
      size: Number,
      fileHash: String,
      exifData: {
        cameraMake: String,
        cameraModel: String,
        dateTimeOriginal: String,
        software: String,
        hasExif: Boolean,
        integrityStatus: String,
        warnings: [String]
      },
      ocrFindings: {
        extractedKeywords: [String],
        suspiciousTermsDetected: [String],
        confidence: Number
      },
      isDuplicate: { type: Boolean, default: false }
    }
  ],
  keystrokeMetrics: {
    totalKeystrokes: { type: Number, default: 0 },
    pasteAttempts: { type: Number, default: 0 },
    backspaceCount: { type: Number, default: 0 },
    avgDwellTimeMs: { type: Number, default: 0 },
    avgFlightTimeMs: { type: Number, default: 0 },
    wpm: { type: Number, default: 0 },
    cadenceAnomalyScore: { type: Number, default: 0 }
  },
  telemetryEvents: {
    tabSwitches: { type: Number, default: 0 },
    blurEvents: { type: Number, default: 0 },
    fullscreenExits: { type: Number, default: 0 },
    mouseLeaves: { type: Number, default: 0 },
    totalSessionDurationSec: { type: Number, default: 0 },
    eventTimeline: [
      {
        type: String,
        timestamp: Number,
        details: String
      }
    ]
  },
  integrityScore: { type: Number, default: 100 },
  violations: [String],
  verdict: {
    type: String,
    enum: ['VERIFIED', 'SUSPICIOUS', 'FLAGGED_CHEATING'],
    default: 'VERIFIED'
  },
  auditorNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Production Query Performance Indexes
sessionLogSchema.index({ textHash: 1 });
sessionLogSchema.index({ 'fileSubmissions.fileHash': 1 });
sessionLogSchema.index({ createdAt: -1 });
sessionLogSchema.index({ taskId: 1, createdAt: -1 });
sessionLogSchema.index({ userId: 1, createdAt: -1 });
sessionLogSchema.index({ verdict: 1 });

export const SessionLog = mongoose.models.SessionLog || mongoose.model('SessionLog', sessionLogSchema);

