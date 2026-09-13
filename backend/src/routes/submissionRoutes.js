import express from 'express';
import multer from 'multer';
import { processSubmission, getSubmissions, getSubmissionById } from '../controllers/submissionController.js';
import { verifyEXIF } from '../middlewares/verifyEXIF.js';
import { checkDuplicateHash } from '../middlewares/checkDuplicateHash.js';

const router = express.Router();

// Configure Multer with memory storage for Gatekeeper buffer inspections
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Robust Multer error-handling middleware wrapper
const handleUploadMiddleware = (req, res, next) => {
  upload.array('files', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'File size limit exceeded. Maximum allowed size is 10 MB per file.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload validation error: ${err.message}`
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: `Internal upload stream error: ${err.message}`
      });
    }
    next();
  });
};

// Middleware pipeline: handleUpload -> checkDuplicateHash -> verifyEXIF -> processSubmission
const gatekeeperPipeline = [
  handleUploadMiddleware,
  checkDuplicateHash,
  verifyEXIF,
  processSubmission
];

router.post('/', ...gatekeeperPipeline);
router.post('/submit', ...gatekeeperPipeline);
router.post('/:taskId/submit', ...gatekeeperPipeline);
router.post('/:taskId', ...gatekeeperPipeline);
router.get('/', getSubmissions);
router.get('/:id', getSubmissionById);

export default router;
