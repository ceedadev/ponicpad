import React from 'react';
import { useStore } from '../store';
import { getBatchesNeedingAttention, getBatchUrgency } from '../utils/batch';
import type { RouterState } from '../types';

interface Props {
  navigate: (r: RouterState) => void;
}

export default function TodayAlerts({ navigate }: Props) {
  const batches = useStore(s => s.batches);
  const alertBatches = getBatchesNeedingAttention(batches);

  if (alertBatches.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {alertBatches.map(batch => {
        const urgency = getBatchUrgency(batch);
        const isOverdue = urgency === 'overdue';
        return (
          <button
            key={batch.id}
            onClick={() => navigate({ page: 'batch-detail', batchId: batch.id })}
            className={`w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 ${
              isOverdue
                ? 'bg-red-50 border border-red-200'
                : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <span className="text-xl">{isOverdue ? '🚨' : '⚠️'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isOverdue ? 'text-red-800' : 'text-amber-800'}`}>
                {batch.name}
              </p>
              <p className={`text-xs truncate ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                {isOverdue ? 'Overdue for harvest — take action!' : 'Needs attention soon'}
              </p>
            </div>
            <span className={`text-xs shrink-0 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`}>→</span>
          </button>
        );
      })}
    </div>
  );
}
