import React from 'react';
import type { Assessment, BatteryCase } from './assessment.types';
import { PATHWAY_CONFIG } from './demoRules';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileQuestion,
  ShieldCheck,
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
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px 24px',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Stage Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-teal">ASSESSMENT</span>
            <span className="text-caption">Rule Output · {battery.id}</span>
          </div>
          <h1>Screening assessment</h1>
        </div>

        {/* Rule Engine Transparency Label */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          textAlign: 'right',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            EVALUATION TYPE
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Rule-based screening suggestion
          </div>
        </div>
      </div>

      {/* DOMINANT PRIMARY RECOMMENDATION BANNER */}
      <div style={{
        background: 'var(--bg-surface)',
        border: `2px solid ${
          assessment.pathway === 'further-controlled-testing'
            ? 'var(--accent-review-coral)'
            : assessment.pathway === 'recycling-assessment'
            ? 'var(--risk-red)'
            : 'var(--accent-primary)'
        }`,
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
              }}>
                1. System Suggestion:
              </span>
              <span className={`badge ${config.badgeClass}`}>
                {assessment.pathway}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}>
              {assessment.pathwayTitle}
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '780px', lineHeight: 1.45 }}>
              {config.shortDesc}
            </p>
          </div>

          {/* Deployment Safety Block Badge */}
          <div style={{
            background: assessment.deploymentBlocked ? 'var(--risk-red-light)' : 'var(--accent-primary-light)',
            border: `1px solid ${assessment.deploymentBlocked ? 'rgba(198, 63, 70, 0.3)' : 'rgba(0, 127, 115, 0.3)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            minWidth: '220px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: assessment.deploymentBlocked ? 'var(--risk-red)' : 'var(--accent-primary)',
              marginBottom: '2px',
            }}>
              DEPLOYMENT STATUS
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: assessment.deploymentBlocked ? 'var(--risk-red)' : 'var(--accent-primary)',
            }}>
              {assessment.deploymentBlocked ? 'BLOCKED · Testing Required' : 'Eligible for Secondary Testing'}
            </div>
          </div>
        </div>
      </div>

      {/* THREE EXPLICIT CORE SECTIONS: 2. WHY, 3. WHAT IS MISSING, 4. NEXT STEP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '16px',
      }}>
        {/* 2. WHY: ACTUAL CONDITIONS THAT TRIGGERED THE RULES */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertTriangle size={15} color="var(--accent-review-coral)" />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-primary)' }}>
              2. Why This Was Suggested
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assessment.ruleExplanations.map((rule) => (
              <div
                key={rule.ruleId}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    [{rule.ruleId}]
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {rule.category}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  {rule.conditionMet}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {rule.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WHAT IS MISSING: EVIDENCE REQUIRED FOR CONCLUSION */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileQuestion size={15} color="var(--signal-amber)" />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-primary)' }}>
              3. What Is Missing
            </span>
          </div>

          {/* Evidence Coverage Score Meter */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Evidence Completeness
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {assessment.evidenceCoverage}%
              </span>
            </div>
            <div style={{ height: '6px', background: '#E2EAE5', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{
                height: '100%',
                width: `${assessment.evidenceCoverage}%`,
                background: assessment.evidenceCoverage >= 70 ? 'var(--accent-primary)' : 'var(--signal-amber)',
                borderRadius: '4px',
              }} />
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
              * Measures proportion of expected telemetry present, NOT probability that battery is safe.
            </p>
          </div>

          {/* Missing Fields List */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Unverified Telemetry Streams:
            </span>
            {assessment.missingEvidence.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--accent-review-coral)', lineHeight: 1.5 }}>
                {assessment.missingEvidence.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>All baseline evidence streams verified</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. NEXT STEP: RECOMMENDED PHYSICAL VALIDATION */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={15} color="var(--accent-primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--text-primary)' }}>
              4. Recommended Next Step
            </span>
          </div>

          <div style={{
            background: 'var(--accent-primary-light)',
            border: '1px solid rgba(0, 127, 115, 0.25)',
            borderRadius: 'var(--radius-xs)',
            padding: '12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '3px' }}>
              ACTIONABLE PHYSICAL TEST
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {assessment.nextRecommendedTest || config.recommendedAction}
            </div>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 'auto 0 0 0', lineHeight: 1.35 }}>
            This screening suggestion is a preliminary laboratory triage aid. Qualified physical bench verification remains mandatory prior to any operational redeployment.
          </p>
        </div>
      </div>

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
          <span>Back to Inspect Pack</span>
        </button>

        <button
          onClick={onProceed}
          className="btn-primary"
        >
          <span>Review and Challenge Suggestion (Stage 04)</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
