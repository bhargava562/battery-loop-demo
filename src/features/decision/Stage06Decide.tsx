import React, { useState } from 'react';
import type {
  Assessment,
  AuditEvent,
  BatteryCase,
  HumanDecisionRecord,
  Pathway,
} from '../assessment/assessment.types';
import { PATHWAY_CONFIG } from '../assessment/demoRules';
import {
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  RotateCcw,
  UserCheck,
  ArrowLeft,
} from 'lucide-react';

interface Stage06DecideProps {
  battery: BatteryCase;
  assessment: Assessment;
  auditLog: AuditEvent[];
  existingDecision?: HumanDecisionRecord;
  onRecordDecision: (record: HumanDecisionRecord) => void;
  onExportAudit: () => void;
  onResetCase: () => void;
  onBack: () => void;
}

export const Stage06Decide: React.FC<Stage06DecideProps> = ({
  battery,
  assessment,
  auditLog,
  existingDecision,
  onRecordDecision,
  onExportAudit,
  onResetCase,
  onBack,
}) => {
  const [chosenPathway, setChosenPathway] = useState<Pathway>(
    existingDecision?.pathway || assessment.pathway
  );
  const [justification, setJustification] = useState<string>(
    existingDecision?.justification ||
      (battery.id === 'BL-003'
        ? 'Reported 99% SoH cannot be accepted for second-life integration while Module M03 exhibits an unverified 180 mV cell imbalance and service records are missing.'
        : 'Aligning with verified test results and screening recommendations.')
  );
  const [reviewerName, setReviewerName] = useState<string>(
    existingDecision?.reviewer || 'Lead Battery Systems Assessor'
  );
  const [reviewerRole, setReviewerRole] = useState<string>(
    existingDecision?.reviewerRole || 'High Voltage Diagnostic Engineer'
  );
  const [decisionSaved, setDecisionSaved] = useState(!!existingDecision);

  // Compile outstanding validation requirements
  const outstandingRequirements: string[] = [];
  if (chosenPathway === 'further-controlled-testing') {
    outstandingRequirements.push(
      'Controlled 0.5C / 1.0C charge-discharge calibration cycle in explosion-proof test chamber',
      'AC Impedance Spectroscopy (EIS) across all 24 individual cell taps',
      'Retrieval of missing OEM vehicle service maintenance records'
    );
  } else if (chosenPathway === 'second-life-evaluation') {
    outstandingRequirements.push(
      'Physical pack insulation resistance test (IEC 62619 / UL 1974 compliance)',
      'High-pot electrical isolation test (>1000V DC)',
      'Stationary ESS integration duty cycle profiling test (minimum 3 baseline cycles)'
    );
  } else if (chosenPathway === 'repair-assessment') {
    outstandingRequirements.push(
      'Physical busbar torque verification and contact resistance measurement',
      'Individual module cell group re-balancing cycle',
      'Post-repair 48-hour thermal soak monitoring'
    );
  } else if (chosenPathway === 'recycling-assessment') {
    outstandingRequirements.push(
      'Safe discharge below 1.0V/cell (depth-of-discharge neutralisation)',
      'Pre-transport thermal barrier packaging certification',
      'Chain-of-custody recycling manifest generation'
    );
  } else {
    outstandingRequirements.push(
      'Final OEM firmware telemetry recalibration',
      'Routine annual safety inspection certification'
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      alert('A technical justification is mandatory to record a human decision.');
      return;
    }

    const record: HumanDecisionRecord = {
      batteryId: battery.id,
      pathway: chosenPathway,
      pathwayTitle: (PATHWAY_CONFIG[chosenPathway as Pathway] || PATHWAY_CONFIG['further-controlled-testing']).title,
      justification,
      reviewer: reviewerName,
      reviewerRole,
      timestamp: new Date().toISOString(),
      outstandingRequirements,
      divergesFromSuggestion: chosenPathway !== assessment.pathway,
      suggestedPathway: assessment.pathway,
    };

    onRecordDecision(record);
    setDecisionSaved(true);
  };

  const handlePrint = () => {
    window.print();
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
            <span className="badge badge-teal">DECISION</span>
            <span className="text-caption">Governance Sign-Off · {battery.id}</span>
          </div>
          <h1>Record triage decision</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: '12px' }}
          >
            <Printer size={13} />
            <span>Print Report</span>
          </button>
          <button
            onClick={onExportAudit}
            className="btn-secondary"
            style={{ fontSize: '12px' }}
          >
            <Download size={13} />
            <span>Export JSON Dossier</span>
          </button>
        </div>
      </div>

      {decisionSaved && (
        <div style={{
          background: 'var(--accent-primary-light)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                Human Decision Formally Recorded in Audit Trail
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Signed by {reviewerName} ({reviewerRole}) on {new Date().toLocaleDateString()}. Outstanding physical validation requirements remain open.
              </div>
            </div>
          </div>
          <span className="badge badge-teal">Audit Sealed</span>
        </div>
      )}

      {/* THREE VISIBLY SEPARATE SECTIONS SIDE-BY-SIDE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr 1fr',
        gap: '18px',
        alignItems: 'stretch',
      }}>
        {/* SECTION 1: SYSTEM SUGGESTION */}
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
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              SECTION 01
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0 0' }}>
              System Suggestion
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Deterministic Rule Output
            </span>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '12px',
          }}>
            <div style={{ marginBottom: '4px' }}>
              <span className={`badge ${PATHWAY_CONFIG[assessment.pathway].badgeClass}`}>
                {assessment.pathway}
              </span>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
              {assessment.pathwayTitle}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {PATHWAY_CONFIG[assessment.pathway].shortDesc}
            </p>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <div><strong>Evidence Coverage:</strong> {assessment.evidenceCoverage}%</div>
            <div><strong>Screening Confidence:</strong> {assessment.confidence.toUpperCase()}</div>
            <div><strong>Primary Rule Fired:</strong> {assessment.ruleIds[0]}</div>
          </div>

          <div style={{
            marginTop: 'auto',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
            lineHeight: 1.35,
          }}>
            * Software suggestions represent decision support and cannot grant safety approval.
          </div>
        </div>

        {/* SECTION 2: YOUR DECISION (HUMAN GOVERNANCE WORKBENCH) */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '2px solid var(--accent-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                SECTION 02 · MANDATORY GOVERNANCE
              </span>
              <span className="badge badge-teal">Human Review</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0 0' }}>
              Your Decision
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Pathway Select */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '3px', color: 'var(--text-primary)' }}>
                Assigned Next Workflow Action:
              </label>
              <select
                value={chosenPathway}
                onChange={(e) => setChosenPathway(e.target.value as Pathway)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="further-controlled-testing">
                  Request Qualified Diagnostic Validation
                </option>
                <option value="repair-assessment">
                  Refer for Repair / Refurbishment Assessment
                </option>
                <option value="second-life-evaluation">
                  Refer for Second-Life Storage Evaluation
                </option>
                <option value="recycling-assessment">
                  Refer for Material Recycling Assessment
                </option>
                <option value="continue-use-candidate">
                  Refer for Continued Active Mobile Use
                </option>
              </select>
            </div>

            {chosenPathway !== assessment.pathway && (
              <div style={{
                background: 'var(--accent-review-light)',
                border: '1px solid rgba(255, 114, 94, 0.35)',
                borderRadius: 'var(--radius-xs)',
                padding: '6px 10px',
                fontSize: '11px',
                color: 'var(--accent-review-coral)',
              }}>
                <strong>Divergence Flag:</strong> You are selecting an action that differs from the system suggestion ({assessment.pathwayTitle}). Please detail your engineering rationale below.
              </div>
            )}

            {/* Justification Textarea */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '3px', color: 'var(--text-primary)' }}>
                Technical Engineering Rationale:
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                required
                placeholder="State your technical justification, evidence considered, and safety requirements..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Reviewer Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '2px', color: 'var(--text-secondary)' }}>
                  Assessor Name:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-divider)',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '2px', color: 'var(--text-secondary)' }}>
                  Role / Title:
                </label>
                <input
                  type="text"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-divider)',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Primary Action Button (Explicitly named: Record Human Decision) */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
            >
              <UserCheck size={15} />
              <span>Record Human Decision</span>
            </button>
          </form>
        </div>

        {/* SECTION 3: STILL REQUIRED */}
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
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--signal-amber)', textTransform: 'uppercase' }}>
              SECTION 03
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0 0' }}>
              Still Required
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Open Physical Validation Gates
            </span>
          </div>

          <div style={{
            background: 'var(--signal-amber-light)',
            border: '1px solid rgba(228, 173, 70, 0.4)',
            borderRadius: 'var(--radius-xs)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#8C6114', marginBottom: '2px' }}>
              <AlertTriangle size={13} />
              <span>Mandatory Physical Gates</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
              The pack cannot proceed to second-life energization until the following physical tests are executed and certified:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {outstandingRequirements.map((req, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  background: 'var(--bg-surface-elevated)',
                  padding: '7px 9px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--signal-amber)',
                }}>
                  0{i + 1}
                </span>
                <span style={{ color: 'var(--text-primary)', lineHeight: 1.35, fontSize: '11px' }}>
                  {req}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
            lineHeight: 1.35,
          }}>
            * Signed decisions route to certified physical laboratory queues.
          </div>
        </div>
      </div>

      {/* COMPLETE DECISION & AUDIT TIMELINE */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-divider)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Audit History & Decision Timeline
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Chronological ledger of operator interactions, telemetry challenges, and governance actions
            </p>
          </div>
          <span className="badge badge-neutral">
            {auditLog.length} Recorded Events
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxHeight: '300px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}>
          {auditLog.map((ev) => (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                borderLeft: '2px solid var(--border-divider)',
                paddingLeft: '12px',
                position: 'relative',
              }}
            >
              {/* Timeline marker */}
              <div style={{
                position: 'absolute',
                left: '-5px',
                top: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  ev.type === 'DECISION_RECORDED'
                    ? 'var(--accent-primary)'
                    : ev.type === 'CORRECTION_RECORDED'
                    ? 'var(--accent-review-coral)'
                    : ev.type === 'REASONING_FLAGGED'
                    ? 'var(--risk-red)'
                    : 'var(--text-muted)',
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1px' }}>
                  <span className={
                    ev.type === 'DECISION_RECORDED'
                      ? 'badge badge-teal'
                      : ev.type === 'CORRECTION_RECORDED'
                      ? 'badge badge-coral'
                      : ev.type === 'REASONING_FLAGGED'
                      ? 'badge badge-red'
                      : 'badge badge-neutral'
                  }>
                    {ev.type.replace('_', ' ')}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(ev.timestamp).toLocaleTimeString()} · {new Date(ev.timestamp).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    by {ev.author}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ev.summary}
                </div>
              </div>
            </div>
          ))}
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
          <span>Back to Simulator</span>
        </button>

        <button
          onClick={onResetCase}
          className="btn-secondary"
          style={{ fontSize: '12px' }}
        >
          <RotateCcw size={13} />
          <span>Restore Seeded Case State</span>
        </button>
      </div>
    </div>
  );
};
