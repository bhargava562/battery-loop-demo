import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface StageStepperProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  hasCorrections: boolean;
  hasDecision: boolean;
}

const STAGES = [
  { num: 1, id: 'select', label: 'Select Case', code: '01 · Select', sub: 'Choose pack intake' },
  { num: 2, id: 'inspect', label: 'Inspect Pack', code: '02 · Inspect', sub: '3D array & sensor provenance' },
  { num: 3, id: 'assess', label: 'Assess Suggestion', code: '03 · Assess', sub: 'Automated screening logic' },
  { num: 4, id: 'review', label: 'Review Evidence', code: '04 · Review', sub: 'Human challenge layer' },
  { num: 5, id: 'simulate', label: 'Simulate Scenarios', code: '05 · Simulate', sub: 'Live what-if testing' },
  { num: 6, id: 'decide', label: 'Record Decision', code: '06 · Decide', sub: 'Action & audit seal' },
];

export const StageStepper: React.FC<StageStepperProps> = ({
  currentStage,
  onSelectStage,
  hasCorrections,
  hasDecision,
}) => {
  return (
    <nav
      aria-label="Workflow Stages"
      style={{
        height: 'var(--stepper-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-divider)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        overflowX: 'auto',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1360px',
        margin: '0 auto',
        gap: '4px',
      }}>
        {STAGES.map((s, index) => {
          const isActive = s.num === currentStage;
          const isCompleted = s.num < currentStage;

          let statusIcon = null;
          if (s.num === 4 && hasCorrections) {
            statusIcon = (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-review-coral)',
                }}
                title="Reviewer overrides recorded"
              />
            );
          } else if (s.num === 6 && hasDecision) {
            statusIcon = <Check size={12} color="var(--accent-primary)" strokeWidth={2.5} />;
          } else if (isCompleted) {
            statusIcon = <Check size={12} color="var(--accent-primary)" strokeWidth={2.5} />;
          }

          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => onSelectStage(s.num)}
                aria-current={isActive ? 'step' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive
                    ? 'var(--accent-primary-light)'
                    : isCompleted
                    ? 'transparent'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(0, 127, 115, 0.3)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease',
                }}
              >
                {/* Step Number Circle */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'var(--accent-primary)'
                      : isCompleted
                      ? '#E2EDE8'
                      : 'var(--bg-surface-muted)',
                    color: isActive
                      ? '#FFFFFF'
                      : isCompleted
                      ? 'var(--accent-primary)'
                      : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {isCompleted ? <Check size={12} strokeWidth={2.5} /> : `0${s.num}`}
                </div>

                {/* Step Labels */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                      color: isActive
                        ? 'var(--accent-primary)'
                        : isCompleted
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      lineHeight: 1.2,
                    }}
                  >
                    <span>{s.label}</span>
                    {statusIcon}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      lineHeight: 1.2,
                      marginTop: '2px',
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              </button>

              {index < STAGES.length - 1 && (
                <div style={{ color: 'var(--border-divider)', margin: '0 2px', display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={14} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
