import { useState } from 'react';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import type { Assessment } from '../features/assessment/assessment.types';
import type { AppRoute } from '../app/routes';

interface LoopGuideProps {
  currentRoute?: AppRoute;
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
  currentRoute,
  currentStage,
  assessment,
  selectedModuleId,
  hasOverrides,
  hasReasoningFlag,
  isDismissed,
  onDismiss,
  onRestore,
}) => {
  // Start compact/collapsed by default so it never blocks UI elements!
  const [isOpen, setIsOpen] = useState(false);

  if (isDismissed) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '18px',
        zIndex: 90,
      }}>
        <button
          onClick={onRestore}
          aria-label="Re-open Loop Guide"
          style={{
            background: 'var(--bg-deep-workspace)',
            color: '#FFFFFF',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 10px',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={12} color="var(--accent-highlight)" />
          <span>Loop Guide</span>
        </button>
      </div>
    );
  }

  // Determine state mood
  const isWarningState =
    assessment.pathway === 'further-controlled-testing' ||
    assessment.deploymentBlocked ||
    hasReasoningFlag ||
    (selectedModuleId === 'M03' && (currentStage === 2 || (currentRoute?.type === 'battery-case' && currentRoute.tab === 'inspect')));

  // Scripted dialogue: exactly <= 2 short plain English sentences (Section 15)
  let dialogueText = '';

  if (currentRoute?.type === 'workspace') {
    dialogueText = 'Welcome to the battery assessment queue. Review incoming cases and resume the BL-003 conflict inspection.';
  } else if (currentRoute?.type === 'batteries') {
    dialogueText = 'Filter and search through facility inventory. Case BL-003 is the primary demonstration case.';
  } else if (currentRoute?.type === 'battery-new') {
    dialogueText = 'Register the incoming pack identity and target application before importing cycler test files.';
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'import') {
    dialogueText = 'This file has fields that need unit mapping. Verify column mappings before saving to case.';
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'inspect') {
    if (selectedModuleId === 'M03') {
      dialogueText = 'Module M03 exhibits a 180 mV cell voltage gap. Check the data source to see where this measurement came from.';
    } else {
      dialogueText = 'Click any module to inspect its readings and timestamps. Unfamiliar terms have inline explanations below.';
    }
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'assessment') {
    dialogueText = 'The recommendation is triggered by conflicting evidence. See rule RULE-CONF-02.';
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'review') {
    dialogueText = hasOverrides
      ? 'Your correction is saved separately from the original reading. The rule engine recalculated in real time.'
      : 'Your correction will be stored separately from the original reading. The rule engine recalculates in real time.';
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'simulate') {
    dialogueText = 'This is a hypothetical value and will not change saved evidence. Use it to explore rule behavior.';
  } else if (currentRoute?.type === 'battery-case' && currentRoute.tab === 'decision') {
    dialogueText = 'This action will be recorded in the audit trail. Qualified diagnostic validation remains outstanding.';
  } else if (currentRoute?.type === 'dossiers') {
    dialogueText = 'Export formal JSON dossiers and verify remaining qualification gates for downstream repurposing.';
  } else if (currentRoute?.type === 'history') {
    dialogueText = 'Immutable audit history of technician overrides, reasoning flags, and signed-off decisions.';
  } else if (currentRoute?.type === 'settings') {
    dialogueText = 'Download sample cycler CSV templates or inspect transparent screening thresholds.';
  } else {
    dialogueText = `BatteryLoop Decision Theatre — Guided second-life battery triage (Stage 0${currentStage}).`;
  }

  return (
    <div
      role="complementary"
      aria-label="Loop Decision Guide"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '18px',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      {/* Speech Balloon - Compact, docked, and non-obstructive */}
      {isOpen && (
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-surface)',
            border: `1.5px solid ${isWarningState ? 'var(--accent-review-coral)' : 'var(--accent-primary)'}`,
            borderRadius: '10px 10px 2px 10px',
            padding: '10px 12px',
            maxWidth: '300px',
            width: '100%',
            boxShadow: 'var(--shadow-md)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '3px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '11px',
              color: isWarningState ? 'var(--accent-review-coral)' : 'var(--accent-primary)',
            }}>
              <span>LOOP</span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>
                · Contextual Guide
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Loop Guide"
                style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
              >
                <ChevronDown size={13} />
              </button>
              <button
                onClick={onDismiss}
                aria-label="Dismiss Loop Guide"
                style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <p style={{
            margin: 0,
            fontSize: '12px',
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            fontWeight: 500,
          }}>
            {dialogueText}
          </p>
        </div>
      )}

      {/* Compact Docked Launcher Pill with Polished SVG Character */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Open Loop Contextual Guide"
        style={{
          pointerEvents: 'auto',
          background: 'var(--bg-deep-workspace)',
          color: '#FFFFFF',
          border: `1.5px solid ${isWarningState ? 'var(--accent-review-coral)' : 'var(--border-dark)'}`,
          borderRadius: 'var(--radius-full)',
          padding: '4px 10px 4px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          transition: 'transform 0.1s ease',
        }}
      >
        {/* Polished SVG Character Avatar */}
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: isWarningState ? '#541A12' : '#0B3A34',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            {/* Robot/meter chassis */}
            <rect x="5" y="8" width="22" height="18" rx="6" fill="#FFFFFF" stroke="#0D2926" strokeWidth="1.5" />
            {/* Antenna */}
            <path d="M16 8V3" stroke="#0D2926" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="3" r="2.5" fill={isWarningState ? '#FF725E' : '#D8F36A'} />
            {/* Eyes */}
            <circle cx="11.5" cy="15.5" r="2" fill="#0D2926" />
            <circle cx="20.5" cy="15.5" r="2" fill="#0D2926" />
            {/* Expression */}
            {isWarningState ? (
              <path d="M12 21C14 20 18 20 20 21" stroke="#FF725E" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M12 20.5C14 22 18 22 20 20.5" stroke="#007F73" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </div>

        <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
          {isOpen ? 'Close Guide' : 'Loop Guide'}
        </span>

        {isWarningState && !isOpen && (
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-review-coral)',
          }} />
        )}
      </button>
    </div>
  );
};
