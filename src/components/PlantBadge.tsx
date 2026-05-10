import React from 'react';
import type { PlantType } from '../types';
import { PLANT_EMOJIS, PLANT_LABELS } from '../constants';

interface Props {
  plantType: PlantType;
  customName?: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<PlantType, string> = {
  kangkung: 'bg-green-100 text-green-800',
  lettuce: 'bg-lime-100 text-lime-800',
  kale: 'bg-emerald-100 text-emerald-800',
  custom: 'bg-blue-100 text-blue-800',
};

export default function PlantBadge({ plantType, customName, size = 'md' }: Props) {
  const label = plantType === 'custom' && customName ? customName : PLANT_LABELS[plantType];
  const emoji = PLANT_EMOJIS[plantType];
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colorMap[plantType]} ${sizeClass}`}>
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
