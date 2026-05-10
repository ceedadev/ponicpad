import { PLANT_DEFAULTS } from '../constants';
import type { PlantType } from '../types';

export interface NutrientInput {
  reservoirLiters: number;
  plantType: PlantType;
  growthStage: 'seedling' | 'vegetative' | 'mature';
  baseTDS: number;
  abMixRatioPerLiter: number;
}

export interface NutrientResult {
  targetECMin: number;
  targetECMax: number;
  targetPHMin: number;
  targetPHMax: number;
  mixAMl: number;
  mixBMl: number;
  baseTDSWarning: boolean;
  phAdjustmentAdvice: string;
  strengthLabel: string;
  strengthFactor: number;
}

export function calculateNutrients(input: NutrientInput): NutrientResult {
  const { reservoirLiters, plantType, growthStage, baseTDS, abMixRatioPerLiter } = input;

  const isSeedling = growthStage === 'seedling';
  const strengthFactor = isSeedling ? 0.5 : 1.0;
  const strengthLabel = isSeedling ? 'half strength (seedling)' : 'full strength';

  let ecMin: number;
  let ecMax: number;
  let phMin: number;
  let phMax: number;

  if (plantType === 'custom') {
    ecMin = isSeedling ? 0.5 : 1.0;
    ecMax = isSeedling ? 0.8 : 2.0;
    phMin = 5.8;
    phMax = 6.5;
  } else {
    const defaults = PLANT_DEFAULTS[plantType];
    const ecRange = isSeedling ? defaults.ecSeedling : defaults.ecRange;
    ecMin = ecRange[0];
    ecMax = ecRange[1];
    phMin = defaults.phRange[0];
    phMax = defaults.phRange[1];
  }

  const mixAMl = Math.round(reservoirLiters * abMixRatioPerLiter * strengthFactor);
  const mixBMl = mixAMl;

  const baseTDSWarning = baseTDS > 300;

  const phMid = (phMin + phMax) / 2;
  let phAdjustmentAdvice: string;
  if (phMid > 6.5) {
    phAdjustmentAdvice = `Target pH ${phMin}–${phMax}. After mixing, test reservoir pH. Add pH Down (phosphoric acid) if above ${phMax}.`;
  } else if (phMid < 5.8) {
    phAdjustmentAdvice = `Target pH ${phMin}–${phMax}. After mixing, test reservoir pH. Add pH Up (potassium hydroxide) if below ${phMin}.`;
  } else {
    phAdjustmentAdvice = `Target pH ${phMin}–${phMax}. After mixing, test reservoir pH and adjust with pH Up or Down as needed.`;
  }

  return {
    targetECMin: ecMin,
    targetECMax: ecMax,
    targetPHMin: phMin,
    targetPHMax: phMax,
    mixAMl,
    mixBMl,
    baseTDSWarning,
    phAdjustmentAdvice,
    strengthLabel,
    strengthFactor,
  };
}
