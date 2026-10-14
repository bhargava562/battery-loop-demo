import { describe, it, expect } from 'vitest';
import { parseHash, routeToHash } from '../src/app/routes';
import { calculateEvidenceCoverage, evaluateBattery } from '../src/features/assessment/evaluateBattery';
import { DEMO_BATTERIES } from '../src/data/demoBatteries';
import type { BatteryCase } from '../src/features/assessment/assessment.types';

describe('Product Navigation & Routing', () => {
  it('parses workspace, library, registration, and case subtabs accurately', () => {
    expect(parseHash('')).toEqual({ type: 'workspace' });
    expect(parseHash('#/workspace')).toEqual({ type: 'workspace' });
    expect(parseHash('#/batteries')).toEqual({ type: 'batteries' });
    expect(parseHash('#/batteries/new')).toEqual({ type: 'battery-new' });
    expect(parseHash('#/batteries/BL-003/inspect')).toEqual({
      type: 'battery-case',
      batteryId: 'BL-003',
      tab: 'inspect',
    });
    expect(parseHash('#/batteries/BL-003/import')).toEqual({
      type: 'battery-case',
      batteryId: 'BL-003',
      tab: 'import',
    });
    expect(parseHash('#/history')).toEqual({ type: 'history' });
    expect(parseHash('#/settings')).toEqual({ type: 'settings' });
    expect(parseHash('#/dossiers')).toEqual({ type: 'dossiers' });
  });

  it('correctly serializes routes back to hash strings', () => {
    expect(routeToHash({ type: 'workspace' })).toBe('#/workspace');
    expect(routeToHash({ type: 'batteries' })).toBe('#/batteries');
    expect(routeToHash({ type: 'battery-new' })).toBe('#/batteries/new');
    expect(routeToHash({ type: 'battery-case', batteryId: 'BL-003', tab: 'review' })).toBe(
      '#/batteries/BL-003/review'
    );
  });
});

describe('Evidence Coverage & Normalization', () => {
  it('accurately weights verified vs partial vs missing records', () => {
    const mockEvidence = {
      cycler: { label: 'Cycler Telemetry', status: 'verified', weight: 40 },
      bms: { label: 'BMS Telemetry', status: 'partial', weight: 30 },
      service: { label: 'Service Record', status: 'missing', weight: 30 },
    };

    const { coverage, missingFields } = calculateEvidenceCoverage(mockEvidence);
    // 40 + (30 * 0.5) = 55 / 100 = 55%
    expect(coverage).toBe(55);
    expect(missingFields).toContain('BMS Telemetry');
    expect(missingFields).toContain('Service Record');
  });

  it('recomputes recommendation when evidence overrides are provided without mutating original', () => {
    const original = DEMO_BATTERIES['BL-003'];
    expect(original.reportedSoH).toBe(99);

    const baseAssessment = evaluateBattery(original);
    expect(baseAssessment.pathway).toBe('further-controlled-testing');

    // Simulated/reviewed override correcting cell deviation down to 25 mV and verified logs
    const override = {
      reportedSoH: 85,
      modules: original.modules.map((m) => ({
        ...m,
        voltageDeviationMv: 25,
        status: 'nominal' as const,
      })),
      evidence: {
        ...original.evidence,
        service_record: {
          fieldKey: 'service_record',
          label: 'Service Record',
          value: 'Complete Service Log',
          source: 'Reviewer Verified',
          timestamp: '2026-10-14',
          status: 'verified' as const,
          weight: 20,
        },
      },
    };

    const recalculated = evaluateBattery(original, override);
    expect(recalculated.pathway).toBe('second-life-evaluation');

    // Original must remain untouched!
    expect(original.reportedSoH).toBe(99);
  });
});
