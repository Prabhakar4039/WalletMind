import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Gamepad2, 
  HeartPulse, 
  Banknote, 
  Zap, 
  HelpCircle,
  type LucideIcon
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

const categoryMap: Record<string, { icon: LucideIcon; colorClass: string }> = {
  Food: { icon: Utensils, colorClass: 'cat-bg-food' },
  Dining: { icon: Utensils, colorClass: 'cat-bg-food' },
  Travel: { icon: Car, colorClass: 'cat-bg-travel' },
  Transport: { icon: Car, colorClass: 'cat-bg-travel' },
  Shopping: { icon: ShoppingBag, colorClass: 'cat-bg-shopping' },
  Rent: { icon: Home, colorClass: 'cat-bg-rent' },
  Utilities: { icon: Zap, colorClass: 'cat-bg-rent' },
  Entertainment: { icon: Gamepad2, colorClass: 'cat-bg-entertainment' },
  Health: { icon: HeartPulse, colorClass: 'cat-bg-health' },
  Salary: { icon: Banknote, colorClass: 'cat-bg-salary' },
  Income: { icon: Banknote, colorClass: 'cat-bg-salary' },
  Others: { icon: HelpCircle, colorClass: 'cat-bg-others' },
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = '', size = 20 }) => {
  const config = categoryMap[category] || categoryMap.Others;
  const Icon = config.icon;
  
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.colorClass} ${className}`}>
      <Icon size={size} />
    </div>
  );
};

export default CategoryIcon;
