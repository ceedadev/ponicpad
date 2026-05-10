import React, { useState } from 'react';
import { useStore } from '../store';
import type { Batch, BatchStatus, RouterState } from '../types';
import BatchCard from '../components/BatchCard';
import BatchForm from '../components/BatchForm';

interface Props {
  navigate: (r: RouterState) => void;
}

type Filter = 'all' | 'active' | 'harvested' | 'archived';

const ACTIVE_STATUSES: BatchStatus[] = ['germinating', 'seedling', 'vegetative', 'ready'];

export default function Batches({ navigate }: Props) {
  const { batches, addBatch } = useStore();
  const [filter, setFilter] = useState<Filter>('active');
  const [showNewBatch, setShowNewBatch] = useState(false);

  const filtered = batches.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'active') return ACTIVE_STATUSES.includes(b.status);
    if (filter === 'harvested') return b.status === 'harvested';
    if (filter === 'archived') return b.status === 'archived';
    return true;
  });

  const filters: { value: Filter; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'harvested', label: 'Harvested' },
    { value: 'archived', label: 'Archived' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Batches</h1>
        <button
          onClick={() => setShowNewBatch(true)}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <span>+</span>
          <span>New</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <span className="text-5xl">🌿</span>
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} batches yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onClick={() => navigate({ page: 'batch-detail', batchId: batch.id })}
            />
          ))}
        </div>
      )}

      {showNewBatch && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewBatch(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">New Batch</h2>
              <button onClick={() => setShowNewBatch(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <BatchForm
              onSave={(draft) => {
                addBatch(draft);
                setShowNewBatch(false);
              }}
              onCancel={() => setShowNewBatch(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
