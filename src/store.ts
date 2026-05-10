import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Batch, BatchLog, HarvestEntry, Settings } from './types';
import { calcExpectedHarvestDate } from './utils/dates';
import { advanceStatus } from './utils/batch';
import { PLANT_DEFAULTS } from './constants';
import { addDays, parseISO } from 'date-fns';

interface AppStore {
  batches: Batch[];
  settings: Settings;

  addBatch: (draft: Omit<Batch, 'id' | 'logs' | 'harvests' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  archiveBatch: (id: string) => void;

  advanceBatchStatus: (id: string) => void;
  markHarvested: (id: string, entry: Omit<HarvestEntry, 'id'>) => void;
  markRegrow: (id: string, entry: Omit<HarvestEntry, 'id'>) => void;

  addLog: (batchId: string, log: Omit<BatchLog, 'id'>) => void;
  deleteLog: (batchId: string, logId: string) => void;

  updateSettings: (updates: Partial<Settings>) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAll: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  baseTDS: 200,
  abMixRatioPerLiter: 5,
  notificationsEnabled: false,
};

function now(): string {
  return new Date().toISOString();
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      batches: [],
      settings: DEFAULT_SETTINGS,

      addBatch: (draft) => {
        const batch: Batch = {
          ...draft,
          id: crypto.randomUUID(),
          status: 'germinating',
          logs: [],
          harvests: [],
          createdAt: now(),
          updatedAt: now(),
        };
        set(s => ({ batches: [batch, ...s.batches] }));
      },

      updateBatch: (id, updates) => {
        set(s => ({
          batches: s.batches.map(b =>
            b.id === id ? { ...b, ...updates, updatedAt: now() } : b
          ),
        }));
      },

      deleteBatch: (id) => {
        set(s => ({ batches: s.batches.filter(b => b.id !== id) }));
      },

      archiveBatch: (id) => {
        set(s => ({
          batches: s.batches.map(b =>
            b.id === id ? { ...b, status: 'archived', updatedAt: now() } : b
          ),
        }));
      },

      advanceBatchStatus: (id) => {
        set(s => ({
          batches: s.batches.map(b =>
            b.id === id ? { ...b, status: advanceStatus(b.status), updatedAt: now() } : b
          ),
        }));
      },

      markHarvested: (id, entry) => {
        set(s => ({
          batches: s.batches.map(b => {
            if (b.id !== id) return b;
            return {
              ...b,
              status: 'harvested',
              harvests: [...b.harvests, { ...entry, id: crypto.randomUUID() }],
              updatedAt: now(),
            };
          }),
        }));
      },

      markRegrow: (id, entry) => {
        set(s => ({
          batches: s.batches.map(b => {
            if (b.id !== id) return b;
            const plantType = b.plantType;
            const regrowDays = plantType === 'custom'
              ? 14
              : Math.round(PLANT_DEFAULTS[plantType].daysToHarvest / 3);
            const newHarvestDate = addDays(new Date(), regrowDays).toISOString().split('T')[0]!;
            return {
              ...b,
              status: 'vegetative',
              expectedHarvestDate: newHarvestDate,
              harvests: [...b.harvests, { ...entry, id: crypto.randomUUID(), isRegrow: true }],
              updatedAt: now(),
            };
          }),
        }));
      },

      addLog: (batchId, log) => {
        set(s => ({
          batches: s.batches.map(b => {
            if (b.id !== batchId) return b;
            return {
              ...b,
              logs: [{ ...log, id: crypto.randomUUID() }, ...b.logs],
              updatedAt: now(),
            };
          }),
        }));
      },

      deleteLog: (batchId, logId) => {
        set(s => ({
          batches: s.batches.map(b => {
            if (b.id !== batchId) return b;
            return {
              ...b,
              logs: b.logs.filter(l => l.id !== logId),
              updatedAt: now(),
            };
          }),
        }));
      },

      updateSettings: (updates) => {
        set(s => ({ settings: { ...s.settings, ...updates } }));
      },

      exportData: () => {
        const { batches, settings } = get();
        return JSON.stringify({ batches, settings }, null, 2);
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json) as { batches?: unknown; settings?: unknown };
          if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.batches)) return false;
          set({
            batches: parsed.batches as Batch[],
            settings: (parsed.settings as Settings) ?? DEFAULT_SETTINGS,
          });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () => {
        set({ batches: [], settings: DEFAULT_SETTINGS });
      },
    }),
    {
      name: 'ponicpad-store',
      version: 1,
    }
  )
);
