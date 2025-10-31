'use client';

import { Calendar, DollarSign, Clock, Heart, Cake, Sparkles, Users, User, Map } from 'lucide-react';
import { useState } from 'react';

export type Occasion =
  | 'general'
  | 'birthday'
  | 'anniversary'
  | 'memorial'
  | 'date-night'
  | 'family'
  | 'solo'
  | 'friends';

export type Duration = 'half-day' | 'full-day' | 'evening' | 'custom';

export type BudgetLevel = 1 | 2 | 3 | 4 | 'custom';

interface PlanningOptionsProps {
  occasion: Occasion;
  duration: Duration;
  budget: BudgetLevel | number;
  customBudget?: number;
  onOccasionChange: (occasion: Occasion) => void;
  onDurationChange: (duration: Duration) => void;
  onBudgetChange: (budget: BudgetLevel | number) => void;
  onCustomBudgetChange?: (amount: number) => void;
}

const occasions = [
  { value: 'general', label: 'General', icon: Calendar },
  { value: 'birthday', label: 'Birthday', icon: Cake },
  { value: 'anniversary', label: 'Anniversary', icon: Heart },
  { value: 'memorial', label: 'Memorial/Remembrance', icon: Sparkles },
  { value: 'date-night', label: 'Date Night', icon: Heart },
  { value: 'family', label: 'Family Outing', icon: Users },
  { value: 'solo', label: 'Solo Adventure', icon: User },
  { value: 'friends', label: 'Friends Gathering', icon: Users },
];

const durations = [
  { value: 'half-day', label: 'Half Day', description: '3-4 hours' },
  { value: 'full-day', label: 'Full Day', description: '6-8 hours' },
  { value: 'evening', label: 'Evening', description: '4-6 hours' },
  { value: 'custom', label: 'Custom', description: 'Your choice' },
];

export default function PlanningOptions({
  occasion,
  duration,
  budget,
  customBudget,
  onOccasionChange,
  onDurationChange,
  onBudgetChange,
  onCustomBudgetChange,
}: PlanningOptionsProps) {
  const [showCustomBudget, setShowCustomBudget] = useState(budget === 'custom');

  const budgetLabels = ['$', '$$', '$$$', '$$$$'];
  const budgetRanges = [
    { level: 1, range: '$0-50 per person' },
    { level: 2, range: '$50-150 per person' },
    { level: 3, range: '$150-300 per person' },
    { level: 4, range: '$300+ per person' },
  ];

  const handleBudgetClick = (level: BudgetLevel) => {
    if (level === 'custom') {
      setShowCustomBudget(true);
      onBudgetChange('custom');
    } else {
      setShowCustomBudget(false);
      onBudgetChange(level);
    }
  };

  return (
    <div className="space-y-8">
      {/* Occasion Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Occasion
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            return (
              <button
                key={occ.value}
                onClick={() => onOccasionChange(occ.value as Occasion)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  occasion === occ.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mb-2" />
                <div className="text-sm font-medium">{occ.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Duration
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {durations.map((dur) => (
            <button
              key={dur.value}
              onClick={() => onDurationChange(dur.value as Duration)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                duration === dur.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock className="h-5 w-5 mb-2" />
              <div className="text-sm font-medium">{dur.label}</div>
              <div className="text-xs text-gray-500 mt-1">{dur.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Budget
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {budgetRanges.map((range) => (
            <button
              key={range.level}
              onClick={() => handleBudgetClick(range.level)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                budget === range.level
                  ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="h-5 w-5 mb-2" />
              <div className="text-lg font-bold mb-1">
                {budgetLabels[range.level - 1]}
              </div>
              <div className="text-xs text-gray-600">{range.range}</div>
            </button>
          ))}
          <button
            onClick={() => handleBudgetClick('custom')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              budget === 'custom'
                ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <DollarSign className="h-5 w-5 mb-2" />
            <div className="text-sm font-medium">Custom</div>
            <div className="text-xs text-gray-600">Set amount</div>
          </button>
        </div>

        {showCustomBudget && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Budget Amount
            </label>
            <div className="flex gap-3 items-center">
              <span className="text-lg font-semibold text-gray-700">$</span>
              <input
                type="number"
                min="0"
                step="10"
                value={customBudget || ''}
                onChange={(e) =>
                  onCustomBudgetChange?.(parseInt(e.target.value) || 0)
                }
                placeholder="Enter budget"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
