import express from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  getDailyWritingTopic, 
  generateNewWritingTopic, 
  getGeminiTopicConfig, 
  updateGeminiKey,
  getCollegeCases,
  generateCollegeCase
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/daily-writing-topic', getDailyWritingTopic);
router.post('/daily-writing-topic/generate', generateNewWritingTopic);
router.get('/daily-writing-topic/status', getGeminiTopicConfig);
router.post('/gemini-key', updateGeminiKey);
router.get('/module4/cases', getCollegeCases);
router.post('/module4/generate-case', generateCollegeCase);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);

export default router;
