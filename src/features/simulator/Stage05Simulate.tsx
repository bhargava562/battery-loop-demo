import { useState } from 'react';
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

  const currentSoH =
    simulatedInputs?.reportedSoH !== undefined
      ? simulatedInputs.reportedSoH
      : battery.reportedSoH;

  const currentServiceStatus =
    simulatedInputs?.serviceRecordStatus || battery.evidence.service_record?.status || 'missing';

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
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-amber">STAGE 05 · LIVE WHAT-IF</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Case: {battery.id}
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
            Live Scenario & Parameter Simulator
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Hypothetical exploration: Adjust diagnostic variables in real time to observe rule boundary thresholds
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onResetSimulation}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-quiet-line)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} />
            Reset Scenario
          </button>
        </div>
      </div>

      {/* ISOLATION BANNER */}
      <div style={{
        background: '#FAF6EE',
        border: '1px solid var(--signal-amber)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
      }}>
        <Info size={18} color="var(--signal-amber)" style={{ flexShrink: 0 }} />
        <span>
          <strong>ISOLATED SIMULATION SANDBOX:</strong> Changes made here are simulated what-if experiments evaluated dynamically against the rule engine. They do not alter verified pack evidence unless you deliberately choose to apply them.
        </span>
      </div>

      {applySuccess && (
        <div style={{
          background: 'var(--accent-teal-light)',
          border: '1px solid var(--accent-instrument-teal)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent-instrument-teal)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Check size={16} />
          <span>Simulated parameters successfully committed to reviewed pack evidence!</span>
        </div>
      )}

      {/* TWO COLUMN GRID: SLIDERS vs REAL-TIME BEFORE/AFTER RESULT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '460px 1fr',
        gap: '24px',
      }}>
        {/* LEFT COLUMN: Controls & Sliders */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
              Adjust Diagnostic Variables
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Interactive test knobs for rule boundary testing
            </span>
          </div>

          {/* Slider 1: Module Cell Voltage Deviation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>
                {selectedModuleId || 'M03'} Voltage Deviation:
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: currentDev > 100 ? 'var(--accent-oxide-coral)' : currentDev <= 50 ? 'var(--accent-instrument-teal)' : 'var(--signal-amber)',
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
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-instrument-teal)' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-subtle)',
              marginTop: '4px',
            }}>
              <span>10 mV (Ideal)</span>
              <span style={{ color: 'var(--accent-instrument-teal)' }}>≤ 50 mV (Nominal Gate)</span>
              <span style={{ color: 'var(--accent-oxide-coral)' }}>≥ 120 mV (Severe Conflict)</span>
              <span>250 mV</span>
            </div>
          </div>

          {/* Slider 2: Reported SoH */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>
                Reported State-of-Health (SoH):
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 700,
                color: currentSoH >= 80 ? 'var(--accent-instrument-teal)' : 'var(--risk-red)',
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
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-instrument-teal)' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-subtle)',
              marginTop: '4px',
            }}>
              <span>50% (End of Life)</span>
              <span style={{ color: 'var(--signal-amber)' }}>75% (Min 2nd Life)</span>
              <span style={{ color: 'var(--accent-instrument-teal)' }}>85%+ (High SoH)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Toggle 3: Service Maintenance Record Status */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Service Maintenance History Record:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onUpdateSimulation('serviceRecordStatus', 'verified')}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentServiceStatus === 'verified' ? 'var(--accent-teal-light)' : '#F5F3EC',
                  border: currentServiceStatus === 'verified' ? '2px solid var(--accent-instrument-teal)' : '1px solid var(--border-quiet-line)',
                  color: currentServiceStatus === 'verified' ? 'var(--accent-instrument-teal)' : 'var(--text-muted)',
                }}
              >
                Verified Record
              </button>
              <button
                type="button"
                onClick={() => onUpdateSimulation('serviceRecordStatus', 'missing')}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentServiceStatus === 'missing' ? 'var(--accent-coral-light)' : '#F5F3EC',
                  border: currentServiceStatus === 'missing' ? '2px solid var(--accent-oxide-coral)' : '1px solid var(--border-quiet-line)',
                  color: currentServiceStatus === 'missing' ? 'var(--accent-oxide-coral)' : 'var(--text-muted)',
                }}
              >
                Missing Record
              </button>
            </div>
          </div>

          {/* Toggle 4: Critical Safety Flag */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
              Critical Safety Alarm / Rupture Flag:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onUpdateSimulation('criticalSafetyFlag', false)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: !currentSafetyFlag ? 'var(--accent-teal-light)' : '#F5F3EC',
                  border: !currentSafetyFlag ? '2px solid var(--accent-instrument-teal)' : '1px solid var(--border-quiet-line)',
                  color: !currentSafetyFlag ? 'var(--accent-instrument-teal)' : 'var(--text-muted)',
                }}
              >
                No Critical Flag
              </button>
              <button
                type="button"
                onClick={() => onUpdateSimulation('criticalSafetyFlag', true)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: currentSafetyFlag ? 'var(--risk-red-light)' : '#F5F3EC',
                  border: currentSafetyFlag ? '2px solid var(--risk-red)' : '1px solid var(--border-quiet-line)',
                  color: currentSafetyFlag ? 'var(--risk-red)' : 'var(--text-muted)',
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
              style={{
                width: '100%',
                background: 'var(--accent-instrument-teal)',
                color: '#FFF',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={15} />
              <span>Apply Simulated Values to Reviewed Evidence</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Before/After Comparison */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* COMPARISON CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            {/* PRIOR EVALUATION */}
            <div style={{
              background: 'var(--bg-soft-white)',
              border: '1px solid var(--border-quiet-line)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 700,
                marginBottom: '4px',
              }}>
                BASE / REVIEWED OUTCOME
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                {baseAssessment.pathwayTitle}
              </h4>
              <div style={{ marginBottom: '12px' }}>
                <span className={`badge ${PATHWAY_CONFIG[baseAssessment.pathway].badgeClass}`}>
                  {baseAssessment.pathway}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Coverage: <strong>{baseAssessment.evidenceCoverage}%</strong> · Confidence: <strong>{baseAssessment.confidence}</strong>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                Active Rules: {baseAssessment.ruleIds.join(', ')}
              </div>
            </div>

            {/* SIMULATED EVALUATION */}
            <div style={{
              background: 'var(--bg-soft-white)',
              border: `2px solid ${isOutcomeChanged ? 'var(--accent-instrument-teal)' : 'var(--border-quiet-line)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              boxShadow: isOutcomeChanged ? '0 4px 16px rgba(17, 124, 114, 0.15)' : 'none',
              position: 'relative',
            }}>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: isOutcomeChanged ? 'var(--accent-instrument-teal)' : 'var(--text-muted)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '4px',
              }}>
                <span>SIMULATED RESULT</span>
                {isOutcomeChanged && (
                  <span className="badge badge-teal">Outcome Shifted!</span>
                )}
              </div>

              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                {simulatedAssessment.pathwayTitle}
              </h4>
              <div style={{ marginBottom: '12px' }}>
                <span className={`badge ${PATHWAY_CONFIG[simulatedAssessment.pathway].badgeClass}`}>
                  {simulatedAssessment.pathway}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-forest-graphite)', marginBottom: '8px' }}>
                Coverage: <strong>{simulatedAssessment.evidenceCoverage}%</strong> · Confidence: <strong>{simulatedAssessment.confidence}</strong>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>
                Fired Rules: {simulatedAssessment.ruleIds.join(', ')}
              </div>
            </div>
          </div>

          {/* EXACT RULE TRIGGER DIFFERENCE */}
          <div style={{
            background: 'var(--bg-soft-white)',
            border: '1px solid var(--border-quiet-line)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            flex: 1,
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
              Rule Mechanics Behind This Transition
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Observe which specific screening logic drove the change in recommendation
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {simulatedAssessment.ruleExplanations.map((rule) => {
                const wasInBase = baseAssessment.ruleIds.includes(rule.ruleId);
                return (
                  <div
                    key={rule.ruleId}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      background: wasInBase ? '#F8F6EF' : '#E8F5F3',
                      border: wasInBase ? '1px solid var(--border-subtle)' : '1px solid var(--accent-instrument-teal)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: 'var(--accent-instrument-teal)',
                      }}>
                        [{rule.ruleId}] {rule.title}
                      </span>
                      {!wasInBase && (
                        <span className="badge badge-teal">Newly Fired Rule</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-forest-graphite)', marginBottom: '4px' }}>
                      <strong>Condition Met:</strong> {rule.conditionMet}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      <strong>Impact:</strong> {rule.impact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM APPLY MODAL */}
      {showApplyConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(23, 43, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--bg-soft-white)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--accent-instrument-teal)',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Confirm Evidence Override
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-forest-graphite)', lineHeight: 1.45, marginBottom: '16px' }}>
              Are you sure you want to write these simulated test parameters (e.g. {currentDev} mV cell deviation, {currentSoH}% SoH) directly into the reviewed evidence state of <strong>{battery.id}</strong>?
              This will update the formal triage dossier and log an audit event.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowApplyConfirm(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                style={{
                  padding: '8px 18px',
                  borderRadius: '4px',
                  background: 'var(--accent-instrument-teal)',
                  color: '#FFF',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Confirm & Overwrite Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-quiet-line)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Review Evidence</span>
        </button>

        <button
          onClick={onProceed}
          style={{
            background: 'var(--accent-instrument-teal)',
            color: '#FFFEFA',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span>Record Human Decision & Audit (Stage 06)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
