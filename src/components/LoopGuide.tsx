import { useState } from 'react';
import { X, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import type { Assessment } from '../features/assessment/assessment.types';

interface LoopGuideProps {
  currentStage: number;
  assessment: Assessment;
  selectedModuleId: string | null;
  hasOverrides: boolean;
  hasReasoningFlag: boolean;
  isDismissed: boolean;
  onDismiss: () => void;
  onRestore: () => void;
}

export const LoopGuide: React.FC<LoopGuideProps> = ({
  currentStage,
  assessment,
  selectedModuleId,
  hasOverrides,
  hasReasoningFlag,
  isDismissed,
  onDismiss,
  onRestore,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (isDismissed) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 100,
      }}>
        <button
          onClick={onRestore}
          aria-label="Re-open Loop Guide"
          style={{
            background: 'var(--bg-dark-petrol)',
            color: 'var(--text-inverse)',
            border: '1px solid var(--accent-instrument-teal)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={14} color="var(--accent-instrument-teal)" />
          <span>Ask Loop</span>
        </button>
      </div>
    );
  }

  // Determine Loop mood state
  const isWarningState =
    assessment.pathway === 'further-controlled-testing' ||
    assessment.deploymentBlocked ||
    hasReasoningFlag ||
    (selectedModuleId === 'M03' && currentStage === 2);

  // Scripted dialogue based on current context
  let dialogueText = '';
  switch (currentStage) {
    case 1:
      dialogueText =
        'Choose a battery case to examine. Notice BL-003: reported SoH shows 99%, but telemetry indicates unresolved risks.';
      break;
    case 2:
      if (selectedModuleId === 'M03') {
        dialogueText =
          'Look at Module M03! A 180 mV voltage deviation contradicts the pristine 99% pack rating. Check where the diagnostic source originated.';
      } else {
        dialogueText =
          'Click individual modules to inspect telemetry origin, timestamp, and verification pedigree.';
      }
      break;
    case 3:
      dialogueText =
        'I found conflicting evidence across telemetry streams. My screening suggestion is decision-support, not a safety clearance.';
      break;
    case 4:
      if (hasOverrides) {
        dialogueText =
          'You recorded a human correction. Notice how the evaluated rule explanation immediately adjusted to reflect your change.';
      } else if (hasReasoningFlag) {
        dialogueText =
          'You recorded a concern about system reasoning. The objection is logged without silently claiming it was resolved.';
      } else {
        dialogueText =
          'Something inaccurate or missing? Overwrite telemetry values or flag reasoning concerns to challenge the automated rule.';
      }
      break;
    case 5:
      dialogueText =
        'Adjust the simulation sliders to test hypothesis boundaries. See which exact rule fires when cell deviation drops below 50 mV.';
      break;
    case 6:
      dialogueText =
        'You decide the final recorded action. Remember that mandatory physical validation remains required before any redeployment.';
      break;
    default:
      dialogueText = 'Welcome to BatteryLoop Decision Theatre.';
  }

  return (
    <div
      role="complementary"
      aria-label="Loop Decision Guide"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '18px',
        zIndex: 100,
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        filter: 'drop-shadow(0 8px 24px rgba(23, 43, 42, 0.16))',
      }}
    >
      {/* Speech Balloon */}
      {!minimized && (
        <div
          style={{
            background: 'var(--bg-soft-white)',
            border: `2px solid ${isWarningState ? 'var(--accent-oxide-coral)' : 'var(--accent-instrument-teal)'}`,
            borderRadius: '12px 12px 2px 12px',
            padding: '12px 14px',
            position: 'relative',
            fontSize: '13px',
            color: 'var(--text-forest-graphite)',
            lineHeight: 1.45,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '4px',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isWarningState ? 'var(--accent-oxide-coral)' : 'var(--accent-instrument-teal)',
            }}>
              <span>LOOP</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 500,
                color: 'var(--text-muted)',
              }}>
                · Field Guide
              </span>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setMinimized(true)}
                aria-label="Minimize Loop Guide"
                style={{ color: 'var(--text-subtle)', padding: '2px', cursor: 'pointer' }}
              >
                <ChevronDown size={14} />
              </button>
              <button
                onClick={onDismiss}
                aria-label="Dismiss Loop Guide"
                style={{ color: 'var(--text-subtle)', padding: '2px', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <p style={{ margin: 0, fontWeight: 500 }}>
            {dialogueText}
          </p>
        </div>
      )}

      {/* Loop Mascot Avatar Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {minimized && (
          <button
            onClick={() => setMinimized(false)}
            aria-label="Expand Loop dialogue"
            style={{
              background: 'var(--bg-soft-white)',
              border: '1px solid var(--border-quiet-line)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 8px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ChevronUp size={12} />
            Read Tip
          </button>
        )}

        {/* Custom SVG Avatar */}
        <div
          onClick={() => setMinimized(!minimized)}
          title="Loop — Contextual Review Guide"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isWarningState
              ? 'linear-gradient(135deg, #163C38 0%, #7A2C1D 100%)'
              : 'linear-gradient(135deg, #163C38 0%, #117C72 100%)',
            border: `2px solid ${isWarningState ? 'var(--accent-oxide-coral)' : 'var(--accent-instrument-teal)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            {/* Robot/meter chassis */}
            <rect x="5" y="8" width="22" height="18" rx="6" fill="#FFFEFA" stroke="#172B2A" strokeWidth="1.5" />
            {/* Antenna with status node */}
            <path d="M16 8V3" stroke="#172B2A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="3" r="2.5" fill={isWarningState ? '#E76F51' : '#117C72'} />

            {/* Dial eyes */}
            <circle cx="11.5" cy="15.5" r="2.2" fill={isWarningState ? '#E76F51' : '#163C38'} />
            <circle cx="20.5" cy="15.5" r="2.2" fill={isWarningState ? '#E76F51' : '#163C38'} />

            {/* Expression mouth */}
            {isWarningState ? (
              // Alert wavy mouth
              <path d="M12 21.5C13.5 20.5 15 22.5 16 21.5C17.5 20.5 19 22.5 20 21.5" stroke="#E76F51" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              // Confident friendly smile
              <path d="M12 21C13.5 22.5 18.5 22.5 20 21" stroke="#117C72" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
