import React, { useState } from 'react';
import type { Assessment, BatteryCase } from '../assessment/assessment.types';
import { PATHWAY_CONFIG } from '../assessment/demoRules';
import {
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
} from 'lucide-react';

interface Stage05SimulateProps {
  battery: BatteryCase;
  selectedModuleId: string | null;
  baseAssessment: Assessment;
  simulatedAssessment: Assessment;
  simulatedInputs: Record<string, any> | null;
  onUpdateSimulation: (key: string, value: any) => void;
  onResetSimulation: () => void;
  onApplySimulationToReview: () => void;
  onBack: () => void;
  onProceed: () => void;
}

export const Stage05Simulate: React.FC<Stage05SimulateProps> = ({
  battery,
  selectedModuleId,
  baseAssessment,
  simulatedAssessment,
  simulatedInputs,
  onUpdateSimulation,
  onResetSimulation,
  onApplySimulationToReview,
  onBack,
  onProceed,
}) => {
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Default values derived from effective battery
  const currentDev =
    simulatedInputs?.selectedModuleVoltage !== undefined
      ? simulatedInputs.selectedModuleVoltage
      : (battery.modules.find((m) => m.moduleId === selectedModuleId)?.voltageDeviationMv ?? 180);

  const baseDev =
    battery.modules.find((m) => m.moduleId === selectedModuleId)?.voltageDeviationMv ?? 180;

  const currentSoH =
    simulatedInputs?.reportedSoH !== undefined
      ? simulatedInputs.reportedSoH
      : battery.reportedSoH;

  const baseSoH = battery.reportedSoH;

  const currentServiceStatus =
    simulatedInputs?.serviceRecordStatus || battery.evidence.service_record?.status || 'missing';

  const baseServiceStatus = battery.evidence.service_record?.status || 'missing';

  const currentSafetyFlag =
    simulatedInputs?.criticalSafetyFlag !== undefined
      ? simulatedInputs.criticalSafetyFlag
      : battery.criticalSafetyFlag;

  const isOutcomeChanged = baseAssessment.pathway !== simulatedAssessment.pathway;

  const handleApply = () => {
    onApplySimulationToReview();
    setShowApplyConfirm(false);
    setApplySuccess(true);
    setTimeout(() => setApplySuccess(false), 3500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: '16px 24px',
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Stage Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-amber">SIMULATE</span>
            <span className="text-caption">Hypothetical Sandbox · {battery.id}</span>
          </div>
          <h1>What-if simulation</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onResetSimulation}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RotateCcw size={13} />
            <span>Reset Scenario</span>
          </button>
        </div>
      </div>

      {/* ISOLATION BANNER */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-divider)',
        borderLeft: '4px solid var(--signal-amber)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
      }}>
        <Info size={16} color="var(--signal-amber)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Isolated What-If Sandbox:</strong> Changes made here are simulated hypotheses evaluated dynamically. They do not alter verified pack evidence unless you deliberately choose to apply them.
        </span>
      </div>

      {applySuccess && (
        <div style={{
          background: 'var(--accent-primary-light)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Check size={16} />
          <span>Simulated test values successfully committed into reviewed case evidence!</span>
        </div>
      )}

      {/* TWO COLUMN GRID: CONTROLS VS BEFORE/AFTER COMPARISON */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '440px 1fr',
        gap: '20px',
        alignItems: 'stretch',
      }}>
        {/* LEFT COLUMN: Controls & Meaningful Knobs */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Simulated Parameter Knobs
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Move sliders across configured rule thresholds
            </span>
          </div>

          {/* Slider 1: Module Cell Voltage Deviation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedModuleId || 'M03'} Cell Voltage Deviation:
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: currentDev > 100 ? 'var(--accent-review-coral)' : currentDev <= 50 ? 'var(--accent-primary)' : 'var(--signal-amber)',
              }}>
                {currentDev} mV
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={currentDev}
              onChange={(e) => onUpdateSimulation('selectedModuleVoltage', Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}>
              <span>10 mV (Ideal)</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>≤ 50 mV (Nominal Gate)</span>
              <span style={{ color: 'var(--accent-review-coral)', fontWeight: 600 }}>≥ 120 mV (Conflict)</span>
              <span>250 mV</span>
            </div>
          </div>

          {/* Slider 2: Reported SoH */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Reported State-of-Health (SoH):
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: currentSoH >= 80 ? 'var(--accent-primary)' : 'var(--risk-red)',
              }}>
                {currentSoH}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={currentSoH}
              onChange={(e) => onUpdateSimulation('reportedSoH', Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginTop: '4px',
            }}>
              <span>50%</span>
              <span style={{ color: 'var(--signal-amber)' }}>75% (Min 2nd-Life)</span>
              <span style={{ color: 'var(--accent-primary)' }}>85%+ (High SoH)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Toggle 3: Service Maintenance History */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Service Maintenance History Record:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onUpdateSimulation('serviceRecordStatus', 'verified')}
                style={{
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentServiceStatus === 'verified' ? 'var(--accent-primary-light)' : 'var(--bg-surface-elevated)',
                  border: currentServiceStatus === 'verified' ? '2px solid var(--accent-primary)' : '1px solid var(--border-divider)',
                  color: currentServiceStatus === 'verified' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                Verified Record
              </button>
              <button
                type="button"
                onClick={() => onUpdateSimulation('serviceRecordStatus', 'missing')}
                style={{
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentServiceStatus === 'missing' ? 'var(--accent-review-light)' : 'var(--bg-surface-elevated)',
                  border: currentServiceStatus === 'missing' ? '2px solid var(--accent-review-coral)' : '1px solid var(--border-divider)',
                  color: currentServiceStatus === 'missing' ? 'var(--accent-review-coral)' : 'var(--text-secondary)',
                }}
              >
                Missing Record
              </button>
            </div>
          </div>

          {/* Toggle 4: Critical Safety Flag */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Critical Safety Rupture Alarm:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onUpdateSimulation('criticalSafetyFlag', false)}
                style={{
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: !currentSafetyFlag ? 'var(--accent-primary-light)' : 'var(--bg-surface-elevated)',
                  border: !currentSafetyFlag ? '2px solid var(--accent-primary)' : '1px solid var(--border-divider)',
                  color: !currentSafetyFlag ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}
              >
                No Critical Flag
              </button>
              <button
                type="button"
                onClick={() => onUpdateSimulation('criticalSafetyFlag', true)}
                style={{
                  padding: '7px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentSafetyFlag ? 'var(--risk-red-light)' : 'var(--bg-surface-elevated)',
                  border: currentSafetyFlag ? '2px solid var(--risk-red)' : '1px solid var(--border-divider)',
                  color: currentSafetyFlag ? 'var(--risk-red)' : 'var(--text-secondary)',
                }}
              >
                Active Safety Flag
              </button>
            </div>
          </div>

          {/* Apply to reviewed action */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button
              onClick={() => setShowApplyConfirm(true)}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <CheckCircle2 size={14} color="var(--accent-primary)" />
              <span>Apply Simulated Values to Reviewed Evidence</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Before/After Comparison */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {/* Side-by-Side Comparison Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}>
            {/* 1. ORIGINAL / BASELINE RECOMMENDATION */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                Current Case Baseline
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {baseAssessment.pathwayTitle}
              </h4>
              <div style={{ marginBottom: '8px' }}>
                <span className={`badge ${PATHWAY_CONFIG[baseAssessment.pathway].badgeClass}`}>
                  {baseAssessment.pathway}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Delta: <strong>{baseDev} mV</strong> · SoH: <strong>{baseSoH}%</strong> · Service: <strong>{baseServiceStatus}</strong>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Active Rules: {baseAssessment.ruleIds.join(', ')}
              </div>
            </div>

            {/* 2. SIMULATED OUTCOME */}
            <div style={{
              background: 'var(--bg-surface)',
              border: `2px solid ${isOutcomeChanged ? 'var(--accent-primary)' : 'var(--border-divider)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              boxShadow: isOutcomeChanged ? 'var(--shadow-sm)' : 'var(--shadow-xs)',
            }}>
              <div style={{
                fontSize: '11px',
                color: isOutcomeChanged ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}>
                <span>Simulated Hypothesis</span>
                {isOutcomeChanged && (
                  <span className="badge badge-teal">Outcome Shifted!</span>
                )}
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {simulatedAssessment.pathwayTitle}
              </h4>
              <div style={{ marginBottom: '8px' }}>
                <span className={`badge ${PATHWAY_CONFIG[simulatedAssessment.pathway].badgeClass}`}>
                  {simulatedAssessment.pathway}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Delta: <strong>{currentDev} mV</strong> · SoH: <strong>{currentSoH}%</strong> · Service: <strong>{currentServiceStatus}</strong>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Fired Rules: {simulatedAssessment.ruleIds.join(', ')}
              </div>
            </div>
          </div>

          {/* EXACT RULE TRIGGER RESPONSIBLE */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-divider)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            flex: 1,
            boxShadow: 'var(--shadow-xs)',
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              Screening Rule Mechanics Behind This Simulation
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
              Observe how specific threshold gates alter the deterministic triage output
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {simulatedAssessment.ruleExplanations.map((rule) => {
                const wasInBase = baseAssessment.ruleIds.includes(rule.ruleId);
                return (
                  <div
                    key={rule.ruleId}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-xs)',
                      background: wasInBase ? 'var(--bg-surface-elevated)' : 'var(--accent-primary-light)',
                      border: wasInBase ? '1px solid var(--border-subtle)' : '1px solid var(--accent-primary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '11px',
                        color: 'var(--accent-primary)',
                      }}>
                        [{rule.ruleId}] {rule.title}
                      </span>
                      {!wasInBase && (
                        <span className="badge badge-teal">Newly Fired Rule</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      Condition: {rule.conditionMet}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Impact: {rule.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL TO APPLY SIMULATED DATA */}
      {showApplyConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(13, 41, 38, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--accent-primary)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Confirm Evidence Override
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '16px' }}>
              Are you sure you want to write these simulated values ({currentDev} mV cell deviation, {currentSoH}% SoH) directly into the reviewed evidence state of <strong>{battery.id}</strong>?
              This will update the formal triage dossier and log an audit event.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowApplyConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="btn-primary"
              >
                Confirm & Overwrite Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
      }}>
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          <ArrowLeft size={15} />
          <span>Back to Review Evidence</span>
        </button>

        <button
          onClick={onProceed}
          className="btn-primary"
        >
          <span>Record Human Decision & Audit (Stage 06)</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
