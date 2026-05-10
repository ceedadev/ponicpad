export type PlantType = 'kangkung' | 'lettuce' | 'kale' | 'custom';

export type BatchStatus =
  | 'germinating'
  | 'seedling'
  | 'vegetative'
  | 'ready'
  | 'harvested'
  | 'archived';

export type Page =
  | 'dashboard'
  | 'batches'
  | 'batch-detail'
  | 'nutrients'
  | 'schedule'
  | 'reference'
  | 'settings';

export interface RouterState {
  page: Page;
  batchId?: string;
}

export interface BatchLog {
  id: string;
  date: string;
  note: string;
  pH?: number;
  ec?: number;
  waterTemp?: number;
}

export interface HarvestEntry {
  id: string;
  date: string;
  weightGrams?: number;
  notes?: string;
  isRegrow: boolean;
}

export interface Batch {
  id: string;
  name: string;
  plantType: PlantType;
  customPlantName?: string;
  seedingDate: string;
  expectedHarvestDate: string;
  slotCount: number;
  towerSlot?: string;
  status: BatchStatus;
  logs: BatchLog[];
  harvests: HarvestEntry[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  userName?: string;
  towerName?: string;
  baseTDS: number;
  abMixRatioPerLiter: number;
  notificationsEnabled: boolean;
}

export type Urgency = 'healthy' | 'attention' | 'overdue';
