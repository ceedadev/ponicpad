import React from 'react';
import type { Batch, Urgency } from '../types';
import { STATUS_LABELS } from '../constants';
import { getBatchProgress, getBatchUrgency } from '../utils/batch';
import { humanizeDate, daysUntilHarvest, shortDate } from '../utils/dates';
import ProgressBar from './ProgressBar';
import PlantBadge from './PlantBadge';

interface Props {
  batch: Batch;
  onClick: () => void;
}

const urgencyBorder: Record<Urgency, string> = {
  healthy: 'border-green-200',
  attention: 'border-amber-300',
  overdue: 'border-red-400',
};

const urgencyBadge: Record<Urgency, string> = {
  healthy: 'bg-green-100 text-green-700',
  attention: 'bg-amber-100 text-amber-700',
  overdue: 'bg-red-100 text-red-700',
};

export default function BatchCard({ batch, onClick }: Props) {
  const urgency = getBatchUrgency(batch);
  const progress = getBatchProgress(batch);
  const daysLeft = daysUntilHarvest(batch.expectedHarvestDate);
  const daysLeftLabel =
    daysLeft > 0
      ? `${daysLeft}d left`
      : daysLeft === 0
      ? 'Due today!'
      : `${Math.abs(daysLeft)}d overdue`;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border-2 ${urgencyBorder[urgency]} p-4 flex flex-col gap-3 shadow-sm active:scale-98 transition-transform`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900 text-base leading-tight">{batch.name}</span>
          <PlantBadge plantType={batch.plantType} customName={batch.customPlantName} size="sm" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${urgencyBadge[urgency]}`}>
          {STATUS_LABELS[batch.status]}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <ProgressBar progress={progress} urgency={urgency} />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Seeded {humanizeDate(batch.seedingDate)}</span>
          <span className={urgency === 'overdue' ? 'text-red-600 font-medium' : urgency === 'attention' ? 'text-amber-600 font-medium' : ''}>
            {daysLeftLabel}
          </span>
        </div>
      </div>

      {batch.towerSlot && (
        <div className="text-xs text-gray-400">📍 {batch.towerSlot}</div>
      )}

      <div className="text-xs text-gray-500">
        Harvest expected: <span className="text-gray-700 font-medium">{shortDate(batch.expectedHarvestDate)}</span>
      </div>
    </button>
  );
}
