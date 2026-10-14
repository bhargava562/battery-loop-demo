import React, { useState } from 'react';
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
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('bms_telemetry');
  const [correctedValue, setCorrectedValue] = useState<string>('');
  const [correctedStatus, setCorrectedStatus] = useState<VerificationStatus>('verified');
  const [correctionReason, setCorrectionReason] = useState<string>('Bench Calibration Verification');
  const [reviewerNote, setReviewerNote] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [showFlagModal, setShowFlagModal] = useState(false);
  const [selectedRuleToFlag, setSelectedRuleToFlag] = useState<string>(
    assessment.ruleExplanations[0]?.ruleId || 'RULE-CONF-02'
  );
  const [concernNote, setConcernNote] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Lead Battery Systems Assessor');

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

    setSaveSuccessMsg(`Review override saved for "${selectedEvidence.label}". Decision rules recalculated.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleSaveFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concernNote.trim()) {
      alert('Please explain your technical concern regarding this automated rule.');
      return;
    }

    const ruleObj = assessment.ruleExplanations.find((r) => r.ruleId === selectedRuleToFlag);
    const title = ruleObj ? ruleObj.title : 'Decision Rule';

    onFlagReasoning(selectedRuleToFlag, title, concernNote, reviewerName);
    setShowFlagModal(false);
    setConcernNote('');
    setSaveSuccessMsg(`Concern recorded on rule [${selectedRuleToFlag}]. Logged in formal audit ledger.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
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
            <span className="badge badge-coral">REVIEW</span>
            <span className="text-caption">Human Override · {battery.id}</span>
          </div>
          <h1>Evidence review</h1>
        </div>

        <button
          onClick={() => setShowFlagModal(true)}
          style={{
            background: 'var(--accent-review-light)',
            color: 'var(--accent-review-coral)',
            border: '1px solid rgba(255, 114, 94, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Flag size={14} />
          <span>Flag Faulty Reasoning</span>
        </button>
      </div>

      {saveSuccessMsg && (
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
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON: ORIGINAL EVIDENCE VS YOUR REVIEW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        alignItems: 'stretch',
      }}>
        {/* LEFT COLUMN: ORIGINAL EVIDENCE */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Side A
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0 0' }}>
              Original Evidence (System Read)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Click any field to initiate an engineering correction
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.values(battery.evidence).map((ev) => {
              const isSelected = ev.fieldKey === selectedFieldKey;
              return (
                <div
                  key={ev.fieldKey}
                  onClick={() => handleSelectField(ev.fieldKey)}
                  style={{
                    background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                    border: isSelected
                      ? '2px solid var(--accent-review-coral)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ev.label}
                    </span>
                    <span className={
                      ev.status === 'verified'
                        ? 'badge badge-teal'
                        : ev.status === 'partial'
                        ? 'badge badge-amber'
                        : 'badge badge-coral'
                    }>
                      {ev.status}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
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

          {/* Current Evaluated Suggestion Mini-Card */}
          <div style={{
            marginTop: 'auto',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
              Current Evaluated Pathway:
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {assessment.pathwayTitle}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Coverage: {assessment.evidenceCoverage}% · Fired rules: {assessment.ruleIds.join(', ')}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: YOUR REVIEW */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--accent-review-coral)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-coral">Side B · Your Review</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Field: {selectedEvidence?.label}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 0 0' }}>
              Engineering Override & Verification
            </h3>
          </div>

          <form onSubmit={handleSaveCorrection} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Value Override Input */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                Corrected Value:
              </label>
              <input
                type="text"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                placeholder="e.g. Calibrated 84% SoH or Full OEM Service Log Uploaded"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                Original recorded read: <strong>{selectedEvidence?.value}</strong>
              </span>
            </div>

            {/* Verification Status Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                Updated Verification Status:
              </label>
              <select
                value={correctedStatus}
                onChange={(e) => setCorrectedStatus(e.target.value as VerificationStatus)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="verified">Verified (Laboratory Measured / Audited Physical Record)</option>
                <option value="partial">Partial (Self-reported or incomplete test data)</option>
                <option value="unverified">Unverified (Uncorroborated claim)</option>
                <option value="missing">Missing (Document or reading absent)</option>
              </select>
            </div>

            {/* Mandatory Reason */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                Mandatory Reason for Correction:
              </label>
              <select
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Bench Calibration Verification">Bench Calibration Verification</option>
                <option value="OEM Dealer Physical Record Supplied">OEM Dealer Physical Record Supplied</option>
                <option value="BMS Sensor Tap Error Corrected">BMS Sensor Tap Error Corrected</option>
                <option value="Discharge Capacity Cycle Test Confirmed">Discharge Capacity Cycle Test Confirmed</option>
                <option value="Marked Incomplete / Missing Prior to Triage">Marked Incomplete / Missing Prior to Triage</option>
                <option value="Other Technical Justification">Other Technical Justification</option>
              </select>
            </div>

            {/* Reviewer Note */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
                Reviewer Technical Citation / Note:
              </label>
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                rows={3}
                placeholder="Document bench ticket number, calibrated equipment used, or rationale for challenge..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Save Action Button */}
            <button
              type="submit"
              style={{
                background: 'var(--accent-review-coral)',
                color: '#FFFFFF',
                padding: '11px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                marginTop: '4px',
              }}
            >
              <Edit2 size={15} />
              <span>Save Review and Reassess</span>
            </button>
          </form>
        </div>
      </div>

      {/* ACTIVE REVIEW OVERRIDES & RECORDED REASONING OBJECTIONS */}
      {(reviewRecords.length > 0 || reasoningFlags.length > 0) && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
            Logged Adjustments & Objections on Case ({reviewRecords.length} corrections, {reasoningFlags.length} reasoning flags)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {reviewRecords.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: 'var(--accent-review-light)',
                  border: '1px solid rgba(255, 114, 94, 0.25)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-review-coral)' }}>
                    {rec.fieldLabel}:
                  </span>{' '}
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {rec.originalValue}
                  </span>{' '}
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    → {rec.correctedValue}
                  </span>{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    ({rec.reason})
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {new Date(rec.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}

            {reasoningFlags.map((flag) => (
              <div
                key={flag.id}
                style={{
                  background: 'var(--risk-red-light)',
                  border: '1px solid rgba(198, 63, 70, 0.25)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--risk-red)' }}>
                    [REASONING OBJECTION: {flag.ruleId}]:
                  </span>{' '}
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                    "{flag.concernDescription}"
                  </span>{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    — logged by {flag.reviewer}
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {new Date(flag.timestamp).toLocaleTimeString()}
                </span>
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
            maxWidth: '540px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--accent-review-coral)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flag size={18} color="var(--accent-review-coral)" />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
                Flag Automated System Reasoning
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              Record a formal engineering objection to an automated screening rule. This objection will be preserved in the audit ledger without silently assuming it has been resolved.
            </p>

            <form onSubmit={handleSaveFlag} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Target Rule:
                </label>
                <select
                  value={selectedRuleToFlag}
                  onChange={(e) => setSelectedRuleToFlag(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-divider)',
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
                  Technical Objection Rationale:
                </label>
                <textarea
                  value={concernNote}
                  onChange={(e) => setConcernNote(e.target.value)}
                  rows={4}
                  required
                  placeholder="Explain why this rule logic or threshold assumption is inappropriate for this battery chemistry or usage profile..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-divider)',
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
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-divider)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowFlagModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent-review-coral)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-xs)',
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
          <span>Back to Assessment</span>
        </button>

        <button
          onClick={onProceed}
          className="btn-primary"
        >
          <span>Run Live What-If Simulation (Stage 05)</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
