import type { Pathway } from './assessment.types';

/**
 * DEMO SCREENING THRESHOLDS & ASSUMPTIONS
 * 
 * IMPORTANT DISCLAIMER:
 * These thresholds are illustrative rule-based engineering assumptions
 * configured specifically for this interactive demonstration workspace.
 * They do NOT represent formal battery safety certifications or regulatory standards.
 */
export const DEMO_THRESHOLDS = {
  NOMINAL_VOLTAGE_DEVIATION_MV: 50,
  MODERATE_VOLTAGE_DEVIATION_MV: 100,
  SEVERE_VOLTAGE_DEVIATION_MV: 120, // BL-003 M03 is 180 mV, clearly crossing this
  HIGH_REPORTED_SOH_PERCENT: 85,
  MIN_SECOND_LIFE_SOH_PERCENT: 75,
  MIN_SECOND_LIFE_COVERAGE_PERCENT: 70,
  MAX_MODULE_TEMP_VARIANCE_C: 3.5,
  SEVERE_MODULE_TEMP_VARIANCE_C: 6.0,
} as const;

export const EVIDENCE_WEIGHTS: Record<string, number> = {
  diagnostic_report: 30,
  bms_telemetry: 20,
  cycle_history: 20,
  thermal_history: 15,
  service_record: 15,
};

export const PATHWAY_CONFIG: Record<Pathway, {
  title: string;
  badgeClass: string;
  shortDesc: string;
  recommendedAction: string;
}> = {
  'further-controlled-testing': {
    title: 'Further Controlled Testing',
    badgeClass: 'badge-coral',
    shortDesc: 'Conflicting evidence or unverified anomalies require high-precision bench isolation.',
    recommendedAction: 'Obtain qualified laboratory discharge & impedance spectroscopy before any pathway commitment.',
  },
  'second-life-evaluation': {
    title: 'Second-Life Evaluation Candidate',
    badgeClass: 'badge-teal',
    shortDesc: 'Healthy uniform cell metrics and verified operational history indicate stationary storage suitability.',
    recommendedAction: 'Schedule secondary grading cycle for stationary BESS (Battery Energy Storage System) integration.',
  },
  'repair-assessment': {
    title: 'Module Repair / Reconditioning Assessment',
    badgeClass: 'badge-amber',
    shortDesc: 'Localized module variance detected with sound overall pack integrity.',
    recommendedAction: 'Isolate affected module(s) for balancing, busbar re-torque, or single-module replacement.',
  },
  'continue-use-candidate': {
    title: 'Continue Active Mobile Use',
    badgeClass: 'badge-teal',
    shortDesc: 'High SoH, uniform module metrics, and comprehensive verified maintenance records.',
    recommendedAction: 'Return to fleet operation with routine annual cycle telemetry audit.',
  },
  'recycling-assessment': {
    title: 'Material Recycling Assessment',
    badgeClass: 'badge-red',
    shortDesc: 'Critical safety flags, severe chemical degradation, or multiple irreversible cell failures.',
    recommendedAction: 'Deplete to safe transport voltage and route to hydrometallurgical closed-loop recycling facility.',
  },
};
