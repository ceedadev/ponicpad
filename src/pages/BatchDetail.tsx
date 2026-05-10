import React, { useState } from 'react';
import { useStore } from '../store';
import type { BatchStatus, HarvestEntry, RouterState } from '../types';
import { STATUS_LABELS, STATUS_ORDER, PLANT_DEFAULTS } from '../constants';
import { shortDate, humanizeDate, todayISO } from '../utils/dates';
import { canAdvanceStatus } from '../utils/batch';
import PlantBadge from '../components/PlantBadge';
import ConfirmDialog from '../components/ConfirmDialog';

interface Props {
  batchId: string;
  navigate: (r: RouterState) => void;
}

interface HarvestFormState {
  date: string;
  weightGrams: string;
  notes: string;
  isRegrow: boolean;
}

interface LogFormState {
  date: string;
  note: string;
  pH: string;
  ec: string;
  waterTemp: string;
}

export default function BatchDetail({ batchId, navigate }: Props) {
  const { batches, advanceBatchStatus, markHarvested, markRegrow, archiveBatch, deleteBatch, addLog, deleteLog } = useStore();
  const batch = batches.find(b => b.id === batchId);

  const [showHarvestForm, setShowHarvestForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [harvestForm, setHarvestForm] = useState<HarvestFormState>({
    date: todayISO(), weightGrams: '', notes: '', isRegrow: false,
  });
  const [logForm, setLogForm] = useState<LogFormState>({
    date: todayISO(), note: '', pH: '', ec: '', waterTemp: '',
  });

  if (!batch) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <p className="text-gray-500">Batch not found</p>
        <button onClick={() => navigate({ page: 'batches' })} className="text-green-600 font-medium">
          Back to batches
        </button>
      </div>
    );
  }

  const canRegrow = batch.plantType !== 'custom' && PLANT_DEFAULTS[batch.plantType].canRegrow;
  const activeStatusSteps: BatchStatus[] = ['germinating', 'seedling', 'vegetative', 'ready', 'harvested'];

  function submitHarvest(isRegrow: boolean) {
    const entry: Omit<HarvestEntry, 'id'> = {
      date: harvestForm.date,
      weightGrams: harvestForm.weightGrams ? Number(harvestForm.weightGrams) : undefined,
      notes: harvestForm.notes || undefined,
      isRegrow,
    };
    if (isRegrow) {
      markRegrow(batch!.id, entry);
    } else {
      markHarvested(batch!.id, entry);
    }
    setShowHarvestForm(false);
    setHarvestForm({ date: todayISO(), weightGrams: '', notes: '', isRegrow: false });
  }

  function submitLog() {
    if (!logForm.note.trim()) return;
    addLog(batch!.id, {
      date: logForm.date,
      note: logForm.note.trim(),
      pH: logForm.pH ? Number(logForm.pH) : undefined,
      ec: logForm.ec ? Number(logForm.ec) : undefined,
      waterTemp: logForm.waterTemp ? Number(logForm.waterTemp) : undefined,
    });
    setShowLogForm(false);
    setLogForm({ date: todayISO(), note: '', pH: '', ec: '', waterTemp: '' });
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => navigate({ page: 'batches' })}
        className="flex items-center gap-2 text-green-600 font-medium text-sm -mb-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{batch.name}</h1>
            <PlantBadge plantType={batch.plantType} customName={batch.customPlantName} />
          </div>
          {batch.towerSlot && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg shrink-0">
              📍 {batch.towerSlot}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-gray-400">Seeded</div>
            <div className="font-medium text-gray-700">{shortDate(batch.seedingDate)}</div>
            <div className="text-xs text-gray-400">{humanizeDate(batch.seedingDate)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Expected harvest</div>
            <div className="font-medium text-gray-700">{shortDate(batch.expectedHarvestDate)}</div>
            <div className="text-xs text-gray-400">{humanizeDate(batch.expectedHarvestDate)}</div>
          </div>
        </div>

        {batch.notes && (
          <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600">{batch.notes}</div>
        )}
      </div>

      {/* Status stepper */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Growth Stage</h2>
        <div className="flex items-center">
          {activeStatusSteps.map((step, i) => {
            const currentIdx = activeStatusSteps.indexOf(batch.status as BatchStatus);
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isLast = i === activeStatusSteps.length - 1;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    isDone ? 'bg-green-500 border-green-500 text-white' :
                    isCurrent ? 'bg-white border-green-500 text-green-600' :
                    'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs text-center leading-tight max-w-12 ${isCurrent ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                    {STATUS_LABELS[step].split(' ')[0]}
                  </span>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1 ${isDone ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        {canAdvanceStatus(batch.status) && batch.status !== 'ready' && (
          <button
            onClick={() => advanceBatchStatus(batch.id)}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Advance to {STATUS_LABELS[STATUS_ORDER[STATUS_ORDER.indexOf(batch.status) + 1] ?? batch.status]}
          </button>
        )}

        {(batch.status === 'vegetative' || batch.status === 'ready') && (
          <button
            onClick={() => setShowHarvestForm(true)}
            className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors border border-green-200"
          >
            🌾 Mark as Harvested
          </button>
        )}

        {batch.status === 'harvested' && canRegrow && (
          <button
            onClick={() => {
              setHarvestForm(prev => ({ ...prev, isRegrow: true }));
              setShowHarvestForm(true);
            }}
            className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors border border-blue-200"
          >
            ♻️ Regrow (cut-and-come-again)
          </button>
        )}

        {batch.status !== 'archived' && (
          <button
            onClick={() => setConfirmArchive(true)}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Archive batch
          </button>
        )}

        <button
          onClick={() => setConfirmDelete(true)}
          className="w-full py-3 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors text-sm"
        >
          Delete batch
        </button>
      </div>

      {/* Harvest form modal */}
      {showHarvestForm && (
        <div className="fixed inset-0 z-40 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowHarvestForm(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-5 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Log Harvest</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Harvest date</label>
                <input type="date" value={harvestForm.date} onChange={e => setHarvestForm(p => ({ ...p, date: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Weight (grams, optional)</label>
                <input type="number" min={0} value={harvestForm.weightGrams} onChange={e => setHarvestForm(p => ({ ...p, weightGrams: e.target.value }))}
                  placeholder="e.g. 250"
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea rows={2} value={harvestForm.notes} onChange={e => setHarvestForm(p => ({ ...p, notes: e.target.value }))}
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowHarvestForm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700">Cancel</button>
              <button onClick={() => submitHarvest(harvestForm.isRegrow)}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-medium">
                {harvestForm.isRegrow ? 'Log Regrow' : 'Log Harvest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Growth log */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Growth Log</h2>
          <button onClick={() => setShowLogForm(!showLogForm)}
            className="text-sm text-green-600 font-medium">
            {showLogForm ? 'Cancel' : '+ Add entry'}
          </button>
        </div>

        {showLogForm && (
          <div className="flex flex-col gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Date</label>
              <input type="date" value={logForm.date} onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Note *</label>
              <textarea rows={2} value={logForm.note} onChange={e => setLogForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Observation, action taken..."
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([['pH', 'pH'], ['EC (mS/cm)', 'ec'], ['Temp (°C)', 'waterTemp']] as [string, keyof LogFormState][]).map(([label, key]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">{label}</label>
                  <input type="number" step="0.1" value={logForm[key]} onChange={e => setLogForm(p => ({ ...p, [key]: e.target.value }))}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
            </div>
            <button onClick={submitLog}
              className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
              Save entry
            </button>
          </div>
        )}

        {batch.logs.length === 0 && !showLogForm && (
          <p className="text-sm text-gray-400 text-center py-2">No log entries yet</p>
        )}

        <div className="flex flex-col gap-2">
          {batch.logs.map(log => (
            <div key={log.id} className="flex gap-3 text-sm">
              <div className="text-xs text-gray-400 shrink-0 pt-0.5 w-20">{shortDate(log.date)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-700">{log.note}</p>
                {(log.pH !== undefined || log.ec !== undefined || log.waterTemp !== undefined) && (
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {log.pH !== undefined && <span>pH: {log.pH}</span>}
                    {log.ec !== undefined && <span>EC: {log.ec}</span>}
                    {log.waterTemp !== undefined && <span>🌡️ {log.waterTemp}°C</span>}
                  </div>
                )}
              </div>
              <button onClick={() => deleteLog(batch.id, log.id)} className="text-gray-300 hover:text-red-400 shrink-0 text-xs">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Harvest history */}
      {batch.harvests.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Harvest History</h2>
          <div className="flex flex-col gap-2">
            {batch.harvests.map(h => (
              <div key={h.id} className="flex gap-3 text-sm items-start">
                <div className="text-xs text-gray-400 shrink-0 pt-0.5 w-20">{shortDate(h.date)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{h.isRegrow ? '♻️ Regrow' : '🌾 Full harvest'}</span>
                    {h.weightGrams !== undefined && (
                      <span className="text-xs text-gray-400">{h.weightGrams}g</span>
                    )}
                  </div>
                  {h.notes && <p className="text-xs text-gray-400 mt-0.5">{h.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmArchive}
        title="Archive batch?"
        message={`"${batch.name}" will be archived and hidden from active view.`}
        confirmLabel="Archive"
        onConfirm={() => { archiveBatch(batch.id); setConfirmArchive(false); navigate({ page: 'batches' }); }}
        onCancel={() => setConfirmArchive(false)}
      />

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete batch?"
        message={`"${batch.name}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={() => { deleteBatch(batch.id); setConfirmDelete(false); navigate({ page: 'batches' }); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
