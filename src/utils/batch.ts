import { PLANT_DEFAULTS, STATUS_ORDER } from '../constants';
import type { Batch, BatchStatus, Urgency } from '../types';
import { daysElapsed, daysUntilHarvest, computeExpectedStatus } from './dates';

export function getAutoStatus(batch: Batch): BatchStatus {
  if (batch.status === 'harvested' || batch.status === 'archived') return batch.status;
  return computeExpectedStatus(batch.seedingDate, batch.plantType);
}

export function getBatchUrgency(batch: Batch): Urgency {
  if (batch.status === 'archived' || batch.status === 'harvested') return 'healthy';
  const days = daysUntilHarvest(batch.expectedHarvestDate);
  if (days <= 0 && batch.status === 'ready') return 'overdue';
  const autoStatus = getAutoStatus(batch);
  const autoIdx = STATUS_ORDER.indexOf(autoStatus);
  const currentIdx = STATUS_ORDER.indexOf(batch.status);
  if (days <= 3 || autoIdx > currentIdx) return 'attention';
  return 'healthy';
}

export function getBatchProgress(batch: Batch): number {
  if (batch.status === 'harvested' || batch.status === 'archived') return 1;
  const plantType = batch.plantType;
  const totalDays = plantType === 'custom' ? 30 : PLANT_DEFAULTS[plantType].daysToHarvest;
  const elapsed = daysElapsed(batch.seedingDate);
  return Math.min(Math.max(elapsed / totalDays, 0), 1);
}

export function getActiveBatches(batches: Batch[]): Batch[] {
  return batches.filter(b => b.status !== 'harvested' && b.status !== 'archived');
}

export function getBatchesNeedingAttention(batches: Batch[]): Batch[] {
  return getActiveBatches(batches).filter(b => getBatchUrgency(b) !== 'healthy');
}

export function advanceStatus(current: BatchStatus): BatchStatus {
  const idx = STATUS_ORDER.indexOf(current);
  const next = STATUS_ORDER[idx + 1];
  return next ?? current;
}

export function canAdvanceStatus(status: BatchStatus): boolean {
  return status !== 'harvested' && status !== 'archived';
}
