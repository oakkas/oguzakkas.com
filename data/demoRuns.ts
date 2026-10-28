// Saved results from real runs of /api/extract, shown until a visitor runs a
// document live. Regenerate from the live site with: npm run demo:save
import type { DemoRun } from './demo';

export const savedRuns: Record<string, DemoRun> = {
  "lab-report-typed": {
    "result": {
      "results": [
        {
          "test": "Glucose",
          "value": "112",
          "unit": "mg/dL",
          "referenceRange": "70 - 99",
          "flag": "H"
        },
        {
          "test": "Sodium",
          "value": "139",
          "unit": "mmol/L",
          "referenceRange": "134 - 144",
          "flag": ""
        },
        {
          "test": "Potassium",
          "value": "3.3",
          "unit": "mmol/L",
          "referenceRange": "3.5 - 5.2",
          "flag": "L"
        },
        {
          "test": "Creatinine",
          "value": "0.86",
          "unit": "mg/dL",
          "referenceRange": "0.57 - 1.00",
          "flag": ""
        },
        {
          "test": "eGFR",
          "value": "88",
          "unit": "mL/min/1.73m²",
          "referenceRange": ">59",
          "flag": ""
        },
        {
          "test": "ALT (SGPT)",
          "value": "22",
          "unit": "U/L",
          "referenceRange": "0 - 32",
          "flag": ""
        },
        {
          "test": "Cholesterol, Total",
          "value": "214",
          "unit": "mg/dL",
          "referenceRange": "<200",
          "flag": "H"
        },
        {
          "test": "LDL Cholesterol (calc)",
          "value": "138",
          "unit": "mg/dL",
          "referenceRange": "<100",
          "flag": "H"
        },
        {
          "test": "HDL Cholesterol",
          "value": "48",
          "unit": "mg/dL",
          "referenceRange": ">39",
          "flag": ""
        },
        {
          "test": "Triglycerides",
          "value": "142",
          "unit": "mg/dL",
          "referenceRange": "<150",
          "flag": ""
        },
        {
          "test": "Hemoglobin A1c",
          "value": "6.1",
          "unit": "%",
          "referenceRange": "4.8 - 5.6",
          "flag": "H"
        }
      ],
      "handwrittenNotes": []
    },
    "model": "gemini-3.5-flash-lite",
    "ms": 4910,
    "inputTokens": 1215,
    "outputTokens": 638,
    "ranAt": "2026-10-28T20:14:05.631Z"
  },
  "lab-report-photo": {
    "result": {
      "results": [
        {
          "test": "WBC",
          "value": "11.8",
          "unit": "x10E3/uL",
          "referenceRange": "3.4-10.8",
          "flag": "H"
        },
        {
          "test": "RBC",
          "value": "3.92",
          "unit": "x10E6/uL",
          "referenceRange": "3.77-5.28",
          "flag": ""
        },
        {
          "test": "Hemoglobin",
          "value": "10.6",
          "unit": "g/dL",
          "referenceRange": "11.1-15.9",
          "flag": "L"
        },
        {
          "test": "Hematocrit",
          "value": "33.1",
          "unit": "%",
          "referenceRange": "34.0-46.6",
          "flag": "L"
        },
        {
          "test": "MCV",
          "value": "84",
          "unit": "fL",
          "referenceRange": "79-97",
          "flag": ""
        },
        {
          "test": "Platelets",
          "value": "468",
          "unit": "x10E3/uL",
          "referenceRange": "150-450",
          "flag": "H"
        },
        {
          "test": "Neutrophils",
          "value": "78",
          "unit": "%",
          "referenceRange": "40-74",
          "flag": "H"
        },
        {
          "test": "Lymphocytes",
          "value": "15",
          "unit": "%",
          "referenceRange": "14-46",
          "flag": ""
        }
      ],
      "handwrittenNotes": [
        "WBC ↑ - recheck in 2 wks",
        "Hgb low - start iron?",
        "- A.E. 9/16"
      ]
    },
    "model": "gemini-3.5-flash-lite",
    "ms": 2810,
    "inputTokens": 1215,
    "outputTokens": 527,
    "ranAt": "2026-10-28T20:14:29.881Z"
  },
  "clinical-note-fax": {
    "result": {
      "medications": [
        {
          "drug": "ceftriaxone",
          "dose": "1 g",
          "route": "IV",
          "frequency": "daily"
        },
        {
          "drug": "azithromycin",
          "dose": "500 mg",
          "route": "PO",
          "frequency": "daily"
        },
        {
          "drug": "levofloxacin",
          "dose": "750 mg",
          "route": "PO",
          "frequency": "daily"
        },
        {
          "drug": "diphenhydramine",
          "dose": "25 mg",
          "route": "PO",
          "frequency": "every 6 hours as needed for itching"
        },
        {
          "drug": "metformin",
          "dose": "500 mg",
          "route": "PO",
          "frequency": "twice daily"
        },
        {
          "drug": "lisinopril",
          "dose": "10 mg",
          "route": "PO",
          "frequency": "daily"
        }
      ],
      "adverseEvents": [
        {
          "drug": "ceftriaxone",
          "reaction": "diffuse pruritic rash on the trunk and arms"
        }
      ]
    },
    "model": "gemini-3.5-flash-lite",
    "ms": 1886,
    "inputTokens": 1245,
    "outputTokens": 325,
    "ranAt": "2026-10-28T20:14:53.276Z"
  }
};
