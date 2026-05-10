import React from 'react';
import NutrientForm from '../components/NutrientForm';

export default function Nutrients() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Nutrient Calculator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Calculate AB Mix dosage for your reservoir. Adjust ratio in Settings if your mix differs.
        </p>
      </div>
      <NutrientForm />
    </div>
  );
}
