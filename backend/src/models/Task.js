import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Regulatory Compliance' },
  description: { type: String, required: true },
  instructions: [String],
  samplePrompt: { type: String, default: '' },
  expectedKeywords: [String],
  antiCheatingConfig: {
    blockPaste: { type: Boolean, default: true },
    maxTabSwitches: { type: Number, default: 2 },
    requireFullscreen: { type: Boolean, default: true },
    minTypingDurationSec: { type: Number, default: 20 },
    requireExifVerification: { type: Boolean, default: true },
    enforceKeystrokeCadence: { type: Boolean, default: true }
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'high' 
  },
  status: { 
    type: String, 
    enum: ['active', 'archived'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
