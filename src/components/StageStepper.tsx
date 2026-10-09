import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface StageStepperProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  hasCorrections: boolean;
  hasDecision: boolean;
}

const STAGES = [
  { num: 1, id: 'select', label: '01 · Select', sub: 'Choose pack record' },
  { num: 2, id: 'inspect', label: '02 · Inspect', sub: '3D geometry & telemetry' },
  { num: 3, id: 'assess', label: '03 · Assess', sub: 'Rule suggestion output' },
  { num: 4, id: 'review', label: '04 · Review', sub: 'Human correction' },
  { num: 5, id: 'simulate', label: '05 · Simulate', sub: 'Live what-if sandbox' },
  { num: 6, id: 'decide', label: '06 · Decide', sub: 'Action & audit record' },
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
        backgroundColor: 'var(--bg-soft-white)',
        borderBottom: '1px solid var(--border-quiet-line)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        overflowX: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {STAGES.map((s, index) => {
          const isActive = s.num === currentStage;
          const isPassed = s.num < currentStage;

          let badgeIcon = null;
          if (s.num === 4 && hasCorrections) {
            badgeIcon = <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-oxide-coral)' }} />;
          } else if (s.num === 6 && hasDecision) {
            badgeIcon = <Check size={12} color="var(--accent-instrument-teal)" />;
          } else if (isPassed) {
            badgeIcon = <Check size={12} color="var(--text-subtle)" />;
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
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--accent-teal-light)' : 'transparent',
                  border: isActive ? '1px solid rgba(17, 124, 114, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s, border-color 0.15s',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {/* Stage Number & Title */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? 'var(--accent-instrument-teal)'
                      : isPassed
                      ? 'var(--text-forest-graphite)'
                      : 'var(--text-muted)',
                  }}>
                    <span>{s.label}</span>
                    {badgeIcon}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: isActive ? 'var(--accent-instrument-teal)' : 'var(--text-subtle)',
                    fontFamily: 'var(--font-sans)',
                  }}>
                    {s.sub}
                  </div>
                </div>
              </button>

              {index < STAGES.length - 1 && (
                <div style={{ color: 'var(--border-quiet-line)', margin: '0 4px', display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={16} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
