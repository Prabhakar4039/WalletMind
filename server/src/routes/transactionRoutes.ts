import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransactionStats, exportTransactions } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTransaction } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, validateTransaction, createTransaction);

router.get('/stats', protect, getTransactionStats);
router.get('/export', protect, exportTransactions);

router.route('/:id')
  .put(protect, validateTransaction, updateTransaction)
  .delete(protect, deleteTransaction);

export default router;
