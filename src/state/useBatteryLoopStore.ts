import { create } from 'zustand';
import { DEMO_BATTERIES } from '../data/demoBatteries';
import type {
  Assessment,
  AuditEvent,
  BatteryCase,
  HumanDecisionRecord,
  ReasoningFlag,
  ReviewRecord,
  VerificationStatus,
} from '../features/assessment/assessment.types';
import { evaluateBattery } from '../features/assessment/evaluateBattery';

const STORAGE_KEY = 'batteryloop_workspace_v1';

export interface BatteryLoopState {
  currentStage: number; // 1 to 6
  selectedBatteryId: string;
  selectedModuleId: string | null;
  explode3DView: boolean;
  loopSpeechDismissed: boolean;

  batteryCases: Record<string, BatteryCase>;
  reviewerOverrides: Record<string, Record<string, any>>;
  reviewRecords: ReviewRecord[];
  reasoningFlags: ReasoningFlag[];
  simulatedInputs: Record<string, any> | null;
  humanDecisions: Record<string, HumanDecisionRecord>;
  auditLog: AuditEvent[];

  // Actions
  setStage: (stage: number) => void;
  selectBattery: (id: string) => void;
  selectModule: (id: string | null) => void;
  toggleExplodeView: () => void;
  dismissLoopSpeech: () => void;
  restoreLoopSpeech: () => void;

  recordEvidenceCorrection: (
    batteryId: string,
    fieldKey: string,
    fieldLabel: string,
    correctedValue: any,
    correctedStatus: VerificationStatus,
    reason: string,
    reviewerNote: string
  ) => void;

  flagReasoning: (
    batteryId: string,
    ruleId: string,
    ruleTitle: string,
    concernDescription: string,
    reviewer: string
  ) => void;

  updateSimulationInput: (key: string, value: any) => void;
  resetSimulation: () => void;
  applySimulationToReview: (batteryId: string) => void;

  recordHumanDecision: (record: HumanDecisionRecord) => void;
  resetCaseToSeed: (batteryId: string) => void;
  resetEntireDemo: () => void;

  // Computed helper getters
  getEffectiveBattery: (batteryId: string) => BatteryCase;
  getAssessment: (batteryId: string) => Assessment;
  getSimulatedAssessment: (batteryId: string) => Assessment;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        reviewerOverrides: parsed.reviewerOverrides || {},
        reviewRecords: parsed.reviewRecords || [],
        reasoningFlags: parsed.reasoningFlags || [],
        humanDecisions: parsed.humanDecisions || {},
        auditLog: parsed.auditLog || [],
      };
    }
  } catch (e) {
    console.warn('Could not load localStorage state:', e);
  }
  return {
    reviewerOverrides: {},
    reviewRecords: [],
    reasoningFlags: [],
    humanDecisions: {},
    auditLog: [
      {
        id: 'audit_init',
        timestamp: new Date().toISOString(),
        batteryId: 'BL-003',
        type: 'SELECT_BATTERY' as const,
        summary: 'Demo initialized with baseline case BL-003 selected.',
        author: 'System Auto-Seed',
      },
    ],
  };
}

const saved = loadInitialState();

export const useBatteryLoopStore = create<BatteryLoopState>((set, get) => ({
  currentStage: 1,
  selectedBatteryId: 'BL-003',
  selectedModuleId: 'M03',
  explode3DView: false,
  loopSpeechDismissed: false,

  batteryCases: DEMO_BATTERIES,
  reviewerOverrides: saved.reviewerOverrides,
  reviewRecords: saved.reviewRecords,
  reasoningFlags: saved.reasoningFlags,
  simulatedInputs: null,
  humanDecisions: saved.humanDecisions,
  auditLog: saved.auditLog,

  setStage: (stage: number) => {
    set({ currentStage: Math.max(1, Math.min(6, stage)), loopSpeechDismissed: false });
  },

  selectBattery: (id: string) => {
    const defaultModule = id === 'BL-003' ? 'M03' : id === 'BL-002' ? 'M14' : 'M01';
    set((state) => {
      const newAudit: AuditEvent = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        batteryId: id,
        type: 'SELECT_BATTERY',
        summary: `Switched active battery case to ${id}.`,
        author: 'Lead Reviewer',
      };
      return {
        selectedBatteryId: id,
        selectedModuleId: defaultModule,
        simulatedInputs: null,
        auditLog: [newAudit, ...state.auditLog],
        loopSpeechDismissed: false,
      };
    });
    persistState(get());
  },

  selectModule: (id: string | null) => {
    set((state) => {
      if (id && id !== state.selectedModuleId) {
        const audit: AuditEvent = {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          batteryId: state.selectedBatteryId,
          type: 'INSPECT_MODULE',
          summary: `Module ${id} selected for deep telemetry inspection.`,
          author: 'Lead Reviewer',
        };
        return {
          selectedModuleId: id,
          auditLog: [audit, ...state.auditLog],
        };
      }
      return { selectedModuleId: id };
    });
  },

  toggleExplodeView: () => {
    set((state) => ({ explode3DView: !state.explode3DView }));
  },

  dismissLoopSpeech: () => {
    set({ loopSpeechDismissed: true });
  },

  restoreLoopSpeech: () => {
    set({ loopSpeechDismissed: false });
  },

  recordEvidenceCorrection: (
    batteryId: string,
    fieldKey: string,
    fieldLabel: string,
    correctedValue: any,
    correctedStatus: VerificationStatus,
    reason: string,
    reviewerNote: string
  ) => {
    const state = get();
    const battery = state.batteryCases[batteryId] || DEMO_BATTERIES[batteryId];
    const originalItem = battery?.evidence[fieldKey];

    const reviewId = `rev_${Date.now()}`;
    const newRecord: ReviewRecord = {
      id: reviewId,
      batteryId,
      fieldKey,
      fieldLabel,
      originalValue: originalItem?.value ?? 'N/A',
      correctedValue,
      originalStatus: originalItem?.status ?? 'unverified',
      correctedStatus,
      reason,
      reviewerNote,
      timestamp: new Date().toISOString(),
    };

    const currentBatteryOverrides = state.reviewerOverrides[batteryId] || {};
    const updatedEvidence = {
      ...(currentBatteryOverrides.evidence || {}),
      [fieldKey]: {
        ...(originalItem || { weight: 15, label: fieldLabel }),
        value: correctedValue,
        status: correctedStatus,
        reviewerCorrection: true,
      },
    };

    const newOverrides = {
      ...state.reviewerOverrides,
      [batteryId]: {
        ...currentBatteryOverrides,
        evidence: updatedEvidence,
      },
    };

    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      batteryId,
      type: 'CORRECTION_RECORDED',
      summary: `Corrected "${fieldLabel}": Changed from "${originalItem?.value}" to "${correctedValue}" (${reason}).`,
      details: { fieldKey, originalValue: originalItem?.value, correctedValue, reason, reviewerNote },
      author: 'Lead Reviewer',
    };

    set({
      reviewerOverrides: newOverrides,
      reviewRecords: [newRecord, ...state.reviewRecords],
      auditLog: [auditEvent, ...state.auditLog],
    });

    persistState(get());
  },

  flagReasoning: (
    batteryId: string,
    ruleId: string,
    ruleTitle: string,
    concernDescription: string,
    reviewer: string
  ) => {
    const flag: ReasoningFlag = {
      id: `flag_${Date.now()}`,
      batteryId,
      ruleId,
      ruleTitle,
      concernDescription,
      reviewer,
      timestamp: new Date().toISOString(),
    };

    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      batteryId,
      type: 'REASONING_FLAGGED',
      summary: `Flagged reasoning concern on rule [${ruleId} - ${ruleTitle}]: "${concernDescription}"`,
      author: reviewer || 'Lead Reviewer',
    };

    set((state) => ({
      reasoningFlags: [flag, ...state.reasoningFlags],
      auditLog: [auditEvent, ...state.auditLog],
    }));

    persistState(get());
  },

  updateSimulationInput: (key: string, value: any) => {
    set((state) => {
      const current = state.simulatedInputs || {};
      return {
        simulatedInputs: {
          ...current,
          [key]: value,
        },
      };
    });
  },

  resetSimulation: () => {
    set({ simulatedInputs: null });
  },

  applySimulationToReview: (batteryId: string) => {
    const state = get();
    if (!state.simulatedInputs) return;

    const currentBattery = state.getEffectiveBattery(batteryId);
    const sim = state.simulatedInputs;

    const currentBatteryOverrides = state.reviewerOverrides[batteryId] || {};
    const updatedModules = currentBattery.modules.map((m) => {
      if (sim.selectedModuleVoltage !== undefined && m.moduleId === state.selectedModuleId) {
        return {
          ...m,
          voltageDeviationMv: Number(sim.selectedModuleVoltage),
          status: Number(sim.selectedModuleVoltage) > 50 ? ('flagged' as const) : ('nominal' as const),
        };
      }
      return m;
    });

    const newOverrides = {
      ...state.reviewerOverrides,
      [batteryId]: {
        ...currentBatteryOverrides,
        reportedSoH: sim.reportedSoH !== undefined ? Number(sim.reportedSoH) : currentBattery.reportedSoH,
        modules: updatedModules,
      },
    };

    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      batteryId,
      type: 'SIMULATION_APPLIED',
      summary: `Applied what-if simulation parameters directly into reviewed case evidence.`,
      details: sim,
      author: 'Lead Reviewer',
    };

    set({
      reviewerOverrides: newOverrides,
      simulatedInputs: null,
      auditLog: [auditEvent, ...state.auditLog],
    });

    persistState(get());
  },

  recordHumanDecision: (record: HumanDecisionRecord) => {
    const auditEvent: AuditEvent = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      batteryId: record.batteryId,
      type: 'DECISION_RECORDED',
      summary: `Recorded Human Decision: ${record.pathwayTitle}. Reviewer: ${record.reviewer}.`,
      details: record,
      author: record.reviewer,
    };

    set((state) => ({
      humanDecisions: {
        ...state.humanDecisions,
        [record.batteryId]: record,
      },
      auditLog: [auditEvent, ...state.auditLog],
    }));

    persistState(get());
  },

  resetCaseToSeed: (batteryId: string) => {
    set((state) => {
      const newOverrides = { ...state.reviewerOverrides };
      delete newOverrides[batteryId];

      const newDecisions = { ...state.humanDecisions };
      delete newDecisions[batteryId];

      const auditEvent: AuditEvent = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        batteryId,
        type: 'CASE_RESET',
        summary: `Reset case ${batteryId} to its seeded baseline parameters.`,
        author: 'Lead Reviewer',
      };

      return {
        reviewerOverrides: newOverrides,
        humanDecisions: newDecisions,
        simulatedInputs: null,
        auditLog: [auditEvent, ...state.auditLog],
      };
    });

    persistState(get());
  },

  resetEntireDemo: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      currentStage: 1,
      selectedBatteryId: 'BL-003',
      selectedModuleId: 'M03',
      explode3DView: false,
      reviewerOverrides: {},
      reviewRecords: [],
      reasoningFlags: [],
      simulatedInputs: null,
      humanDecisions: {},
      auditLog: [
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          batteryId: 'BL-003',
          type: 'CASE_RESET',
          summary: 'Complete workspace reset performed. Seed state re-established.',
          author: 'System',
        },
      ],
    });
  },

  getEffectiveBattery: (batteryId: string): BatteryCase => {
    const state = get();
    const base = state.batteryCases[batteryId] || DEMO_BATTERIES[batteryId] || DEMO_BATTERIES['BL-003'];
    const overrides = state.reviewerOverrides[batteryId] || {};

    return {
      ...base,
      ...overrides,
      evidence: {
        ...base.evidence,
        ...(overrides.evidence || {}),
      },
      modules: overrides.modules || base.modules,
    };
  },

  getAssessment: (batteryId: string): Assessment => {
    const state = get();
    const effective = state.getEffectiveBattery(batteryId);
    return evaluateBattery(effective);
  },

  getSimulatedAssessment: (batteryId: string): Assessment => {
    const state = get();
    const effective = state.getEffectiveBattery(batteryId);
    const sim = state.simulatedInputs;

    if (!sim) {
      return evaluateBattery(effective);
    }

    // Apply simulation transformations
    let simReportedSoH = effective.reportedSoH;
    if (sim.reportedSoH !== undefined) {
      simReportedSoH = Number(sim.reportedSoH);
    }

    let simModules = [...effective.modules];
    if (sim.selectedModuleVoltage !== undefined && state.selectedModuleId) {
      simModules = simModules.map((m) => {
        if (m.moduleId === state.selectedModuleId) {
          return {
            ...m,
            voltageDeviationMv: Number(sim.selectedModuleVoltage),
            status: Number(sim.selectedModuleVoltage) > 50 ? ('flagged' as const) : ('nominal' as const),
          };
        }
        return m;
      });
    }

    const simEvidence = { ...effective.evidence };
    if (sim.serviceRecordStatus) {
      simEvidence.service_record = {
        ...simEvidence.service_record,
        status: sim.serviceRecordStatus,
        value: sim.serviceRecordStatus === 'verified' ? 'Verified OEM Workshop Log' : simEvidence.service_record.value,
      };
    }
    if (sim.bmsTelemetryStatus) {
      simEvidence.bms_telemetry = {
        ...simEvidence.bms_telemetry,
        status: sim.bmsTelemetryStatus,
        isContradictory: false,
      };
    }

    const simBattery: BatteryCase = {
      ...effective,
      reportedSoH: simReportedSoH,
      criticalSafetyFlag: sim.criticalSafetyFlag !== undefined ? sim.criticalSafetyFlag : effective.criticalSafetyFlag,
      modules: simModules,
      evidence: simEvidence,
    };

    return evaluateBattery(simBattery, undefined, true);
  },
}));

function persistState(state: BatteryLoopState) {
  try {
    const data = {
      reviewerOverrides: state.reviewerOverrides,
      reviewRecords: state.reviewRecords,
      reasoningFlags: state.reasoningFlags,
      humanDecisions: state.humanDecisions,
      auditLog: state.auditLog.slice(0, 50), // keep last 50
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not persist to localStorage:', e);
  }
}
