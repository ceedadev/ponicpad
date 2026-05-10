import React from 'react';
import { useStore } from '../store';
import type { RouterState } from '../types';
import { getActiveBatches } from '../utils/batch';
import { shortDate, daysUntilHarvest } from '../utils/dates';
import PlantBadge from '../components/PlantBadge';

interface Props {
  navigate: (r: RouterState) => void;
}

function getWeekLabel(isoDate: string): string {
  const d = new Date(isoDate);
  const today = new Date();
  const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 7) return 'This week';
  if (diffDays <= 14) return 'Next week';
  const week = Math.ceil(diffDays / 7);
  return `In ${week} weeks`;
}

export default function Schedule({ navigate }: Props) {
  const batches = useStore(s => s.batches);
  const active = getActiveBatches(batches)
    .slice()
    .sort((a, b) => a.expectedHarvestDate.localeCompare(b.expectedHarvestDate));

  const groups = active.reduce<Record<string, typeof active>>((acc, b) => {
    const label = getWeekLabel(b.expectedHarvestDate);
    if (!acc[label]) acc[label] = [];
    acc[label]!.push(b);
    return acc;
  }, {});

  const groupOrder = ['Overdue', 'This week', 'Next week'];
  const allKeys = [...groupOrder.filter(k => groups[k]), ...Object.keys(groups).filter(k => !groupOrder.includes(k))];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Harvest Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Upcoming harvests sorted by date</p>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="text-5xl">📅</span>
          <p className="text-gray-500">No active batches to schedule</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {allKeys.map(group => (
            <div key={group} className="flex flex-col gap-2">
              <h2 className={`text-sm font-semibold ${group === 'Overdue' ? 'text-red-600' : group === 'This week' ? 'text-green-700' : 'text-gray-600'}`}>
                {group === 'Overdue' && '🚨 '}{group === 'This week' && '✅ '}{group}
              </h2>
              {groups[group]!.map(batch => {
                const days = daysUntilHarvest(batch.expectedHarvestDate);
                return (
                  <button
                    key={batch.id}
                    onClick={() => navigate({ page: 'batch-detail', batchId: batch.id })}
                    className="w-full text-left bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm hover:border-green-200 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm">{batch.name}</div>
                      <PlantBadge plantType={batch.plantType} customName={batch.customPlantName} size="sm" />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-gray-700">{shortDate(batch.expectedHarvestDate)}</div>
                      <div className={`text-xs ${days < 0 ? 'text-red-500' : days <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today!' : `${days}d`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
