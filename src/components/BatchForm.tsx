import React, { useState } from 'react';
import type { Batch, PlantType } from '../types';
import { PLANT_LABELS } from '../constants';
import { calcExpectedHarvestDate, todayISO } from '../utils/dates';
import PlantBadge from './PlantBadge';

type BatchDraft = Omit<Batch, 'id' | 'logs' | 'harvests' | 'createdAt' | 'updatedAt' | 'status'>;

interface Props {
  onSave: (draft: BatchDraft) => void;
  onCancel: () => void;
  initialValues?: Partial<BatchDraft>;
}

export default function BatchForm({ onSave, onCancel, initialValues }: Props) {
  const today = todayISO();

  const [plantType, setPlantType] = useState<PlantType>(initialValues?.plantType ?? 'kangkung');
  const [customPlantName, setCustomPlantName] = useState(initialValues?.customPlantName ?? '');
  const [name, setName] = useState(initialValues?.name ?? '');
  const [seedingDate, setSeedingDate] = useState(initialValues?.seedingDate ?? today);
  const [slotCount, setSlotCount] = useState(initialValues?.slotCount ?? 4);
  const [towerSlot, setTowerSlot] = useState(initialValues?.towerSlot ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  const expectedHarvestDate = calcExpectedHarvestDate(seedingDate, plantType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      plantType,
      customPlantName: plantType === 'custom' ? customPlantName.trim() : undefined,
      seedingDate,
      expectedHarvestDate,
      slotCount,
      towerSlot: towerSlot.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }

  const plantTypes: PlantType[] = ['kangkung', 'lettuce', 'kale', 'custom'];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Plant type</label>
        <div className="grid grid-cols-2 gap-2">
          {plantTypes.map(pt => (
            <button
              key={pt}
              type="button"
              onClick={() => setPlantType(pt)}
              className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                plantType === pt
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <PlantBadge plantType={pt} size="sm" />
            </button>
          ))}
        </div>
      </div>

      {plantType === 'custom' && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Plant name</label>
          <input
            type="text"
            value={customPlantName}
            onChange={e => setCustomPlantName(e.target.value)}
            placeholder="e.g. Basil, Spinach"
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Batch name *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Kangkung A"
          required
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Seeding date</label>
        <input
          type="date"
          value={seedingDate}
          onChange={e => setSeedingDate(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="bg-green-50 rounded-xl px-3 py-2.5 text-sm text-green-700">
        Expected harvest: <strong>{expectedHarvestDate}</strong>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Number of slots / cups</label>
        <input
          type="number"
          min={1}
          max={100}
          value={slotCount}
          onChange={e => setSlotCount(Number(e.target.value))}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tower slot (optional)</label>
        <input
          type="text"
          value={towerSlot}
          onChange={e => setTowerSlot(e.target.value)}
          placeholder="e.g. Tower 1 – Slot 3"
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Any notes about this batch..."
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Save batch
        </button>
      </div>
    </form>
  );
}
