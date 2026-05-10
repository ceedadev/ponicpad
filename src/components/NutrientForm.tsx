import React, { useState } from 'react';
import { useStore } from '../store';
import type { PlantType } from '../types';
import { PLANT_LABELS } from '../constants';
import { calculateNutrients, type NutrientResult } from '../utils/nutrients';
import PlantBadge from './PlantBadge';

type GrowthStage = 'seedling' | 'vegetative' | 'mature';

export default function NutrientForm() {
  const settings = useStore(s => s.settings);

  const [reservoirLiters, setReservoirLiters] = useState(20);
  const [plantType, setPlantType] = useState<PlantType>('kangkung');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('vegetative');
  const [baseTDS, setBaseTDS] = useState(settings.baseTDS);
  const [abRatio, setAbRatio] = useState(settings.abMixRatioPerLiter);

  const result: NutrientResult = calculateNutrients({
    reservoirLiters,
    plantType,
    growthStage,
    baseTDS,
    abMixRatioPerLiter: abRatio,
  });

  const plantTypes: PlantType[] = ['kangkung', 'lettuce', 'kale', 'custom'];
  const stages: { value: GrowthStage; label: string }[] = [
    { value: 'seedling', label: 'Seedling' },
    { value: 'vegetative', label: 'Vegetative' },
    { value: 'mature', label: 'Mature' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800">Inputs</h3>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Reservoir volume (liters)</label>
          <input
            type="number"
            min={1}
            max={500}
            value={reservoirLiters}
            onChange={e => setReservoirLiters(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Plant type</label>
          <div className="grid grid-cols-2 gap-2">
            {plantTypes.map(pt => (
              <button
                key={pt}
                type="button"
                onClick={() => setPlantType(pt)}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Growth stage</label>
          <div className="flex gap-2">
            {stages.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setGrowthStage(s.value)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                  growthStage === s.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Base water TDS (ppm)</label>
          <input
            type="number"
            min={0}
            max={2000}
            value={baseTDS}
            onChange={e => setBaseTDS(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">AB Mix ratio (ml per liter)</label>
          <input
            type="number"
            min={1}
            max={20}
            step={0.5}
            value={abRatio}
            onChange={e => setAbRatio(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400">Standard: 5 ml/L for full strength</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800">Results — {result.strengthLabel}</h3>

        {result.baseTDSWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-amber-800">
            ⚠️ Your tap water TDS ({baseTDS} ppm) is high. Consider using filtered or RO water for better results.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Target EC</div>
            <div className="text-lg font-bold text-green-700">
              {result.targetECMin}–{result.targetECMax}
            </div>
            <div className="text-xs text-gray-400">mS/cm</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Target pH</div>
            <div className="text-lg font-bold text-blue-700">
              {result.targetPHMin}–{result.targetPHMax}
            </div>
            <div className="text-xs text-gray-400">pH units</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <div className="text-sm font-medium text-gray-800">AB Mix Part A</div>
              <div className="text-xs text-gray-400">Add to reservoir first</div>
            </div>
            <div className="text-xl font-bold text-green-700">{result.mixAMl} ml</div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <div className="text-sm font-medium text-gray-800">AB Mix Part B</div>
              <div className="text-xs text-gray-400">Add after Part A</div>
            </div>
            <div className="text-xl font-bold text-green-700">{result.mixBMl} ml</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-sm text-blue-800">
          💧 {result.phAdjustmentAdvice}
        </div>
      </div>
    </div>
  );
}
