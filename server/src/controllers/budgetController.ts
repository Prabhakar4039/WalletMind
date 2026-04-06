import { Request, Response } from 'express';
import Budget from '../models/Budget.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all user budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets' });
  }
};

// @desc    Add or update a budget (Upsert)
// @route   POST /api/budgets
// @access  Private
export const upsertBudget = async (req: AuthRequest, res: Response) => {
  const { category, amount, period } = req.body;

  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category },
      { amount, period: period || 'monthly' },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: 'Error saving budget' });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget' });
  }
};
