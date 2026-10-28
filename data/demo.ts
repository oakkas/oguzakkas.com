// Synthetic documents for the extraction demo, with the answer key used to score
// each run. The images are rendered from scripts/demo-samples/*.html by
// scripts/render-demo-samples.sh. No real patient data is involved.

export type DemoTask = 'lab' | 'meds';

export type DemoSample = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  task: DemoTask;
};

export type LabResult = { test: string; value: string; unit: string; referenceRange: string; flag: string };
export type LabExtraction = { results: LabResult[]; handwrittenNotes?: string[] };
export type Medication = { drug: string; dose: string; route: string; frequency: string };
export type AdverseEvent = { drug: string; reaction: string };
export type MedExtraction = { medications: Medication[]; adverseEvents: AdverseEvent[] };
export type Extraction = LabExtraction | MedExtraction;

export type DemoRun = {
  result: Extraction;
  model: string;
  ms: number;
  inputTokens: number;
  outputTokens: number;
  ranAt: string;
};

export const demoSamples: DemoSample[] = [
  {
    id: 'lab-report-typed',
    title: 'Typed lab report',
    description: 'A clean, computer-generated report with metabolic, lipid, and A1c results.',
    image: '/demo/lab-report-typed.webp',
    alt: 'Synthetic typed laboratory report for a fictional patient, Jane Sample, listing eleven test results',
    task: 'lab',
  },
  {
    id: 'lab-report-photo',
    title: 'Phone photo + handwriting',
    description: 'A blood count report photographed at an angle, with handwritten notes.',
    image: '/demo/lab-report-photo.webp',
    alt: 'Synthetic photo of a printed blood count report on a desk, with handwritten notes in blue ink',
    task: 'lab',
  },
  {
    id: 'clinical-note-fax',
    title: 'Faxed clinical note',
    description: 'A discharge summary with medications and an adverse drug reaction, in the style of the n2c2 2018 challenge.',
    image: '/demo/clinical-note-fax.webp',
    alt: 'Synthetic faxed hospital discharge summary excerpt listing medications and a drug rash',
    task: 'meds',
  },
];

type LabAnswer = LabResult & { aliases: string[] };

const labAnswers: Record<string, LabAnswer[]> = {
  'lab-report-typed': [
    { test: 'Glucose', aliases: ['glucose'], value: '112', unit: 'mg/dL', referenceRange: '70 - 99', flag: 'H' },
    { test: 'Sodium', aliases: ['sodium'], value: '139', unit: 'mmol/L', referenceRange: '134 - 144', flag: '' },
    { test: 'Potassium', aliases: ['potassium'], value: '3.3', unit: 'mmol/L', referenceRange: '3.5 - 5.2', flag: 'L' },
    { test: 'Creatinine', aliases: ['creatinine'], value: '0.86', unit: 'mg/dL', referenceRange: '0.57 - 1.00', flag: '' },
    { test: 'eGFR', aliases: ['egfr'], value: '88', unit: 'mL/min/1.73m²', referenceRange: '>59', flag: '' },
    { test: 'ALT (SGPT)', aliases: ['alt', 'sgpt'], value: '22', unit: 'U/L', referenceRange: '0 - 32', flag: '' },
    { test: 'Cholesterol, Total', aliases: ['cholesteroltotal', 'totalcholesterol'], value: '214', unit: 'mg/dL', referenceRange: '<200', flag: 'H' },
    { test: 'LDL Cholesterol', aliases: ['ldl'], value: '138', unit: 'mg/dL', referenceRange: '<100', flag: 'H' },
    { test: 'HDL Cholesterol', aliases: ['hdl'], value: '48', unit: 'mg/dL', referenceRange: '>39', flag: '' },
    { test: 'Triglycerides', aliases: ['triglyceride'], value: '142', unit: 'mg/dL', referenceRange: '<150', flag: '' },
    { test: 'Hemoglobin A1c', aliases: ['a1c'], value: '6.1', unit: '%', referenceRange: '4.8 - 5.6', flag: 'H' },
  ],
  'lab-report-photo': [
    { test: 'WBC', aliases: ['wbc', 'whitebloodcell'], value: '11.8', unit: 'x10E3/uL', referenceRange: '3.4-10.8', flag: 'H' },
    { test: 'RBC', aliases: ['rbc', 'redbloodcell'], value: '3.92', unit: 'x10E6/uL', referenceRange: '3.77-5.28', flag: '' },
    { test: 'Hemoglobin', aliases: ['hemoglobin', 'hgb'], value: '10.6', unit: 'g/dL', referenceRange: '11.1-15.9', flag: 'L' },
    { test: 'Hematocrit', aliases: ['hematocrit', 'hct'], value: '33.1', unit: '%', referenceRange: '34.0-46.6', flag: 'L' },
    { test: 'MCV', aliases: ['mcv'], value: '84', unit: 'fL', referenceRange: '79-97', flag: '' },
    { test: 'Platelets', aliases: ['platelet', 'plt'], value: '468', unit: 'x10E3/uL', referenceRange: '150-450', flag: 'H' },
    { test: 'Neutrophils', aliases: ['neutrophil'], value: '78', unit: '%', referenceRange: '40-74', flag: 'H' },
    { test: 'Lymphocytes', aliases: ['lymphocyte'], value: '15', unit: '%', referenceRange: '14-46', flag: '' },
  ],
};

const medAnswers: Record<string, MedExtraction> = {
  'clinical-note-fax': {
    medications: [
      { drug: 'Ceftriaxone', dose: '1 g', route: 'IV', frequency: 'daily' },
      { drug: 'Azithromycin', dose: '500 mg', route: 'PO', frequency: 'daily' },
      { drug: 'Levofloxacin', dose: '750 mg', route: 'PO', frequency: 'daily' },
      { drug: 'Diphenhydramine', dose: '25 mg', route: 'PO', frequency: 'every 6 hours as needed' },
      { drug: 'Metformin', dose: '500 mg', route: 'PO', frequency: 'twice daily' },
      { drug: 'Lisinopril', dose: '10 mg', route: 'PO', frequency: 'daily' },
    ],
    adverseEvents: [{ drug: 'Ceftriaxone', reaction: 'rash' }],
  },
};

// Normalizers: two answers count as the same when they differ only in formatting
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const firstNumber = (s: string) => {
  const match = s.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
};
const unitKey = (s: string) =>
  s.toLowerCase().replace(/[µμ]/g, 'u').replace(/×/g, 'x').replace(/²/g, '2')
    .replace(/[\^*\s]/g, '').replace(/10e/g, '10').replace(/^x/, '');
const rangeKey = (s: string) => {
  const t = s.replace(/[–—]/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/\s+/g, '');
  return `${(t.match(/[<>]=?/g) ?? []).join('')}|${(t.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).join(',')}`;
};
const flagKey = (s: string) => {
  const t = s.trim().toLowerCase();
  return t.startsWith('h') ? 'H' : t.startsWith('l') ? 'L' : '';
};
const doseKey = (s: string) => {
  const match = s.toLowerCase().replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(mcg|mg|grams?|gm|g|units?|ml)?/);
  if (!match) return squash(s);
  const unit = match[2] ?? '';
  return /^(g|gm|grams?)$/.test(unit) ? `${Number(match[1]) * 1000}mg` : `${Number(match[1])}${unit}`;
};
const routeKey = (s: string) => {
  const t = s.toLowerCase();
  if (/\b(po|oral|orally|by mouth)\b/.test(t)) return 'po';
  if (/\b(iv|intravenous|intravenously)\b/.test(t)) return 'iv';
  return squash(t);
};
const frequencyKey = (s: string) => {
  const t = s.toLowerCase();
  const asNeeded = /\bprn\b|as needed/.test(t);
  let base = squash(t);
  if (/q\s*6\s*h|every\s*(6|six)\s*hours?/.test(t)) base = 'q6h';
  else if (/\bbid\b|twice|(2|two) times|q\s*12\s*h|every\s*12\s*hours?/.test(t)) base = 'bid';
  else if (/daily|\bqd\b|once a day|every day|q\s*24\s*h|every\s*24\s*hours?/.test(t)) base = 'daily';
  return asNeeded ? `${base}+prn` : base;
};

export type FieldCheck = { field: string; expected: string; actual: string | null; ok: boolean };
export type RowCheck = { label: string; found: boolean; fields: FieldCheck[] };
export type CheckGroup = { title: string; columns: string[]; rows: RowCheck[]; extra: string[] };
export type Score = { correct: number; total: number; groups: CheckGroup[]; notes: string[] };

const check = (field: string, expected: string, actual: string | undefined, same: (a: string, b: string) => boolean): FieldCheck => ({
  field,
  expected,
  actual: actual ?? null,
  ok: actual !== undefined && same(expected, actual),
});

const scoreLab = (answers: LabAnswer[], result: Partial<LabExtraction>): Score => {
  const extracted = Array.isArray(result.results) ? result.results : [];
  const used = new Set<number>();
  const rows = answers.map(answer => {
    const names = extracted.map(r => squash(String(r?.test ?? '')));
    // Prefer an exact name match, then a name that contains one of the aliases
    let index = names.findIndex((name, i) => !used.has(i) && answer.aliases.includes(name));
    if (index < 0) index = names.findIndex((name, i) => !used.has(i) && answer.aliases.some(alias => name.includes(alias)));
    if (index >= 0) used.add(index);
    const row = index >= 0 ? extracted[index] : undefined;
    return {
      label: answer.test,
      found: Boolean(row),
      fields: [
        check('Result', answer.value, row?.value === undefined ? undefined : String(row.value), (a, b) => firstNumber(a) === firstNumber(b)),
        check('Unit', answer.unit, row?.unit, (a, b) => unitKey(a) === unitKey(b)),
        check('Range', answer.referenceRange, row?.referenceRange, (a, b) => rangeKey(a) === rangeKey(b)),
        check('Flag', answer.flag || '–', row ? flagKey(String(row.flag ?? '')) || '–' : undefined, (a, b) => a === b),
      ],
    };
  });
  const extra = extracted.filter((_, i) => !used.has(i)).map(r => String(r?.test ?? '(unnamed)'));
  const fields = rows.flatMap(r => r.fields);
  return {
    correct: fields.filter(f => f.ok).length,
    total: fields.length,
    groups: [{ title: 'Lab results', columns: ['Test', 'Result', 'Unit', 'Range', 'Flag'], rows, extra }],
    notes: Array.isArray(result.handwrittenNotes) ? result.handwrittenNotes.map(String) : [],
  };
};

const scoreMeds = (answers: MedExtraction, result: Partial<MedExtraction>): Score => {
  const meds = Array.isArray(result.medications) ? result.medications : [];
  const events = Array.isArray(result.adverseEvents) ? result.adverseEvents : [];
  const findDrug = <T extends { drug?: string }>(items: T[], used: Set<number>, drug: string) => {
    const index = items.findIndex((item, i) => !used.has(i) && squash(String(item?.drug ?? '')).includes(squash(drug)));
    if (index >= 0) used.add(index);
    return index >= 0 ? items[index] : undefined;
  };

  const usedMeds = new Set<number>();
  const medRows = answers.medications.map(answer => {
    const med = findDrug(meds, usedMeds, answer.drug);
    return {
      label: answer.drug,
      found: Boolean(med),
      fields: [
        check('Dose', answer.dose, med?.dose, (a, b) => doseKey(a) === doseKey(b)),
        check('Route', answer.route, med?.route, (a, b) => routeKey(a) === routeKey(b)),
        check('Frequency', answer.frequency, med?.frequency, (a, b) => frequencyKey(a) === frequencyKey(b)),
      ],
    };
  });

  const usedEvents = new Set<number>();
  const eventRows = answers.adverseEvents.map(answer => {
    const event = findDrug(events, usedEvents, answer.drug);
    return {
      label: answer.drug,
      found: Boolean(event),
      fields: [check('Reaction', answer.reaction, event?.reaction, (a, b) => squash(b).includes(squash(a)))],
    };
  });

  const fields = [...medRows, ...eventRows].flatMap(r => r.fields);
  return {
    correct: fields.filter(f => f.ok).length,
    total: fields.length,
    groups: [
      {
        title: 'Medications',
        columns: ['Medication', 'Dose', 'Route', 'Frequency'],
        rows: medRows,
        extra: meds.filter((_, i) => !usedMeds.has(i)).map(m => String(m?.drug ?? '(unnamed)')),
      },
      {
        title: 'Adverse drug events',
        columns: ['Caused by', 'Reaction'],
        rows: eventRows,
        extra: events.filter((_, i) => !usedEvents.has(i)).map(e => `${e?.drug ?? '?'}: ${e?.reaction ?? '?'}`),
      },
    ],
    notes: [],
  };
};

export const scoreExtraction = (sample: DemoSample, result: Extraction): Score =>
  sample.task === 'lab'
    ? scoreLab(labAnswers[sample.id] ?? [], result as Partial<LabExtraction>)
    : scoreMeds(medAnswers[sample.id] ?? { medications: [], adverseEvents: [] }, result as Partial<MedExtraction>);
