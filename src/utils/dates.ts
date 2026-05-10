import {
  differenceInDays,
  addDays,
  formatDistanceToNowStrict,
  isToday,
  format,
  parseISO,
} from 'date-fns';
import { PLANT_DEFAULTS } from '../constants';
import type { BatchStatus, PlantType } from '../types';

export function humanizeDate(isoDate: string): string {
  const date = parseISO(isoDate);
  if (isToday(date)) return 'today';
  const days = differenceInDays(date, new Date());
  if (days > 0) return `in ${days} day${days === 1 ? '' : 's'}`;
  const absDays = Math.abs(days);
  return `${absDays} day${absDays === 1 ? '' : 's'} ago`;
}

export function shortDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d, yyyy');
}

export function daysElapsed(seedingDate: string): number {
  return differenceInDays(new Date(), parseISO(seedingDate));
}

export function daysUntilHarvest(expectedHarvestDate: string): number {
  return differenceInDays(parseISO(expectedHarvestDate), new Date());
}

export function calcExpectedHarvestDate(seedingDate: string, plantType: PlantType): string {
  const days = plantType === 'custom' ? 30 : PLANT_DEFAULTS[plantType].daysToHarvest;
  return addDays(parseISO(seedingDate), days).toISOString().split('T')[0]!;
}

export function computeExpectedStatus(seedingDate: string, plantType: PlantType): BatchStatus {
  if (plantType === 'custom') return 'vegetative';
  const elapsed = daysElapsed(seedingDate);
  const defaults = PLANT_DEFAULTS[plantType];
  if (elapsed < 0) return 'germinating';
  if (elapsed < defaults.daysGermination) return 'germinating';
  if (elapsed < defaults.daysGermination + defaults.daysSeedling) return 'seedling';
  if (elapsed < defaults.daysToHarvest) return 'vegetative';
  return 'ready';
}

export function formatRelativeWithDate(isoDate: string): string {
  return `${humanizeDate(isoDate)} (${shortDate(isoDate)})`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]!;
}
