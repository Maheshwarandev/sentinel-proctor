import express from 'express';
import { getTasks, getTaskById, createTask, getDailyWritingTopic } from '../controllers/taskController.js';

const router = express.Router();

router.get('/daily-writing-topic', getDailyWritingTopic);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);

export default router;
