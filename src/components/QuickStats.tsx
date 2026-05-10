import React from 'react';
import { useStore } from '../store';
import { getActiveBatches } from '../utils/batch';
import { shortDate } from '../utils/dates';

export default function QuickStats() {
  const batches = useStore(s => s.batches);
  const active = getActiveBatches(batches);

  const totalSlots = active.reduce((sum, b) => sum + b.slotCount, 0);

  const nextHarvestDate = active
    .filter(b => b.status !== 'harvested' && b.status !== 'archived')
    .map(b => b.expectedHarvestDate)
    .sort()[0];

  const allLogs = batches.flatMap(b => b.logs);
  const flushLogs = allLogs
    .filter(l => l.note.toLowerCase().includes('flush'))
    .sort((a, b) => b.date.localeCompare(a.date));
  const lastFlushDate = flushLogs[0]?.date;

  const daysSinceFlush = lastFlushDate
    ? Math.floor((Date.now() - new Date(lastFlushDate).getTime()) / 86400000)
    : null;

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm border border-gray-100">
        <span className="text-2xl font-bold text-green-600">{totalSlots}</span>
        <span className="text-xs text-gray-500 text-center leading-tight">Active slots</span>
      </div>
      <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm border border-gray-100">
        <span className="text-lg font-bold text-green-600 leading-tight">
          {nextHarvestDate ? shortDate(nextHarvestDate) : '—'}
        </span>
        <span className="text-xs text-gray-500 text-center leading-tight">Next harvest</span>
      </div>
      <div className="bg-white rounded-xl p-3 flex flex-col items-center gap-1 shadow-sm border border-gray-100">
        <span className={`text-2xl font-bold leading-tight ${daysSinceFlush !== null && daysSinceFlush > 14 ? 'text-red-500' : daysSinceFlush !== null && daysSinceFlush > 7 ? 'text-amber-500' : 'text-green-600'}`}>
          {daysSinceFlush !== null ? `${daysSinceFlush}d` : '—'}
        </span>
        <span className="text-xs text-gray-500 text-center leading-tight">Since flush</span>
      </div>
    </div>
  );
}
