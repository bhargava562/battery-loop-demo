import type { Assessment, BatteryCase } from './assessment.types';
import { PATHWAY_CONFIG } from './demoRules';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileQuestion,
  Info,
} from 'lucide-react';

interface Stage03AssessProps {
  battery: BatteryCase;
  assessment: Assessment;
  onBack: () => void;
  onProceed: () => void;
}

export const Stage03Assess: React.FC<Stage03AssessProps> = ({
  battery,
  assessment,
  onBack,
  onProceed,
}) => {
  const config = PATHWAY_CONFIG[assessment.pathway];

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxSizing: 'border-box',
    }}>
      {/* Header & Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-teal">STAGE 03 · SYSTEM OUTPUT</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Case: {battery.id} ({battery.vehicleModel})
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
            Automated Decision-Support Assessment
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Transparent rule-based evaluation of current evidence streams
          </p>
        </div>

        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 14px',
          textAlign: 'right',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Decision Confidence</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: assessment.confidence === 'high' ? 'var(--accent-instrument-teal)' : 'var(--signal-amber)',
          }}>
            {assessment.confidence} confidence
          </div>
        </div>
      </div>

      {/* PRIMARY RECOMMENDATION BANNER */}
      <div style={{
        background: 'var(--bg-soft-white)',
        border: `2px solid ${
          assessment.pathway === 'further-controlled-testing'
            ? 'var(--accent-oxide-coral)'
            : assessment.pathway === 'recycling-assessment'
            ? 'var(--risk-red)'
            : 'var(--accent-instrument-teal)'
        }`,
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}>
                System Suggestion:
              </span>
              <span className={`badge ${config.badgeClass}`}>
                {assessment.pathway}
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-forest-graphite)',
              marginBottom: '10px',
            }}>
              {assessment.pathwayTitle}
            </h1>

            <p style={{ fontSize: '14px', color: 'var(--text-forest-graphite)', maxWidth: '780px', lineHeight: 1.5 }}>
              {config.shortDesc}
            </p>
          </div>

          {/* Deployment Block Status */}
          <div style={{
            background: assessment.deploymentBlocked ? 'var(--risk-red-light)' : 'var(--accent-teal-light)',
            border: `1px solid ${assessment.deploymentBlocked ? 'rgba(190, 61, 61, 0.3)' : 'rgba(17, 124, 114, 0.3)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            minWidth: '220px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: assessment.deploymentBlocked ? 'var(--risk-red)' : 'var(--accent-instrument-teal)',
              marginBottom: '4px',
            }}>
              DEPLOYMENT STATUS
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: assessment.deploymentBlocked ? 'var(--risk-red)' : 'var(--accent-instrument-teal)',
            }}>
              {assessment.deploymentBlocked ? 'BLOCKED · Lab Required' : 'Eligible for Stage 2 Testing'}
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div style={{
          marginTop: '18px',
          background: '#F8F6EF',
          borderLeft: '4px solid var(--accent-instrument-teal)',
          padding: '12px 16px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
            Recommended Physical Action:
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-forest-graphite)' }}>
            {assessment.nextRecommendedTest || config.recommendedAction}
          </div>
        </div>
      </div>

      {/* THREE EVIDENCE GAUGES & SUMMARY METRICS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
      }}>
        {/* Gauge 1: Evidence Coverage */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Evidence Coverage
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--text-forest-graphite)' }}>
              {assessment.evidenceCoverage}%
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '8px',
            background: '#EAEFE9',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '10px',
          }}>
            <div style={{
              height: '100%',
              width: `${assessment.evidenceCoverage}%`,
              background: assessment.evidenceCoverage >= 70 ? 'var(--accent-instrument-teal)' : 'var(--signal-amber)',
              borderRadius: '4px',
              transition: 'width 0.4s ease',
            }} />
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
            Weighted percentage of expected evidence fields verified. Completeness indicator, not safety guarantee.
          </p>
        </div>

        {/* Gauge 2: Reason Codes */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Triggered Reason Codes
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {assessment.reasonCodes.map((rc) => (
              <span key={rc} className="badge badge-coral">
                {rc}
              </span>
            ))}
          </div>
        </div>

        {/* Gauge 3: Missing Evidence Fields */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            <FileQuestion size={14} />
            <span>Missing / Incomplete Fields</span>
          </div>
          {assessment.missingEvidence.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--accent-oxide-coral)' }}>
              {assessment.missingEvidence.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--accent-instrument-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} />
              <span>All baseline evidence streams verified</span>
            </div>
          )}
        </div>
      </div>

      {/* TRANSPARENT RULE EXPLANATIONS */}
      <div style={{
        background: 'var(--bg-soft-white)',
        border: '1px solid var(--border-quiet-line)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
              Fired Decision Rules & Audit Rationales
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Deterministic if/else screening rules triggered in order of evaluation hierarchy
            </p>
          </div>
          <span className="badge badge-neutral">
            {assessment.ruleExplanations.length} Active Rules
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assessment.ruleExplanations.map((rule) => (
            <div
              key={rule.ruleId}
              style={{
                border: '1px solid var(--border-subtle)',
                background: '#FAF8F2',
                borderRadius: '6px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'var(--accent-instrument-teal)',
                  }}>
                    [{rule.ruleId}]
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-forest-graphite)' }}>
                    {rule.title}
                  </span>
                </div>
                <span className="badge badge-neutral">
                  Category: {rule.category}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-forest-graphite)', marginBottom: '6px', lineHeight: 1.45 }}>
                <strong>Condition Triggered:</strong> {rule.conditionMet}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                <strong>Evaluation Impact:</strong> {rule.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER & SCREENING LIMITATIONS */}
      <div style={{
        background: '#FAF6EE',
        border: '1px solid var(--border-quiet-line)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--text-forest-graphite)',
        lineHeight: 1.45,
      }}>
        <Info size={18} color="var(--accent-instrument-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Preliminary Decision Support Notice:</strong> This software output is generated by a deterministic rule screening model configured with demo baseline thresholds (e.g., nominal voltage deviation ≤ 50 mV, second-life SoH ≥ 75%). It does not constitute a certified battery-safety approval or guarantee pack viability for mobile or stationary redeployment.
        </div>
      </div>

      {/* STAGE NAVIGATION BAR */}
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
          <span>Back to Inspect Pack</span>
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
          <span>Challenge & Review Evidence (Stage 04)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
