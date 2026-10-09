import type { BatteryCase, ModuleData } from '../features/assessment/assessment.types';

function generateModules(customizer?: (index: number, id: string) => Partial<ModuleData>): ModuleData[] {
  return Array.from({ length: 24 }, (_, i) => {
    const num = i + 1;
    const moduleId = `M${num < 10 ? '0' + num : num}`;
    const baseVariance = 12 + ((i * 7) % 18);
    const baseTemp = 1.1 + ((i * 3) % 12) / 10;
    const baseIR = 1.2 + ((i * 5) % 8) / 20;

    const baseModule: ModuleData = {
      moduleId,
      label: `Module ${moduleId}`,
      voltageDeviationMv: baseVariance,
      tempVarianceC: baseTemp,
      internalResistanceMohm: baseIR,
      status: 'nominal',
    };

    if (customizer) {
      const overrides = customizer(i, moduleId);
      return { ...baseModule, ...overrides };
    }
    return baseModule;
  });
}

export const DEMO_BATTERIES: Record<string, BatteryCase> = {
  'BL-003': {
    id: 'BL-003',
    name: 'Commercial Van Fleet #382',
    vehicleModel: 'Transporter EV-78',
    chemistry: 'NMC 811',
    nominalCapacityKwh: 78.4,
    nominalVoltageV: 396,
    cycleCount: 640,
    ageYears: 3.2,
    reportedSoH: 99, // Highlighted contradiction: 99% reported vs 180mV deviation on M03
    evidenceCompleteness: 'partial',
    criticalSafetyFlag: false,
    serviceHistory: 'missing',
    summary: 'Commercial delivery vehicle pack showing immaculate reported SoH (99%) despite cell voltage imbalance (180 mV) on module M03 and missing OEM service records.',
    initialRecommendationHint: 'Further controlled testing due to diagnostic contradiction',
    modules: generateModules((_, id) => {
      if (id === 'M03') {
        return {
          voltageDeviationMv: 180, // Major anomaly
          tempVarianceC: 4.8,
          internalResistanceMohm: 1.88,
          status: 'flagged',
          hasConflict: true,
          issueDescription: 'Severe cell #4 voltage deviation (180 mV) and elevated resistance under load.',
        };
      }
      return {};
    }),
    evidence: {
      diagnostic_report: {
        fieldKey: 'diagnostic_report',
        label: 'Workshop Diagnostic Bench',
        value: 'Pack Imbalance Detected (180 mV Delta)',
        source: 'Chroma 17020 Regenerative Pack Cycler',
        timestamp: '2026-09-18 14:32 UTC',
        status: 'verified',
        weight: 30,
      },
      bms_telemetry: {
        fieldKey: 'bms_telemetry',
        label: 'Reported SoH (BMS Self-Estimate)',
        value: '99% State-of-Health',
        source: 'Vehicle CAN Bus Export (Uncalibrated)',
        timestamp: '2026-09-15 08:20 UTC',
        status: 'partial',
        isContradictory: true,
        weight: 20,
      },
      cycle_history: {
        fieldKey: 'cycle_history',
        label: 'Lifetime Cycle History',
        value: '640 Equivalent Full Cycles',
        source: 'Fleet Cloud Telematics',
        timestamp: '2026-09-10 11:00 UTC',
        status: 'partial',
        weight: 20,
      },
      thermal_history: {
        fieldKey: 'thermal_history',
        label: 'Thermal Operating History',
        value: 'Peak Temp: 48.2°C (Within threshold)',
        source: 'BMS EEPROM Peak Register',
        timestamp: '2026-08-30 19:10 UTC',
        status: 'verified',
        weight: 15,
      },
      service_record: {
        fieldKey: 'service_record',
        label: 'Certified Service Maintenance Log',
        value: 'Missing / No dealer records found',
        source: 'OEM Central Database',
        timestamp: 'Unavailable',
        status: 'missing',
        weight: 15,
      },
    },
  },

  'BL-001': {
    id: 'BL-001',
    name: 'High-Mileage Fleet Taxi #104',
    vehicleModel: 'Sedan EV-64',
    chemistry: 'NMC 622',
    nominalCapacityKwh: 64.0,
    nominalVoltageV: 350,
    cycleCount: 1420,
    ageYears: 4.8,
    reportedSoH: 78,
    evidenceCompleteness: 'complete',
    criticalSafetyFlag: false,
    serviceHistory: 'complete',
    summary: 'High-mileage fleet taxi with uniform cell aging, fully verified dealer service history, and clean thermal records. Prime second-life storage candidate.',
    initialRecommendationHint: 'Candidate for second-life stationary storage',
    modules: generateModules((_, __) => ({
      voltageDeviationMv: 18 + Math.floor(Math.random() * 12),
      tempVarianceC: 1.2,
      internalResistanceMohm: 1.32,
      status: 'nominal',
    })),
    evidence: {
      diagnostic_report: {
        fieldKey: 'diagnostic_report',
        label: 'Workshop Diagnostic Bench',
        value: 'Uniform degradation, max delta 26 mV',
        source: 'Chroma 17020 Cycler Report',
        timestamp: '2026-09-22 09:15 UTC',
        status: 'verified',
        weight: 30,
      },
      bms_telemetry: {
        fieldKey: 'bms_telemetry',
        label: 'Reported SoH (BMS Calibrated)',
        value: '78% State-of-Health',
        source: 'Calibrated BMS Discharge Cycle',
        timestamp: '2026-09-21 16:40 UTC',
        status: 'verified',
        weight: 20,
      },
      cycle_history: {
        fieldKey: 'cycle_history',
        label: 'Lifetime Cycle History',
        value: '1,420 Verified Cycles',
        source: 'Fleet Telematics Cloud',
        timestamp: '2026-09-21 16:40 UTC',
        status: 'verified',
        weight: 20,
      },
      thermal_history: {
        fieldKey: 'thermal_history',
        label: 'Thermal Operating History',
        value: 'Nominal (Max 41.5°C)',
        source: 'BMS EEPROM History',
        timestamp: '2026-09-21 16:40 UTC',
        status: 'verified',
        weight: 15,
      },
      service_record: {
        fieldKey: 'service_record',
        label: 'Certified Service Maintenance Log',
        value: '100% Scheduled OEM Services Logged',
        source: 'Authorized Dealer System',
        timestamp: '2026-09-20 11:00 UTC',
        status: 'verified',
        weight: 15,
      },
    },
  },

  'BL-002': {
    id: 'BL-002',
    name: 'Logistics Forklift Pack #219',
    vehicleModel: 'HeavyMover 48V-LFP',
    chemistry: 'LFP (LiFePO4)',
    nominalCapacityKwh: 42.5,
    nominalVoltageV: 310,
    cycleCount: 950,
    ageYears: 2.7,
    reportedSoH: 82,
    evidenceCompleteness: 'complete',
    criticalSafetyFlag: false,
    serviceHistory: 'complete',
    summary: 'Warehouse utility pack with sound overall chemistry, but Module M14 exhibits isolated voltage imbalance (92 mV) suitable for single-module replacement.',
    initialRecommendationHint: 'Module repair & reconditioning assessment',
    modules: generateModules((_, id) => {
      if (id === 'M14') {
        return {
          voltageDeviationMv: 92,
          tempVarianceC: 3.1,
          internalResistanceMohm: 1.65,
          status: 'flagged',
          issueDescription: 'Single module impedance drift; pack interconnects intact.',
        };
      }
      return {
        voltageDeviationMv: 20,
        tempVarianceC: 1.4,
        internalResistanceMohm: 1.28,
        status: 'nominal',
      };
    }),
    evidence: {
      diagnostic_report: {
        fieldKey: 'diagnostic_report',
        label: 'Workshop Diagnostic Bench',
        value: 'Single Module Imbalance on M14 (92 mV)',
        source: 'Chroma Cycler Bench',
        timestamp: '2026-09-25 10:11 UTC',
        status: 'verified',
        weight: 30,
      },
      bms_telemetry: {
        fieldKey: 'bms_telemetry',
        label: 'Reported SoH',
        value: '82% State-of-Health',
        source: 'BMS Diagnostic Port',
        timestamp: '2026-09-24 18:20 UTC',
        status: 'verified',
        weight: 20,
      },
      cycle_history: {
        fieldKey: 'cycle_history',
        label: 'Lifetime Cycle History',
        value: '950 Verified Cycles',
        source: 'Industrial Fleet Hub',
        timestamp: '2026-09-24 18:20 UTC',
        status: 'verified',
        weight: 20,
      },
      thermal_history: {
        fieldKey: 'thermal_history',
        label: 'Thermal Operating History',
        value: 'Within Nominal Spec (Max 38.0°C)',
        source: 'BMS EEPROM',
        timestamp: '2026-09-24 18:20 UTC',
        status: 'verified',
        weight: 15,
      },
      service_record: {
        fieldKey: 'service_record',
        label: 'Certified Service Maintenance Log',
        value: 'Industrial Facility Maintenance Logged',
        source: 'Depot Fleet Manager',
        timestamp: '2026-09-23 09:30 UTC',
        status: 'verified',
        weight: 15,
      },
    },
  },

  'BL-004': {
    id: 'BL-004',
    name: 'Salvage Collision Pack #890',
    vehicleModel: 'CrossOver EV-82',
    chemistry: 'NMC 811',
    nominalCapacityKwh: 82.0,
    nominalVoltageV: 400,
    cycleCount: 310,
    ageYears: 1.4,
    reportedSoH: 88,
    evidenceCompleteness: 'partial',
    criticalSafetyFlag: true,
    criticalSafetyReason: 'Physical tray perforation and thermal runaway precursor venting alarm triggered during post-collision triage.',
    serviceHistory: 'partial',
    summary: 'Severely damaged pack with casing intrusion and thermal safety alarms. Deployment strictly blocked under safety screening rules.',
    initialRecommendationHint: 'Material recycling assessment (Deployment blocked)',
    modules: generateModules((_, id) => {
      if (['M08', 'M09', 'M10'].includes(id)) {
        return {
          voltageDeviationMv: 260,
          tempVarianceC: 7.5,
          internalResistanceMohm: 3.2,
          status: 'critical',
          issueDescription: 'Physical deformation and cell venting detected.',
        };
      }
      return {
        voltageDeviationMv: 30,
        tempVarianceC: 2.0,
        internalResistanceMohm: 1.3,
        status: 'nominal',
      };
    }),
    evidence: {
      diagnostic_report: {
        fieldKey: 'diagnostic_report',
        label: 'Triage Diagnostic Scan',
        value: 'Critical mechanical breach & insulation fault',
        source: 'Incident Response Inspection Bench',
        timestamp: '2026-10-01 07:45 UTC',
        status: 'verified',
        weight: 30,
      },
      bms_telemetry: {
        fieldKey: 'bms_telemetry',
        label: 'Reported SoH',
        value: '88% (Pre-incident estimate)',
        source: 'Crashed Vehicle Blackbox',
        timestamp: '2026-09-30 22:15 UTC',
        status: 'unverified',
        weight: 20,
      },
      cycle_history: {
        fieldKey: 'cycle_history',
        label: 'Lifetime Cycle History',
        value: '310 Cycles',
        source: 'Cloud Telematics Archive',
        timestamp: '2026-09-30 22:15 UTC',
        status: 'verified',
        weight: 20,
      },
      thermal_history: {
        fieldKey: 'thermal_history',
        label: 'Thermal Operating History',
        value: 'Thermal Event Venting Flag Recorded (>85°C)',
        source: 'Safety Interlock Sensor',
        timestamp: '2026-09-30 22:20 UTC',
        status: 'verified',
        weight: 15,
      },
      service_record: {
        fieldKey: 'service_record',
        label: 'Service Maintenance Log',
        value: 'Incomplete accident claim report',
        source: 'Insurance Assessor',
        timestamp: '2026-10-01 11:20 UTC',
        status: 'partial',
        weight: 15,
      },
    },
  },

  'BL-005': {
    id: 'BL-005',
    name: 'Third-Party Trade-in Pack #047',
    vehicleModel: 'Compact Urban EV-40',
    chemistry: 'LFP',
    nominalCapacityKwh: 40.0,
    nominalVoltageV: 320,
    cycleCount: 780,
    ageYears: 3.5,
    reportedSoH: 91,
    evidenceCompleteness: 'missing',
    criticalSafetyFlag: false,
    serviceHistory: 'missing',
    summary: 'Secondary market trade-in with claims of 91% SoH, but lacking verified workshop diagnostics, maintenance history, or trusted cycle logs.',
    initialRecommendationHint: 'Further controlled testing due to missing evidence',
    modules: generateModules(() => ({
      voltageDeviationMv: 45,
      tempVarianceC: 1.8,
      internalResistanceMohm: 1.4,
      status: 'nominal',
    })),
    evidence: {
      diagnostic_report: {
        fieldKey: 'diagnostic_report',
        label: 'Workshop Diagnostic Bench',
        value: 'Not Performed / No Lab Session',
        source: 'None',
        timestamp: 'Missing',
        status: 'missing',
        weight: 30,
      },
      bms_telemetry: {
        fieldKey: 'bms_telemetry',
        label: 'Reported SoH',
        value: '91% (Seller self-declaration)',
        source: 'Handheld OBD Dongle',
        timestamp: '2026-09-28 15:00 UTC',
        status: 'unverified',
        weight: 20,
      },
      cycle_history: {
        fieldKey: 'cycle_history',
        label: 'Lifetime Cycle History',
        value: 'Estimated ~780 Cycles',
        source: 'Seller Estimate',
        timestamp: 'Unverified',
        status: 'missing',
        weight: 20,
      },
      thermal_history: {
        fieldKey: 'thermal_history',
        label: 'Thermal Operating History',
        value: 'No Thermal Data Available',
        source: 'None',
        timestamp: 'Missing',
        status: 'missing',
        weight: 15,
      },
      service_record: {
        fieldKey: 'service_record',
        label: 'Certified Service Maintenance Log',
        value: 'Missing documentation',
        source: 'None',
        timestamp: 'Missing',
        status: 'missing',
        weight: 15,
      },
    },
  },
};
