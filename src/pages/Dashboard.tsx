import React, { useState } from 'react';
import { useStore } from '../store';
import type { RouterState } from '../types';
import { getActiveBatches, getBatchUrgency, getAutoStatus } from '../utils/batch';
import { STATUS_LABELS } from '../constants';
import BatchCard from '../components/BatchCard';
import TodayAlerts from '../components/TodayAlerts';
import QuickStats from '../components/QuickStats';
import BatchForm from '../components/BatchForm';

interface Props {
  navigate: (r: RouterState) => void;
}

export default function Dashboard({ navigate }: Props) {
  const { batches, addBatch, advanceBatchStatus } = useStore();
  const [showNewBatch, setShowNewBatch] = useState(false);

  const active = getActiveBatches(batches);

  const statusNudges = active.filter(b => {
    const auto = getAutoStatus(b);
    const autoIdx = ['germinating', 'seedling', 'vegetative', 'ready'].indexOf(auto);
    const currIdx = ['germinating', 'seedling', 'vegetative', 'ready'].indexOf(b.status);
    return autoIdx > currIdx;
  });

  return (
    <div className="flex flex-col gap-5">
      <TodayAlerts navigate={navigate} />

      {statusNudges.length > 0 && (
        <div className="flex flex-col gap-2">
          {statusNudges.map(batch => {
            const auto = getAutoStatus(batch);
            return (
              <div key={batch.id} className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">📈</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800">{batch.name}</p>
                  <p className="text-xs text-green-600">
                    Looks ready to move to <strong>{STATUS_LABELS[auto]}</strong>
                  </p>
                </div>
                <button
                  onClick={() => advanceBatchStatus(batch.id)}
                  className="text-xs font-medium bg-green-600 text-white px-2.5 py-1 rounded-lg shrink-0"
                >
                  Update
                </button>
              </div>
            );
          })}
        </div>
      )}

      <QuickStats />

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Active Batches
          {active.length > 0 && (
            <span className="ml-2 text-sm text-gray-400 font-normal">({active.length})</span>
          )}
        </h2>
        <button
          onClick={() => setShowNewBatch(true)}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <span>+</span>
          <span>New batch</span>
        </button>
      </div>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="text-6xl">🌱</span>
          <div>
            <p className="text-gray-600 font-medium">No active batches yet</p>
            <p className="text-gray-400 text-sm mt-1">Start your first batch to begin tracking</p>
          </div>
          <button
            onClick={() => setShowNewBatch(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Start first batch
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {active.map(batch => (
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
