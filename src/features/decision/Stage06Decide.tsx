import { useState } from 'react';
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
        ? 'High reported SoH cannot be trusted until Module M03 undergoes high-precision laboratory discharge and impedance spectroscopy.'
        : 'Aligning with verified test results and screening recommendations.')
  );
  const [reviewerName, setReviewerName] = useState<string>(
    existingDecision?.reviewer || 'B. K. Sharma (Lead Battery Systems Assessor)'
  );
  const [reviewerRole, setReviewerRole] = useState<string>(
    existingDecision?.reviewerRole || 'High Voltage Diagnostic Engineer'
  );
  const [decisionSaved, setDecisionSaved] = useState(!!existingDecision);

  // Compute outstanding requirements based on chosen pathway and missing fields
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
      alert('A technical justification is mandatory to sign off on a human decision.');
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
            <span className="badge badge-teal">STAGE 06 · HUMAN ACTION & AUDIT</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Case: {battery.id}
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
            Human Decision Sign-off & Audit Dossier
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Record human-led governance action, maintain separation of suggestions vs human choice, and finalize audit log
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handlePrint}
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
            <Printer size={13} />
            Print Report
          </button>
          <button
            onClick={onExportAudit}
            style={{
              background: 'var(--bg-dark-petrol)',
              color: '#FFF',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Download size={13} />
            Export JSON Dossier
          </button>
        </div>
      </div>

      {decisionSaved && (
        <div style={{
          background: 'var(--accent-teal-light)',
          border: '1px solid var(--accent-instrument-teal)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={20} color="var(--accent-instrument-teal)" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-instrument-teal)' }}>
                Human Decision Formally Recorded
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-forest-graphite)' }}>
                Signed by {reviewerName} ({reviewerRole}) on {new Date().toLocaleDateString()}. Outstanding validation items remain open.
              </div>
            </div>
          </div>
          <span className="badge badge-teal">AUDIT SEALED</span>
        </div>
      )}

      {/* THREE SEPARATE VISUAL ELEMENTS SIDE BY SIDE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr 1fr',
        gap: '20px',
      }}>
        {/* ELEMENT 1: SYSTEM SUGGESTION */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
              ELEMENT 01
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              System Suggestion
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Deterministic Rule Output
            </span>
          </div>

          <div style={{
            background: '#FAF8F2',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '14px',
          }}>
            <div style={{ marginBottom: '6px' }}>
              <span className={`badge ${PATHWAY_CONFIG[assessment.pathway].badgeClass}`}>
                {assessment.pathway}
              </span>
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              {assessment.pathwayTitle}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
              {PATHWAY_CONFIG[assessment.pathway].shortDesc}
            </p>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-forest-graphite)' }}>
            <strong>Evidence Coverage:</strong> {assessment.evidenceCoverage}%<br />
            <strong>Confidence:</strong> {assessment.confidence.toUpperCase()}<br />
            <strong>Primary Rule:</strong> {assessment.ruleIds[0]}
          </div>

          <div style={{
            marginTop: 'auto',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
          }}>
            * The system suggestion is an advisory finding and cannot approve vehicle deployment.
          </div>
        </div>

        {/* ELEMENT 2: HUMAN DECISION (THE WORKBENCH) */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '2px solid var(--accent-instrument-teal)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-instrument-teal)' }}>
                ELEMENT 02 · MANDATORY GOVERNANCE
              </span>
              <span className="badge badge-teal">Human In The Loop</span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginTop: '2px' }}>
              Record Human Decision
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Pathway Select */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Assigned Next Workflow Action:
              </label>
              <select
                value={chosenPathway}
                onChange={(e) => setChosenPathway(e.target.value as Pathway)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: '#FFF',
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
                background: 'var(--accent-coral-light)',
                border: '1px solid rgba(231, 111, 81, 0.4)',
                borderRadius: '4px',
                padding: '8px 10px',
                fontSize: '11px',
                color: 'var(--accent-oxide-coral)',
              }}>
                <strong>Divergence Flag:</strong> You are choosing an action that diverges from the automated suggestion ({assessment.pathwayTitle}). Please provide robust engineering reasoning below.
              </div>
            )}

            {/* Justification Textarea */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Engineering Decision Justification:
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={3}
                required
                placeholder="State your technical justification, evidence considered, and safety requirements..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-quiet-line)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  background: '#FFF',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Reviewer Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>
                  Reviewer Name:
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-quiet-line)',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>
                  Role / Title:
                </label>
                <input
                  type="text"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-quiet-line)',
                    fontSize: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Primary Action Button (Explicitly named: Record Human Decision) */}
            <button
              type="submit"
              style={{
                background: 'var(--accent-instrument-teal)',
                color: '#FFFEFA',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                marginTop: '4px',
              }}
            >
              <UserCheck size={16} />
              <span>Record Human Decision</span>
            </button>
          </form>
        </div>

        {/* ELEMENT 3: OUTSTANDING REQUIREMENT */}
        <div style={{
          background: 'var(--bg-soft-white)',
          border: '1px solid var(--border-quiet-line)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--signal-amber)' }}>
              ELEMENT 03
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              Outstanding Requirements
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Mandatory physical tests still open
            </span>
          </div>

          <div style={{
            background: 'var(--signal-amber-light)',
            border: '1px solid rgba(217, 164, 65, 0.4)',
            borderRadius: '6px',
            padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#9E7019', marginBottom: '4px' }}>
              <AlertTriangle size={14} />
              <span>Safety Gate Active</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-forest-graphite)', margin: 0, lineHeight: 1.4 }}>
              No pack may be cleared for second-life energization without physical execution and logging of the following validation tests:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            {outstandingRequirements.map((req, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  background: '#F9F7F1',
                  padding: '8px 10px',
                  borderRadius: '4px',
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
                <span style={{ color: 'var(--text-forest-graphite)', lineHeight: 1.4 }}>
                  {req}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '8px',
          }}>
            * Signed decisions transition to qualified laboratory triage queues.
          </div>
        </div>
      </div>

      {/* COMPLETE DECISION & AUDIT TIMELINE */}
      <div style={{
        background: 'var(--bg-soft-white)',
        border: '1px solid var(--border-quiet-line)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              Audit History & Decision Timeline
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Tamper-evident chronological timeline of all operator interactions, telemetry challenges, and governance actions
            </p>
          </div>
          <span className="badge badge-neutral">
            {auditLog.length} Recorded Events
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '380px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}>
          {auditLog.map((ev) => (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                borderLeft: '2px solid var(--border-quiet-line)',
                paddingLeft: '14px',
                position: 'relative',
              }}
            >
              {/* Timeline marker */}
              <div style={{
                position: 'absolute',
                left: '-5px',
                top: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  ev.type === 'DECISION_RECORDED'
                    ? 'var(--accent-instrument-teal)'
                    : ev.type === 'CORRECTION_RECORDED'
                    ? 'var(--accent-oxide-coral)'
                    : ev.type === 'REASONING_FLAGGED'
                    ? 'var(--risk-red)'
                    : 'var(--text-subtle)',
              }} />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
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
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-subtle)' }}>
                    {new Date(ev.timestamp).toLocaleTimeString()} · {new Date(ev.timestamp).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    by {ev.author}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-forest-graphite)' }}>
                  {ev.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <span>Back to Simulator</span>
        </button>

        <button
          onClick={onResetCase}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-quiet-line)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={13} />
          <span>Restore Seeded Case State</span>
        </button>
      </div>
    </div>
  );
};
