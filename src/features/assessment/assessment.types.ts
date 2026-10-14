export type Pathway =
  | 'continue-use-candidate'
  | 'repair-assessment'
  | 'further-controlled-testing'
  | 'second-life-evaluation'
  | 'recycling-assessment';

export type Confidence = 'low' | 'medium' | 'high';

export type VerificationStatus = 'verified' | 'unverified' | 'partial' | 'missing';

export interface EvidenceRecord {
  fieldKey: string;
  label: string;
  value: string | number;
  unit?: string;
  source: string;
  timestamp: string;
  status: VerificationStatus;
  isContradictory?: boolean;
  isCritical?: boolean;
  weight: number; // Contribution to coverage percentage
}

export interface ModuleData {
  moduleId: string; // e.g. "M01" - "M24"
  label: string;
  voltageDeviationMv: number;
  tempVarianceC: number;
  internalResistanceMohm: number;
  status: 'nominal' | 'flagged' | 'critical';
  hasConflict?: boolean;
  issueDescription?: string;
}

export interface BatteryCase {
  id: string; // "BL-001" to "BL-005"
  name: string;
  vehicleModel: string;
  chemistry: string;
  nominalCapacityKwh: number;
  nominalVoltageV: number;
  cycleCount: number;
  ageYears: number;
  reportedSoH: number; // percentage (e.g. 99 for BL-003)
  evidenceCompleteness: 'complete' | 'partial' | 'missing';
  criticalSafetyFlag: boolean;
  criticalSafetyReason?: string;
  serviceHistory: 'complete' | 'partial' | 'missing';
  modules: ModuleData[];
  evidence: Record<string, EvidenceRecord>;
  summary: string;
  initialRecommendationHint: string;
}

export interface RuleExplanation {
  ruleId: string;
  title: string;
  category: 'safety' | 'conflict' | 'coverage' | 'suitability';
  conditionMet: string;
  impact: string;
}

export interface Assessment {
  batteryId: string;
  pathway: Pathway;
  pathwayTitle: string;
  evidenceCoverage: number; // Percentage 0 - 100
  confidence: Confidence;
  reasonCodes: string[];
  missingEvidence: string[];
  nextRecommendedTest: string | null;
  deploymentBlocked: boolean;
  ruleIds: string[];
  ruleExplanations: RuleExplanation[];
  evaluatedAt: string;
  isSimulated?: boolean;
}

export interface ReviewRecord {
  id: string;
  batteryId: string;
  fieldKey: string;
  fieldLabel: string;
  originalValue: any;
  correctedValue: any;
  originalStatus: VerificationStatus;
  correctedStatus: VerificationStatus;
  reason: string;
  reviewerNote: string;
  timestamp: string;
}

export interface ReasoningFlag {
  id: string;
  batteryId: string;
  ruleId: string;
  ruleTitle: string;
  concernDescription: string;
  reviewer: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  batteryId: string;
  type:
    | 'SELECT_BATTERY'
    | 'INSPECT_MODULE'
    | 'CORRECTION_RECORDED'
    | 'REASONING_FLAGGED'
    | 'SIMULATION_APPLIED'
    | 'DECISION_RECORDED'
    | 'CASE_RESET'
    | 'CASE_REGISTERED'
    | 'EVIDENCE_IMPORTED';
  summary: string;
  details?: Record<string, any>;
  author: string;
}

export interface HumanDecisionRecord {
  batteryId: string;
  pathway: Pathway;
  pathwayTitle: string;
  justification: string;
  reviewer: string;
  reviewerRole: string;
  timestamp: string;
  outstandingRequirements: string[];
  divergesFromSuggestion: boolean;
  suggestedPathway: Pathway;
}
