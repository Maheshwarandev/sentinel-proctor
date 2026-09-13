import express from 'express';
import {
  getSyncState,
  getSyncVersion,
  submitTaskSync,
  setTaskVerdictSync,
  registerBreachSync,
  disarmAlarmSync,
  resetTaskSync,
  resetAllSync,
  updateSettingsSync
} from '../controllers/syncController.js';

const router = express.Router();

router.get('/state', getSyncState);
router.get('/version', getSyncVersion);
router.post('/task-submit', submitTaskSync);
router.post('/task-verdict', setTaskVerdictSync);
router.post('/breach', registerBreachSync);
router.post('/disarm', disarmAlarmSync);
router.post('/reset-task', resetTaskSync);
router.post('/reset-all', resetAllSync);
router.post('/settings', updateSettingsSync);

export default router;
