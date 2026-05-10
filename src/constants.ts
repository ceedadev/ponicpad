import type { BatchStatus, PlantType } from './types';

export interface PlantDefaults {
  daysToHarvest: number;
  daysGermination: number;
  daysSeedling: number;
  ecRange: [number, number];
  ecSeedling: [number, number];
  phRange: [number, number];
  tempRange: [number, number];
  canRegrow: boolean;
  regrowCount: number;
}

export const PLANT_DEFAULTS: Record<Exclude<PlantType, 'custom'>, PlantDefaults> = {
  kangkung: {
    daysToHarvest: 25,
    daysGermination: 3,
    daysSeedling: 7,
    ecRange: [1.0, 2.5],
    ecSeedling: [0.5, 0.8],
    phRange: [5.5, 6.5],
    tempRange: [24, 30],
    canRegrow: true,
    regrowCount: 3,
  },
  lettuce: {
    daysToHarvest: 42,
    daysGermination: 4,
    daysSeedling: 10,
    ecRange: [0.8, 1.6],
    ecSeedling: [0.5, 0.8],
    phRange: [6.0, 7.0],
    tempRange: [18, 24],
    canRegrow: true,
    regrowCount: 2,
  },
  kale: {
    daysToHarvest: 63,
    daysGermination: 6,
    daysSeedling: 14,
    ecRange: [2.0, 3.5],
    ecSeedling: [0.5, 0.8],
    phRange: [5.5, 6.5],
    tempRange: [16, 22],
    canRegrow: true,
    regrowCount: 6,
  },
};

export const STATUS_ORDER: BatchStatus[] = [
  'germinating',
  'seedling',
  'vegetative',
  'ready',
  'harvested',
  'archived',
];

export const PLANT_EMOJIS: Record<PlantType, string> = {
  kangkung: '🌿',
  lettuce: '🥬',
  kale: '🥦',
  custom: '🌱',
};

export const PLANT_LABELS: Record<PlantType, string> = {
  kangkung: 'Kangkung',
  lettuce: 'Lettuce',
  kale: 'Kale',
  custom: 'Custom',
};

export const STATUS_LABELS: Record<BatchStatus, string> = {
  germinating: 'Germinating',
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  ready: 'Ready to Harvest',
  harvested: 'Harvested',
  archived: 'Archived',
};

export interface PlantReferenceEntry {
  daysToHarvest: string;
  idealTemp: string;
  ec: string;
  ph: string;
  cutAndComeAgain: string;
  tropicalSuitability: string;
  commonIssues: string[];
  tips: string[];
}

export const PLANT_REFERENCE: Record<Exclude<PlantType, 'custom'>, PlantReferenceEntry> = {
  kangkung: {
    daysToHarvest: '20–30 days',
    idealTemp: '24–30°C',
    ec: '1.0–2.5 mS/cm',
    ph: '5.5–6.5',
    cutAndComeAgain: 'Yes — cut 5cm above base, regrows 2–3×',
    tropicalSuitability: 'Excellent — thrives in Indonesian heat',
    commonIssues: ['Root rot if pump fails', 'Aphid infestations', 'Yellowing from nitrogen deficiency'],
    tips: [
      'Harvest early morning for best flavor',
      'Keep pump running 24/7 or on 15-min cycles',
      'Thin seedlings to 2–3 per cup for best yield',
    ],
  },
  lettuce: {
    daysToHarvest: '35–50 days',
    idealTemp: '18–24°C',
    ec: '0.8–1.6 mS/cm',
    ph: '6.0–7.0',
    cutAndComeAgain: 'Outer-leaf harvest recommended',
    tropicalSuitability: 'Moderate — needs afternoon shade, use heat-tolerant varieties (Butterhead, Batavia, Muir)',
    commonIssues: ['Bolting in high heat', 'Tip burn from low calcium', 'Fungal issues in high humidity'],
    tips: [
      'Add shade cloth (50%) during afternoon hours',
      'Keep reservoir below 25°C with ice bottles if needed',
      'Use calcium-rich water or add CaCl₂ supplement',
    ],
  },
  kale: {
    daysToHarvest: '55–70 days',
    idealTemp: '16–22°C',
    ec: '2.0–3.5 mS/cm',
    ph: '5.5–6.5',
    cutAndComeAgain: 'Yes — harvest lower leaves first, productive 2–3 months',
    tropicalSuitability: 'Difficult — needs cooling, choose Siberian or Lacinato varieties',
    commonIssues: ['Heat stress above 30°C', 'Wilting in midday heat', 'Slow growth in tropical climate'],
    tips: [
      'Grow in a shaded or indoor area with fan circulation',
      'Harvest outer leaves regularly to encourage new growth',
      'Consider growing only in cooler months (May–September)',
    ],
  },
};

export interface TroubleshootingEntry {
  symptom: string;
  causes: string[];
  fixes: string[];
}

export const TROUBLESHOOTING_ENTRIES: TroubleshootingEntry[] = [
  {
    symptom: 'Yellowing leaves (chlorosis)',
    causes: ['Nitrogen deficiency', 'Iron deficiency (high pH)', 'Overwatering/root rot'],
    fixes: ['Check EC — increase nutrient strength', 'Adjust pH to 5.5–6.5 range', 'Inspect roots — healthy roots are white'],
  },
  {
    symptom: 'Brown or slimy roots',
    causes: ['Root rot (Pythium)', 'Low dissolved oxygen', 'High water temperature'],
    fixes: ['Add air stone to reservoir', 'Keep water below 22°C', 'Use Hydroguard or beneficial bacteria', 'Flush and sterilize reservoir'],
  },
  {
    symptom: 'Wilting despite adequate water',
    causes: ['Heat stress', 'Root damage', 'Low nutrient uptake'],
    fixes: ['Add shade cloth', 'Check pump — ensure water is flowing', 'Inspect roots for damage or rot'],
  },
  {
    symptom: 'Bolting (flowering prematurely)',
    causes: ['High temperature', 'Long daylight hours', 'Plant stress'],
    fixes: ['Harvest immediately — quality declines after bolting', 'Use bolt-resistant varieties next cycle', 'Reduce light hours or add shade'],
  },
  {
    symptom: 'White crusty deposits on cups/tower',
    causes: ['Mineral buildup from hard water', 'Evaporation concentrating salts'],
    fixes: ['Wipe with diluted vinegar solution', 'Flush reservoir with plain water weekly', 'Use filtered or RO water if TDS > 300 ppm'],
  },
];

export interface FAQEntry {
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FAQEntry[] = [
  {
    question: 'How often should I flush the reservoir?',
    answer: 'Every 7–14 days for active growth. Flush with clean water, then refill with fresh nutrient solution. This prevents salt buildup and pathogen growth.',
  },
  {
    question: 'What pump timer schedule should I use?',
    answer: 'For tower systems: 15 minutes on, 45 minutes off (or continuous for young seedlings). Roots need both nutrient flow and oxygen exposure.',
  },
  {
    question: 'How do I know when to harvest?',
    answer: 'Check the batch\'s days remaining. For kangkung, leaves should be 20–30cm tall. For lettuce, heads should feel firm. For kale, harvest when leaves are 15–20cm. Taste is the best indicator.',
  },
  {
    question: 'Can I mix different plants in the same tower?',
    answer: 'Possible but not ideal — different plants have different EC and pH requirements. If mixing, use the lowest common EC target (typically 0.8–1.2 mS/cm) and a mid-range pH of 6.0.',
  },
  {
    question: 'Why is my nutrient solution green?',
    answer: 'Algae growth from light exposure. Cover your reservoir completely with dark material. Flush the system and clean the reservoir. Algae compete with plants for nutrients and oxygen.',
  },
  {
    question: 'What AB Mix ratio should I use?',
    answer: 'Standard is 5ml of Part A + 5ml of Part B per liter of water for full strength. Always add A first, stir, then add B — never mix A and B concentrates directly together.',
  },
];
