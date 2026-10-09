import { useState } from 'react';
import type {
  Assessment,
  BatteryCase,
  ReasoningFlag,
  ReviewRecord,
  VerificationStatus,
} from '../assessment/assessment.types';
import {
  ArrowLeft,
  ArrowRight,
  Edit2,
  Check,
  Flag,
} from 'lucide-react';

interface Stage04ReviewProps {
  battery: BatteryCase;
  assessment: Assessment;
  reviewRecords: ReviewRecord[];
  reasoningFlags: ReasoningFlag[];
  onSaveCorrection: (
    fieldKey: string,
    fieldLabel: string,
    correctedValue: any,
    correctedStatus: VerificationStatus,
    reason: string,
    reviewerNote: string
  ) => void;
  onFlagReasoning: (
    ruleId: string,
    ruleTitle: string,
    concernDescription: string,
    reviewer: string
  ) => void;
  onBack: () => void;
  onProceed: () => void;
}

export const Stage04Review: React.FC<Stage04ReviewProps> = ({
  battery,
  assessment,
  reviewRecords,
  reasoningFlags,
  onSaveCorrection,
  onFlagReasoning,
  onBack,
  onProceed,
}) => {
  // Editing state for selected field
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('bms_telemetry');
  const [correctedValue, setCorrectedValue] = useState<string>('');
  const [correctedStatus, setCorrectedStatus] = useState<VerificationStatus>('verified');
  const [correctionReason, setCorrectionReason] = useState<string>('Bench Calibration Verification');
  const [reviewerNote, setReviewerNote] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Reasoning flag modal / inline form state
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedRuleToFlag, setSelectedRuleToFlag] = useState<string>(
    assessment.ruleExplanations[0]?.ruleId || 'RULE-CONF-02'
  );
  const [concernNote, setConcernNote] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Senior Battery Engineer (Lead)');

  const selectedEvidence = battery.evidence[selectedFieldKey];

  const handleSelectField = (key: string) => {
    setSelectedFieldKey(key);
    const item = battery.evidence[key];
    setCorrectedValue(item ? String(item.value) : '');
    setCorrectedStatus(item ? item.status : 'verified');
    setSaveSuccessMsg(null);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence) return;
    if (!correctionReason.trim()) {
      alert('A justification reason is mandatory to record a human correction.');
      return;
    }

    onSaveCorrection(
      selectedFieldKey,
      selectedEvidence.label,
      correctedValue || selectedEvidence.value,
      correctedStatus,
      correctionReason,
      reviewerNote
    );

    setSaveSuccessMsg(`Recorded review override on "${selectedEvidence.label}". Decision engine recalculated.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleSaveFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concernNote.trim()) {
      alert('Please explain your concern regarding this automated rule.');
      return;
    }

    const ruleObj = assessment.ruleExplanations.find((r) => r.ruleId === selectedRuleToFlag);
    const title = ruleObj ? ruleObj.title : 'Decision Rule';

    onFlagReasoning(selectedRuleToFlag, title, concernNote, reviewerName);
    setShowFlagModal(false);
    setConcernNote('');
    setSaveSuccessMsg(`Concern recorded on rule [${selectedRuleToFlag}]. Logged in formal audit history.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
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
            <span className="badge badge-coral">STAGE 04 · HUMAN CORRECTION</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Case: {battery.id}
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
            Review, Challenge & Correct Evidence
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Human oversight layer: Overwrite faulty inputs, supply missing documentation, or record reasoning objections
          </p>
        </div>

        <button
          onClick={() => setShowFlagModal(true)}
          style={{
            background: 'var(--accent-coral-light)',
            color: 'var(--accent-oxide-coral)',
            border: '1px solid rgba(231, 111, 81, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Flag size={14} />
          <span>Flag Inappropriate Reasoning</span>
        </button>
      </div>

      {saveSuccessMsg && (
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
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* TWO-COLUMN WORKBENCH: SYSTEM READ vs YOUR REVIEW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        {/* COLUMN 1: System Read (Original Telemetry & Rationale) */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
              ORIGINAL TELEMETRY READ
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              System Registered Streams
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Click any field to initiate an engineering override
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(battery.evidence).map((ev) => {
              const isSelectedForEdit = ev.fieldKey === selectedFieldKey;
              return (
                <div
                  key={ev.fieldKey}
                  onClick={() => handleSelectField(ev.fieldKey)}
                  style={{
                    background: isSelectedForEdit ? '#F3EDE1' : '#F9F7F1',
                    border: isSelectedForEdit
                      ? '2px solid var(--accent-oxide-coral)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-forest-graphite)' }}>
                      {ev.label}
                    </span>
                    <span className={
                      ev.status === 'verified'
                        ? 'badge badge-teal'
                        : ev.status === 'partial'
                        ? 'badge badge-amber'
                        : 'badge badge-neutral'
                    }>
                      {ev.status}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text-forest-graphite)', marginBottom: '4px' }}>
                    {ev.value}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Source: {ev.source}</span>
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current System Suggestion Summary */}
          <div style={{
            marginTop: 'auto',
            background: '#FAF6EE',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              CURRENT EVALUATED OUTCOME:
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-forest-graphite)' }}>
              {assessment.pathwayTitle}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Coverage: {assessment.evidenceCoverage}% · Fired: {assessment.ruleIds.join(', ')}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Your Review / Human Correction Form */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '2px solid var(--accent-oxide-coral)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-coral">YOUR REVIEW</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Field: {selectedEvidence?.label}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
              Engineering Override & Verification
            </h3>
          </div>

          <form onSubmit={handleSaveCorrection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Value Override Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Reviewed Value:
              </label>
              <input
                type="text"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                placeholder="e.g. Calibrated 84% SoH or Full Service Log Uploaded"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  background: '#FFF',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                Original: {selectedEvidence?.value}
              </span>
            </div>

            {/* Verification Status Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Updated Verification Status:
              </label>
              <select
                value={correctedStatus}
                onChange={(e) => setCorrectedStatus(e.target.value as VerificationStatus)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '13px',
                  background: '#FFF',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="verified">Verified (Laboratory Tested / Audited Log)</option>
                <option value="partial">Partial (Self-reported / Incomplete telemetry)</option>
                <option value="unverified">Unverified (Uncorroborated claim)</option>
                <option value="missing">Missing (Document genuinely absent)</option>
              </select>
            </div>

            {/* Mandatory Justification Reason */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Mandatory Review Justification:
              </label>
              <select
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '13px',
                  background: '#FFF',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Bench Calibration Verification">Bench Calibration Verification</option>
                <option value="OEM Dealer Physical Record Supplied">OEM Dealer Physical Record Supplied</option>
                <option value="BMS Sensor Tap Error Corrected">BMS Sensor Tap Error Corrected</option>
                <option value="Discharge Capacity Cycle Test Confirmed">Discharge Capacity Cycle Test Confirmed</option>
                <option value="Marked Incomplete / Missing Prior to Triage">Marked Incomplete / Missing Prior to Triage</option>
                <option value="Other Engineering Justification">Other Engineering Justification</option>
              </select>
            </div>

            {/* Optional Technical Note */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Technical Reviewer Note / Citation:
              </label>
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                rows={3}
                placeholder="Document bench ticket number, calibrated instruments used, or specific reason for challenge..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  background: '#FFF',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Save Correction Action */}
            <button
              type="submit"
              style={{
                background: 'var(--accent-oxide-coral)',
                color: '#FFFEFA',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                marginTop: '6px',
              }}
            >
              <Edit2 size={16} />
              <span>Record Evidence Correction & Recalculate</span>
            </button>
          </form>
        </div>
      </div>

      {/* SAVED CORRECTIONS & FLAGGED REASONINGS AUDIT PREVIEW */}
      {(reviewRecords.length > 0 || reasoningFlags.length > 0) && (
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
            Active Review Adjustments on Case ({reviewRecords.length} corrections, {reasoningFlags.length} flagged concerns)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {reviewRecords.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: '#FDF7F5',
                  border: '1px solid rgba(231, 111, 81, 0.3)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-oxide-coral)' }}>
                    {rec.fieldLabel}:
                  </span>{' '}
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {rec.originalValue}
                  </span>{' '}
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>
                    → {rec.correctedValue}
                  </span>{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({rec.reason})
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-subtle)' }}>
                  {new Date(rec.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}

            {reasoningFlags.map((flag) => (
              <div
                key={flag.id}
                style={{
                  background: 'var(--risk-red-light)',
                  border: '1px solid rgba(190, 61, 61, 0.3)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--risk-red)' }}>
                    [REASONING CONCERN LOGGED: {flag.ruleId}]:
                  </span>{' '}
                  <span style={{ fontSize: '12px', color: 'var(--text-forest-graphite)' }}>
                    "{flag.concernDescription}"
                  </span>{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    — by {flag.reviewer}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-subtle)' }}>
                  {new Date(flag.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FLAG REASONING MODAL */}
      {showFlagModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(23, 43, 42, 0.65)',
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
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--accent-oxide-coral)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Flag size={18} color="var(--accent-oxide-coral)" />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                Flag Automated System Reasoning
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Record a formal engineering objection to an automated rule. This concern will be permanently recorded in the audit history without falsely declaring it resolved.
            </p>

            <form onSubmit={handleSaveFlag} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Target Decision Rule:
                </label>
                <select
                  value={selectedRuleToFlag}
                  onChange={(e) => setSelectedRuleToFlag(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-quiet-line)',
                    fontSize: '13px',
                  }}
                >
                  {assessment.ruleExplanations.map((r) => (
                    <option key={r.ruleId} value={r.ruleId}>
                      [{r.ruleId}] {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Engineering Objection / Concern Description:
                </label>
                <textarea
                  value={concernNote}
                  onChange={(e) => setConcernNote(e.target.value)}
                  rows={4}
                  required
                  placeholder="Explain why this rule or screening assumption is inappropriate for this chemistry or vehicle duty cycle..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-quiet-line)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Reviewer Signature:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-quiet-line)',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowFlagModal(false)}
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
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    background: 'var(--accent-oxide-coral)',
                    color: '#FFF',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Log Reasoning Concern
                </button>
              </div>
            </form>
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
          <span>Back to Assessment</span>
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
          <span>Run Live What-If Simulation (Stage 05)</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
