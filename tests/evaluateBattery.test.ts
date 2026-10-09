import { describe, it, expect } from 'vitest';
import { evaluateBattery } from '../src/features/assessment/evaluateBattery';
import { BatteryCase, ModuleData } from '../src/features/assessment/assessment.types';

function createMockModules(flaggedM03Deviation = 180): ModuleData[] {
  return Array.from({ length: 24 }, (_, i) => {
    const num = i + 1;
    const moduleId = `M${num < 10 ? '0' + num : num}`;
    const isM03 = moduleId === 'M03';
    return {
      moduleId,
      label: `Module ${moduleId}`,
      voltageDeviationMv: isM03 ? flaggedM03Deviation : 15 + (i % 5),
      tempVarianceC: isM03 ? 4.8 : 1.2,
      internalResistanceMohm: isM03 ? 1.85 : 1.25,
      status: isM03 && flaggedM03Deviation > 50 ? 'flagged' : 'nominal',
      hasConflict: isM03 && flaggedM03Deviation > 100,
      issueDescription: isM03 && flaggedM03Deviation > 100 ? 'Cell #4 voltage droop under load' : undefined,
    };
  });
}

const mockBL003: BatteryCase = {
  id: 'BL-003',
  name: 'Commercial Van Pack #382',
  vehicleModel: 'Transporter EV-78',
  chemistry: 'NMC 811',
  nominalCapacityKwh: 78.4,
  nominalVoltageV: 396,
  cycleCount: 640,
  ageYears: 3.2,
  reportedSoH: 99, // Highlighted contradiction: 99% reported vs 180mV deviation!
  evidenceCompleteness: 'partial',
  criticalSafetyFlag: false,
  serviceHistory: 'missing',
  modules: createMockModules(180),
  evidence: {
    diagnostic_report: {
      fieldKey: 'diagnostic_report',
      label: 'Workshop Diagnostic Telemetry',
      value: 'Pack Imbalance Detected',
      source: 'Stationary Cycler Bench',
      timestamp: '2026-09-18 14:32',
      status: 'verified',
      weight: 30,
    },
    bms_telemetry: {
      fieldKey: 'bms_telemetry',
      label: 'Onboard BMS Telemetry Report',
      value: 'SoH 99% (Self-Reported)',
      source: 'Vehicle CAN Bus Export',
      timestamp: '2026-09-15 08:20',
      status: 'partial',
      isContradictory: true,
      weight: 20,
    },
    cycle_history: {
      fieldKey: 'cycle_history',
      label: 'Lifetime Cycle History',
      value: '640 Equivalent Full Cycles',
      source: 'Fleet Cloud Telematics',
      timestamp: '2026-09-10 11:00',
      status: 'partial',
      weight: 20,
    },
    thermal_history: {
      fieldKey: 'thermal_history',
      label: 'Pack Thermal History',
      value: 'Peak recorded 48.2°C',
      source: 'BMS EEPROM Extract',
      timestamp: '2026-08-30 19:10',
      status: 'verified',
      weight: 15,
    },
    service_record: {
      fieldKey: 'service_record',
      label: 'Certified Workshop Service Logbook',
      value: 'No Log Found',
      source: 'OEM Dealer Database',
      timestamp: 'Missing',
      status: 'missing',
      weight: 15,
    },
  },
  summary: 'Commercial delivery vehicle pack showing immaculate reported SoH (99%) despite cell imbalance on module M03 and missing service records.',
  initialRecommendationHint: 'Further controlled testing due to diagnostic conflict',
};

describe('BatteryLoop Decision Rules Engine', () => {
  it('correctly catches conflicting evidence on BL-003 (99% SoH vs 180mV deviation on M03)', () => {
    const assessment = evaluateBattery(mockBL003);

    expect(assessment.pathway).toBe('further-controlled-testing');
    expect(assessment.ruleIds).toContain('RULE-CONF-02');
    expect(assessment.reasonCodes).toContain('SOH_MODULE_DIAGNOSTIC_CONTRADICTION');
    expect(assessment.deploymentBlocked).toBe(true);
    expect(assessment.nextRecommendedTest).toContain('Module M03');
  });

  it('immediately blocks deployment when a critical safety flag is present', () => {
    const criticalBattery: BatteryCase = {
      ...mockBL003,
      id: 'BL-004',
      criticalSafetyFlag: true,
      criticalSafetyReason: 'Thermal runaway precursor venting event recorded.',
    };

    const assessment = evaluateBattery(criticalBattery);
    expect(assessment.pathway).toBe('recycling-assessment');
    expect(assessment.ruleIds).toContain('RULE-SAFE-01');
    expect(assessment.deploymentBlocked).toBe(true);
    expect(assessment.confidence).toBe('high');
  });

  it('routes to repair-assessment when an isolated module exhibits repairable variance', () => {
    const repairBattery: BatteryCase = {
      ...mockBL003,
      reportedSoH: 82,
      modules: createMockModules(85), // 85 mV: moderate deviation
      evidence: {
        ...mockBL003.evidence,
        service_record: { ...mockBL003.evidence.service_record, status: 'verified', value: 'Complete OEM Service Log' },
        bms_telemetry: { ...mockBL003.evidence.bms_telemetry, status: 'verified' },
      },
    };

    const assessment = evaluateBattery(repairBattery);
    expect(assessment.pathway).toBe('repair-assessment');
    expect(assessment.ruleIds).toContain('RULE-REPAIR-04');
    expect(assessment.deploymentBlocked).toBe(false);
  });

  it('routes to second-life-evaluation when pack is uniform and evidence is complete', () => {
    const healthyBattery: BatteryCase = {
      ...mockBL003,
      reportedSoH: 84,
      modules: createMockModules(22), // 22 mV: completely nominal
      evidence: {
        ...mockBL003.evidence,
        bms_telemetry: { ...mockBL003.evidence.bms_telemetry, status: 'verified' },
        cycle_history: { ...mockBL003.evidence.cycle_history, status: 'verified' },
        service_record: { ...mockBL003.evidence.service_record, status: 'verified' },
      },
    };

    const assessment = evaluateBattery(healthyBattery);
    expect(assessment.pathway).toBe('second-life-evaluation');
    expect(assessment.ruleIds).toContain('RULE-SUIT-05B');
    expect(assessment.deploymentBlocked).toBe(false);
    expect(assessment.evidenceCoverage).toBe(100);
  });

  it('demonstrates that simulated changes alter the rule evaluation', () => {
    // Initial evaluation has conflict
    const initial = evaluateBattery(mockBL003);
    expect(initial.pathway).toBe('further-controlled-testing');

    // Simulated scenario: M03 cell deviation corrected/reduced to 25 mV and verified records
    const simulatedModules = createMockModules(25);
    const simulatedAssessment = evaluateBattery(mockBL003, {
      modules: simulatedModules,
      reportedSoH: 86,
      evidence: {
        ...mockBL003.evidence,
        bms_telemetry: { ...mockBL003.evidence.bms_telemetry, status: 'verified' },
        cycle_history: { ...mockBL003.evidence.cycle_history, status: 'verified' },
        service_record: { ...mockBL003.evidence.service_record, status: 'verified' },
      },
    }, true);

    expect(simulatedAssessment.pathway).toBe('second-life-evaluation');
    expect(simulatedAssessment.isSimulated).toBe(true);
    expect(simulatedAssessment.ruleIds).toContain('RULE-SUIT-05B');
  });
});
