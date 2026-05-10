# Hydroponics Tower Companion — Web Application Spec

## Overview

A single-page web application to guide home hydroponic tower growers through plant management, grow tracking, nutrient calculation, and harvest scheduling. Designed for tropical home growers (Indonesia context), supporting kangkung, lettuce, and kale as primary crops with extensibility for more.

**Target user:** Home hobbyist with 1–2 grow towers, growing for personal/family consumption.  
**Primary goal:** Help the user never miss a seeding, feeding, or harvest window.

---

## Tech Stack (suggested)

| Layer | Choice |
|---|---|
| Framework | React (Vite) or TanStack Start |
| Styling | Tailwind CSS |
| State | Zustand or React Context |
| Storage | localStorage (MVP) → optional Postgres/Drizzle later |
| Charts | Recharts |
| Notifications | Browser Notification API (optional) |

---

## Pages / Sections

### 1. Dashboard (`/`)

**Purpose:** At-a-glance view of all active batches and what needs attention today.

**Components:**
- `TodayAlerts` — surface any batch that is due for harvest, pH check, or reservoir flush
- `ActiveBatches` — card grid of all in-progress plant batches with progress bar (days elapsed / days to harvest)
- `QuickStats` — total active slots, next harvest date, days since last reservoir flush
- `QuickSeedButton` — CTA to start a new batch

**Data shown per batch card:**
- Plant type (kangkung / lettuce / kale)
- Batch name (user-defined, e.g. "Kangkung A")
- Seeding date
- Expected harvest date (auto-calculated from plant type default)
- Current growth stage (germination / seedling / vegetative / ready to harvest)
- Days remaining to harvest
- Tower slot label (optional, e.g. "Tower 1 – Slot 3")

---

### 2. Batch Management (`/batches`)

**Purpose:** Create, view, edit, and archive all plant batches.

#### New Batch Form fields:
- Plant type (dropdown: kangkung / lettuce / kale / custom)
- Batch name (text)
- Seeding date (date picker, defaults to today)
- Number of slots/cups (number)
- Tower assignment (text, optional)
- Notes (textarea)

On submit: auto-calculate expected harvest date based on plant type defaults (see Plant Data below).

#### Batch detail view:
- Timeline of growth stages with actual vs expected dates
- Log entries (user can add notes/observations per date)
- Harvest log (date, weight/volume harvested, notes)
- Action buttons: Mark as Harvested, Regrow (cut-and-come-again), Archive

#### Batch statuses:
`germinating` → `seedling` → `vegetative` → `ready` → `harvested` → `archived`

---

### 3. Nutrient Calculator (`/nutrients`)

**Purpose:** Help user mix the correct nutrient solution for their reservoir.

**Inputs:**
- Reservoir volume (liters)
- Plant type (affects target EC range)
- Growth stage (seedling = half strength, vegetative/mature = full strength)
- Base water TDS (ppm) — user enters their tap water reading

**Outputs:**
- Target EC range (mS/cm)
- Target pH range
- AB Mix A dosage (ml) — based on standard AB Mix ratio (5ml A per 1L for full strength, user can override ratio)
- AB Mix B dosage (ml)
- pH adjustment guidance (add pH down if >6.5, pH up if <5.5)
- Warning if base TDS is high (>300 ppm suggests using filtered/RO water)

**Plant EC reference data:**

| Plant | Seedling EC | Full EC | pH range |
|---|---|---|---|
| Kangkung | 0.5–0.8 | 1.0–2.5 | 5.5–6.5 |
| Lettuce | 0.5–0.8 | 0.8–1.6 | 6.0–7.0 |
| Kale | 0.5–0.8 | 2.0–3.5 | 5.5–6.5 |

---

### 4. Harvest Schedule (`/schedule`)

**Purpose:** Visual calendar/timeline of upcoming and past harvests across all batches.

**Views:**
- Weekly view (default) — shows which batches are harvestable this week
- Monthly view — gantt-style bars per batch showing seed → harvest window
- Stagger planner — interactive tool to plan new seedings so harvests are distributed evenly across weeks

**Stagger planner logic:**
- User inputs: desired harvest frequency (daily / every 2 days / weekly), number of tower slots available
- Output: recommended seeding schedule (e.g. "Seed 4 kangkung cups every 7 days starting Monday")

---

### 5. Plant Reference (`/reference`)

**Purpose:** Built-in knowledge base so the user doesn't need to leave the app.

**Content per plant:**

#### Kangkung
- Days to harvest: 20–30
- Ideal temp: 24–30°C
- EC: 1.0–2.5 mS/cm
- pH: 5.5–6.5
- Cut-and-come-again: yes (cut 5cm above base, regrows 2–3x)
- Tropical suitability: excellent
- Common issues: root rot if pump fails, aphids

#### Lettuce
- Days to harvest: 35–50
- Ideal temp: 18–24°C
- EC: 0.8–1.6 mS/cm
- pH: 6.0–7.0
- Cut-and-come-again: outer-leaf harvest recommended
- Tropical suitability: moderate — needs afternoon shade, use heat-tolerant varieties (Butterhead, Batavia, Muir)
- Common issues: bolting in high heat, tip burn from low calcium

#### Kale
- Days to harvest: 55–70
- Ideal temp: 16–22°C
- EC: 2.0–3.5 mS/cm
- pH: 5.5–6.5
- Cut-and-come-again: yes — harvest lower leaves first, plant stays productive 2–3 months
- Tropical suitability: difficult — needs cooling, choose Siberian or Lacinato varieties
- Common issues: heat stress, wilting, slow growth >30°C

**Also include:**
- Troubleshooting section: yellowing leaves, brown roots, wilting, bolting, pest guide
- General hydroponics FAQ (tower system, pump timer, reservoir flush schedule)

---

### 6. Settings (`/settings`)

- User name / tower name
- Default AB Mix ratio (ml per liter, editable)
- Base water TDS (saved, used as default in calculator)
- Notification preferences (browser push: harvest reminders, pH check reminders, flush reminders)
- Data export (JSON download of all batches)
- Data import (restore from JSON)
- Reset all data

---

## Data Models

### `Batch`
```ts
interface Batch {
  id: string
  name: string
  plantType: 'kangkung' | 'lettuce' | 'kale' | 'custom'
  customPlantName?: string
  seedingDate: string          // ISO date
  expectedHarvestDate: string  // ISO date, auto-calculated
  slotCount: number
  towerSlot?: string
  status: 'germinating' | 'seedling' | 'vegetative' | 'ready' | 'harvested' | 'archived'
  logs: BatchLog[]
  harvests: HarvestEntry[]
  notes?: string
  createdAt: string
  updatedAt: string
}
```

### `BatchLog`
```ts
interface BatchLog {
  id: string
  date: string
  note: string
  pH?: number
  ec?: number
  waterTemp?: number
}
```

### `HarvestEntry`
```ts
interface HarvestEntry {
  id: string
  date: string
  weightGrams?: number
  notes?: string
  isRegrow: boolean   // true if cut-and-come-again, false if full harvest
}
```

### `Settings`
```ts
interface Settings {
  userName?: string
  towerName?: string
  baseTDS: number             // ppm, default 200
  abMixRatioPerLiter: number  // ml, default 5
  notificationsEnabled: boolean
}
```

---

## Plant Defaults (constants)

```ts
const PLANT_DEFAULTS = {
  kangkung: {
    daysToHarvest: 25,       // midpoint of 20–30
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
    regrowCount: 6,   // productive for months
  },
}
```

---

## Key UX Rules

1. **Mobile-first.** User will likely check this from their phone while standing at the tower.
2. **No login required for MVP.** All data in localStorage.
3. **Dates always shown in human-readable format** (e.g. "in 5 days", "3 days ago") alongside ISO date.
4. **Color coding:** green = healthy/on track, amber = attention needed soon, red = overdue/issue.
5. **Destructive actions** (archive, delete) require a confirmation step.
6. **Offline-capable.** No network dependency for core features.

---

## Suggested Build Order (MVP → Full)

### Phase 1 — MVP
- [ ] Dashboard with active batch cards
- [ ] New batch form (kangkung, lettuce, kale)
- [ ] Auto-calculated harvest date
- [ ] localStorage persistence
- [ ] Batch status progression (manual stage updates)

### Phase 2 — Useful
- [ ] Nutrient calculator
- [ ] Batch log entries (pH, EC, notes per date)
- [ ] Harvest log with weight tracking
- [ ] Plant reference pages

### Phase 3 — Nice to have
- [ ] Calendar / schedule view
- [ ] Stagger planner
- [ ] Browser push notifications
- [ ] JSON export/import
- [ ] PWA manifest (installable on home screen)

---

## Notes for Agent

- Keep all state management simple — Zustand with persist middleware over localStorage is the recommended approach.
- Use `date-fns` for all date calculations (days between, add days, format relative).
- Avoid over-engineering: this is a personal home tool, not a SaaS product. No auth, no backend for MVP.
- The nutrient calculator is a pure function — no side effects, easily testable.
- Batch status should auto-advance based on elapsed days (compare today vs seeding date + stage thresholds), but the user can also manually override.
- All plant reference content is static — hardcode it, no CMS needed.
- The app should work entirely offline once loaded (cache assets via service worker in Phase 3).
