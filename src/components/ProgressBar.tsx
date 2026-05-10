import React from 'react';
import type { Urgency } from '../types';

interface Props {
  progress: number;
  urgency: Urgency;
}

const urgencyColor: Record<Urgency, string> = {
  healthy: 'bg-green-500',
  attention: 'bg-amber-500',
  overdue: 'bg-red-500',
};

export default function ProgressBar({ progress, urgency }: Props) {
  const pct = Math.min(Math.max(progress * 100, 0), 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${urgencyColor[urgency]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
