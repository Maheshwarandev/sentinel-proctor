/**
 * @file devSurvivalData.js
 * @description Master export file for Developer Survival modules.
 */

import { track1_days } from './track1Data.js';
import { track2_days } from './track2Data.js';
import { track3_days } from './track3Data.js';
import { track4_days } from './track4Data.js';
import { track5_days } from './track5Data.js';

export {
  track1_days,
  track2_days,
  track3_days,
  track4_days,
  track5_days
};

// Backward compatibility aliases for any older component code
export const track1_shortcuts = track1_days[0]?.shortcuts || [];
export const track2_terminal = track2_days[0]?.challenges || [];
export const track3_files = track3_days[0]?.files || [];
export const track4_crashDoctor = track4_days[0]?.processes || [];
export const track5_gitConveyor = track5_days[0]?.steps || [];
