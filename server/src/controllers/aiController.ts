import { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';
import { analyzeExpenses, suggestCategory } from '../services/groqService.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get AI insights for user transactions
// @route   POST /api/ai/insights
// @access  Private
export const getAiInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(50);
    
    if (transactions.length === 0) {
      res.json({ 
        message: 'No transactions found yet. Start logging your expenses to unlock AI-powered financial wisdom!',
        recommendations: [],
        summary: 'Your vault is currently empty.'
      });
      return;
    }

    const insights = await analyzeExpenses(transactions);
    res.json(insights);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suggest category for a description
// @route   POST /api/ai/suggest-category
// @access  Private
export const getCategorySuggestion = async (req: AuthRequest, res: Response): Promise<void> => {
  const { description } = req.body;
  
  if (!description) {
    res.status(400).json({ message: 'Description is required' });
    return;
  }

  try {
    const category = await suggestCategory(description);
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
