import { Request, Response, NextFunction } from 'express';

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { type, amount, category, date, description } = req.body;

  if (!type || !['income', 'expense'].includes(type)) {
    res.status(400).json({ message: 'Valid type (income/expense) is required' });
    return;
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ message: 'Valid positive amount is required' });
    return;
  }

  if (!category || typeof category !== 'string') {
    res.status(400).json({ message: 'Category is required' });
    return;
  }

  if (!description || typeof description !== 'string') {
    res.status(400).json({ message: 'Description is required' });
    return;
  }

  next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  next();
};
