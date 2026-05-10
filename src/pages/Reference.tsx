import React, { useState } from 'react';
import type { PlantType } from '../types';
import { PLANT_REFERENCE, PLANT_EMOJIS, TROUBLESHOOTING_ENTRIES, FAQ_ENTRIES } from '../constants';
import { PLANT_DEFAULTS } from '../constants';

type PlantKey = Exclude<PlantType, 'custom'>;
const PLANTS: PlantKey[] = ['kangkung', 'lettuce', 'kale'];

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 bg-white border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Reference() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Plant Reference</h1>
        <p className="text-sm text-gray-500 mt-1">Growing guides for your hydroponic tower</p>
      </div>

      <div className="flex flex-col gap-3">
        {PLANTS.map(plant => {
          const ref = PLANT_REFERENCE[plant];
          const defaults = PLANT_DEFAULTS[plant];
          return (
            <Accordion key={plant} title={`${PLANT_EMOJIS[plant]} ${plant.charAt(0).toUpperCase() + plant.slice(1)}`} defaultOpen={plant === 'kangkung'}>
              <div className="flex flex-col gap-3 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Days to harvest" value={ref.daysToHarvest} />
                  <StatCard label="Ideal temp" value={ref.idealTemp} />
                  <StatCard label="EC target" value={ref.ec} />
                  <StatCard label="pH range" value={ref.ph} />
                </div>

                <div className="bg-green-50 rounded-xl px-3 py-2">
                  <p className="text-xs font-medium text-green-700 mb-0.5">Tropical suitability</p>
                  <p className="text-sm text-green-800">{ref.tropicalSuitability}</p>
                </div>

                <div className="bg-blue-50 rounded-xl px-3 py-2">
                  <p className="text-xs font-medium text-blue-700 mb-0.5">Cut-and-come-again</p>
                  <p className="text-sm text-blue-800">{ref.cutAndComeAgain}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-600">Common issues</p>
                  <ul className="flex flex-col gap-1">
                    {ref.commonIssues.map((issue, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-red-400 shrink-0 mt-0.5">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-600">Tips</p>
                  <ul className="flex flex-col gap-1">
                    {ref.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Accordion>
          );
        })}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">Troubleshooting</h2>
        <div className="flex flex-col gap-3">
          {TROUBLESHOOTING_ENTRIES.map((entry, i) => (
            <Accordion key={i} title={`⚠️ ${entry.symptom}`}>
              <div className="flex flex-col gap-3 pt-3">
                <div>
                  <p className="text-xs font-medium text-amber-700 mb-1">Possible causes</p>
                  <ul className="flex flex-col gap-1">
                    {entry.causes.map((c, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-700 mb-1">Fixes</p>
                  <ul className="flex flex-col gap-1">
                    {entry.fixes.map((f, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 shrink-0 mt-0.5">→</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Accordion>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-3">FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQ_ENTRIES.map((entry, i) => (
            <Accordion key={i} title={entry.question}>
              <p className="text-sm text-gray-600 pt-3">{entry.answer}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}
