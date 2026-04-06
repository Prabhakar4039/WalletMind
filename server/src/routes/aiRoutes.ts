import express from 'express';
import { getAiInsights, getCategorySuggestion } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/insights', protect, getAiInsights);
router.post('/suggest-category', protect, getCategorySuggestion);

export default router;
