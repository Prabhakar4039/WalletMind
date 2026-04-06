import { Request, Response } from 'express';
import Transaction from '../models/Transaction.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all transactions for a user (with filters)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { category, type, startDate, endDate } = req.query;
  const query: any = { user: req.user._id };

  if (category && category !== 'All') query.category = category;
  if (type && type !== 'All') query.type = type;
  
  if (startDate || endDate) {
    query.date = {};
    try {
      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0); // Start of day
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999); // End of day
        query.date.$lte = end;
      }
    } catch (error) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }
  }

  try {
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, amount, category, date, description } = req.body;

  try {
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      date,
      description,
    });
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (transaction) {
      res.json({ message: 'Transaction removed', _id: req.params.id });
    } else {
      res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction stats for charts
// @route   GET /api/transactions/stats
// @access  Private
export const getTransactionStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Transaction.aggregate([
      { 
        $match: { 
          user: req.user._id,
          date: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export transactions as CSV
// @route   GET /api/transactions/export
// @access  Private
export const exportTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    
    let csv = 'Date,Description,Category,Type,Amount\n';
    transactions.forEach(t => {
      csv += `${new Date(t.date).toLocaleDateString()},"${t.description}",${t.category},${t.type},${t.amount}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
