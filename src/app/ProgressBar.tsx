import React from 'react';
import { brazilianRealToFloat } from '@/app/utils';

interface ProgressBarProps {
  currentValue: number | string;
  goal: number | string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentValue, goal }) => {
    // Convert inputs to numbers, defaulting to 0 if invalid
    const numCurrentValue = typeof currentValue === 'string' 
      ? brazilianRealToFloat(currentValue.replace(',', '.')) 
      : currentValue;
    
    const numGoal = typeof goal === 'string' 
      ? brazilianRealToFloat(goal.replace(',', '.')) 
      : goal;

    console.log(currentValue, goal, numCurrentValue, numGoal);
  
    // Calculate the percentage, ensuring it doesn't exceed 100%
    const percentage = numGoal > 0 
      ? Math.min((numCurrentValue / numGoal) * 100, 100) 
      : 0;
  
    return (
      <div className="w-full max-w-2xl mx-auto mt-4">
        <div className="flex justify-between text-sm mb-1">
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 sm:h-10 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 h-6 sm:h-10 rounded-full transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${percentage}%`,
              minWidth: percentage > 0 ? '2rem' : '0' // Ensure some visibility when there's progress
            }}
          />
        </div>
        <div className="text-center text-xl sm:text-4xl percentage-num font-bold">
          {isNaN(percentage) ? '0.00' : percentage.toFixed(2)}%
        </div>
      </div>
    );
  };
  
  export default ProgressBar;