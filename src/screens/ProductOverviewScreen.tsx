import React, { useState } from 'react';
import { 
  ArrowRight, Plus, ShieldCheck, AlertTriangle, Layers, Cpu, CheckCircle2, 
  ChevronRight, Activity, RotateCcw, CheckSquare, Square, BarChart3, Clock, 
  Zap, FileText, Quote, ChevronDown, ChevronUp, Target
} from 'lucide-react';
import type { BatteryCase, HumanDecisionRecord } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';
import { ScientificConstellationVisual } from '../components/ScientificConstellationVisual';

interface ProductOverviewScreenProps {
  batteryCases: Record<string, BatteryCase>;
  humanDecisions: Record<string, HumanDecisionRecord>;
  onSelectBattery: (id: string) => void;
}

export const ProductOverviewScreen: React.FC<ProductOverviewScreenProps> = ({
  batteryCases,
  humanDecisions,
  onSelectBattery,
}) => {
  const allCases = Object.values(batteryCases);
  const demoCase = batteryCases['BL-003'] || allCases[0];

  const totalCases = allCases.length;
  const conflictCount = allCases.filter((c) => c.id === 'BL-003').length;
  const incompleteCount = allCases.filter((c) => c.evidenceCompleteness !== 'complete' && c.id !== 'BL-003').length;
  const decidedCount = Object.keys(humanDecisions).length;

  // Interactive 6-Step Evidence Validation Checklist State
  const [validationSteps, setValidationSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [expandedPitch, setExpandedPitch] = useState(false);

  const completedStepsCount = Object.values(validationSteps).filter(Boolean).length;

  const toggleStep = (stepNumber: number) => {
    setValidationSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const resetSteps = () => {
    setValidationSteps({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        backgroundColor: 'var(--bg-app)',
      }}
    >
      {/* 1. Asymmetric Hero Section (Inspired by Nomic Reference) */}
      <section
        style={{
          position: 'relative',
          padding: '64px 48px 72px 48px',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          alignItems: 'center',
          gap: '48px',
        }}
      >
        {/* Left Editorial Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <div className="eyebrow-badge" style={{ marginBottom: '16px' }}>
              <Activity size={13} />
              <span>BATTERY INTELLIGENCE</span>
            </div>
            <h1 className="heading-editorial">
              Understand the battery.<br />
              Define its next step.
            </h1>
          </div>

          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              margin: 0,
            }}
          >
            An evidence-based EV battery assessment and decision-support platform for second-life repurposing, triage, and high-voltage qualification.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
            <button
              onClick={() => navigate('#/assessments/new')}
              className="btn-cta-teal"
              style={{ fontSize: '14px', padding: '12px 24px' }}
            >
              <span>Start assessment</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate('#/assessments')}
              className="btn-secondary"
              style={{ fontSize: '14px', padding: '11px 20px', background: '#FFFFFF' }}
            >
              <span>Explore assessments</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '20px',
              marginTop: '12px',
              borderTop: '1px solid var(--border-divider)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--deep-navy)' }}>
                {totalCases}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Packs
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-divider)' }} />

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-review-coral)' }}>
                {conflictCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Conflict Flags
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-divider)' }} />

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-teal)' }}>
                {decidedCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Signed Decisions
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border-divider)' }} />

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--status-review)' }}>
                {incompleteCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pending Intake
              </div>
            </div>
          </div>
        </div>

        {/* Right Scientific Visual (Nomic-style interactive constellation) */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <ScientificConstellationVisual />
        </div>
      </section>

      {/* 2. Featured Assessment Spotlight (Editorial Style Card) */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto 48px auto',
          padding: '0 48px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="editorial-card"
          style={{
            padding: '36px 44px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '40px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFD 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="eyebrow-badge" style={{ background: 'var(--accent-review-light)', color: 'var(--accent-review-coral)' }}>
                PRIMARY BENCHMARK
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Case {demoCase.id}
              </span>
            </div>

            <h2 style={{ fontSize: '26px', marginBottom: '10px', color: 'var(--deep-navy)' }}>
              {demoCase.id} · {demoCase.vehicleModel}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              BMS telemetry reports 99% State-of-Health, but workshop cycler discharge records reveal a severe 180 mV cell imbalance localized on Module M03 with unverified maintenance history.
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  onSelectBattery(demoCase.id);
                  navigate(`#/assessments/${demoCase.id}/inspect`);
                }}
                className="btn-primary"
                style={{ padding: '9px 20px' }}
              >
                <span>Open 3D inspection</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  onSelectBattery(demoCase.id);
                  navigate(`#/assessments/${demoCase.id}/review`);
                }}
                className="btn-secondary"
                style={{ padding: '8px 18px' }}
              >
                <span>Review conflict</span>
              </button>
            </div>
          </div>

          {/* Interactive Pack Telemetry Preview */}
          <div
            style={{
              background: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Diagnostic Stream
              </span>
              <span className="badge badge-coral">EVIDENCE CONFLICT</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-divider)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reported SoH</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {demoCase.reportedSoH}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Vehicle BMS</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-divider)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Max Delta V</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-review-coral)' }}>
                  180 mV
                </div>
                <div style={{ fontSize: '10px', color: 'var(--accent-review-coral)' }}>Module M03 Anomaly</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="var(--accent-review-coral)" />
              <span>Suggested Next Step: Further Controlled High-Precision Testing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. The Evidence Reconciliation Challenge & Empirical Validation Section */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto 48px auto',
          padding: '0 48px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="editorial-card"
          style={{
            padding: '36px 40px',
            background: '#FFFFFF',
            border: '1px solid var(--border-divider)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Header & Core Problem Statement */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="eyebrow-badge">
                <Target size={12} />
                <span>PROBLEM & ROOT CAUSE</span>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Industry Engineering Challenge
              </span>
            </div>

            <h2 style={{ fontSize: '24px', color: 'var(--deep-navy)', marginBottom: '12px', lineHeight: 1.3 }}>
              The gap between measuring battery condition and making a defensible disposition decision
            </h2>

            <div
              style={{
                background: 'var(--bg-surface-secondary)',
                borderLeft: '4px solid var(--accent-teal)',
                padding: '16px 20px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                marginBottom: '14px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--deep-navy)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>
                Problem Statement
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                Independent EV battery assessors and second-life battery operators lack a reliable, standardized way to reconcile battery-management-system (BMS) health estimates, physical inspection findings, diagnostic records, and electrical test results into a traceable disposition decision. This evidence gap leads to uncertain battery grading, unnecessary teardown, delayed decisions, and difficulty justifying whether a pack should be repaired, reused, repurposed, or recycled.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(224, 90, 71, 0.05)',
                border: '1px solid rgba(224, 90, 71, 0.2)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-review-coral)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                One-Sentence Root Cause:
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                Battery condition data exists, but it is not consistently reconciled with physical evidence, operating history, and standardized test conditions to support an auditable decision about the battery's next use.
              </span>
            </div>
          </div>

          {/* 4 Empirical Leads Grid */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Empirical Findings
                </div>
                <h3 style={{ fontSize: '18px', color: 'var(--deep-navy)', margin: '2px 0 0 0' }}>
                  What the Research Data Actually Proves
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Reported benchmark leads requiring facility pilot verification
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}
            >
              {/* Metric 1 */}
              <div
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>BMS vs Physical</span>
                  <BarChart3 size={15} color="var(--accent-review-coral)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: 'var(--accent-review-coral)' }}>
                  +91 pp
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                  Max positive discrepancy
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Shown in Panel 1 alongside a -5.8 pp empirical gap and typical ±5 pp BMS variance. Illustrates why BMS SoH alone cannot be trusted without physical validation.
                </p>
              </div>

              {/* Metric 2 */}
              <div
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Teardown Burden</span>
                  <Clock size={15} color="var(--status-review)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: 'var(--deep-navy)' }}>
                  525 min
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                  8.75 hours manual work
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Documented duration in process-time charts. Proves unnecessary teardown is an urgent operational bottleneck to reduce.
                </p>
              </div>

              {/* Metric 3 */}
              <div
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Electrical Testing</span>
                  <Zap size={15} color="var(--accent-teal)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: 'var(--accent-teal)' }}>
                  24+ hrs
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                  Full cycler capacity test
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Duration for complete cycle profiling. Demands rapid upfront screening to prioritize packs rather than testing every candidate blind.
                </p>
              </div>

              {/* Metric 4 */}
              <div
                style={{
                  background: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Automated Extraction</span>
                  <FileText size={15} color="var(--deep-navy)" />
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 800, color: 'var(--deep-navy)' }}>
                  78%
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                  GPT-4 benchmark accuracy
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  13% partially correct, 10% incorrect, 69% string-run stability. Confirms that human-in-the-loop review and audit governance are essential.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Evidence Validation Checklist */}
          <div
            style={{
              background: '#F9FAFD',
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', margin: 0, color: 'var(--deep-navy)' }}>
                    Evidence Validation Checklist
                  </h3>
                  <span
                    className="badge"
                    style={{
                      background: completedStepsCount === 6 ? 'var(--accent-teal-light)' : 'var(--bg-surface-secondary)',
                      color: completedStepsCount === 6 ? 'var(--accent-teal)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                    }}
                  >
                    {completedStepsCount} of 6 validation steps completed
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Design thinking methodology to verify the customer problem before claiming 100% certainty. Pilot target: 30–50 consecutive cases.
                </p>
              </div>

              <button
                onClick={resetSteps}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Reset all checkboxes"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: '6px',
                width: '100%',
                background: 'var(--border-divider)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(completedStepsCount / 6) * 100}%`,
                  background: completedStepsCount === 6 ? 'var(--accent-teal)' : 'var(--accent-cyan)',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>

            {/* Checklist Items Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {[
                {
                  id: 1,
                  title: 'Interview actual decision-makers',
                  desc: 'Speak to independent salvage assessors, refurbishers, and insurer claims assessors about their most recent real battery disposition case.',
                },
                {
                  id: 2,
                  title: 'Collect real anonymized case records',
                  desc: 'Obtain original BMS reports, physical inspection records, electrical test results, and the final decision for the same battery.',
                },
                {
                  id: 3,
                  title: 'Measure the evidence gap',
                  desc: 'Count cases where a critical discrepancy, missing measurement condition, or untraceable record changes or delays a decision.',
                },
                {
                  id: 4,
                  title: 'Establish the current cost',
                  desc: 'Record assessment turnaround time, teardown labor, testing cost, quarantine duration, and documented unnecessary write-offs.',
                },
                {
                  id: 5,
                  title: 'Run a blinded comparison',
                  desc: 'Compare current practice against your prototype and an independent expert\'s assessment of the same cases.',
                },
                {
                  id: 6,
                  title: 'Verify the improvement',
                  desc: 'Report actual agreement rates, error rates, time saved, and costs avoided, including uncertainty and failures.',
                },
              ].map((step) => {
                const isChecked = Boolean(validationSteps[step.id]);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    style={{
                      background: isChecked ? 'rgba(22, 168, 144, 0.05)' : '#FFFFFF',
                      border: isChecked ? '1px solid var(--accent-teal)' : '1px solid var(--border-divider)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ marginTop: '2px', color: isChecked ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                      {isChecked ? <CheckSquare size={17} /> : <Square size={17} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: isChecked ? 'var(--accent-teal)' : 'var(--deep-navy)',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {step.id}. {step.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expandable Strategic Pitch & Confidence Defense Drawer */}
          <div
            style={{
              border: '1px solid var(--border-divider)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setExpandedPitch(!expandedPitch)}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'var(--bg-surface-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Quote size={16} color="var(--accent-teal)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--deep-navy)' }}>
                  Strategic Pitch & Confidence Defense Statement
                </span>
                <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                  EVALUATION SCRIPT
                </span>
              </div>
              {expandedPitch ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedPitch && (
              <div
                style={{
                  padding: '24px 28px',
                  background: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  borderTop: '1px solid var(--border-divider)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    The Pitch: Exact Words to Say
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-navy)', marginBottom: '4px' }}>
                        1. Problem
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        Independent assessors must decide whether a battery should be repaired, reused, repurposed, or recycled. But BMS health, diagnostic logs, physical findings, and electrical tests do not always agree or exist in one traceable record.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-navy)', marginBottom: '4px' }}>
                        2. Solution
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        A Battery Triage and Evidence Reconciliation Service that checks for inconsistencies, identifies missing safety evidence, and produces a traceable assessment with reasoned recommendations instead of unvalidated AI guesses.
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-surface-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--deep-navy)', marginBottom: '4px' }}>
                        3. Proving Impact
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        Piloted on 30–50 real cases against expert benchmarks. Measuring decision agreement, turnaround time, teardown avoided, and evidence completeness before claiming generalized cost savings.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(22, 168, 144, 0.05)',
                    border: '1px solid rgba(22, 168, 144, 0.25)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px 20px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Statement When Challenged: "Are you 100% sure this problem exists?"
                  </div>
                  <blockquote
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--deep-navy)',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    “I am confident that the evidence-reconciliation challenge is technically real, and our supplied research identifies concrete examples of it. I am not claiming that every battery assessor experiences it or that we have already measured its prevalence across the industry. Our next step is to validate the frequency, financial impact, and willingness to pay with real operators and real case records. That is how we will turn a documented engineering problem into a verified customer problem.”
                  </blockquote>
                  <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <strong>Recommended initial GTM entry:</strong> Post-collision EV battery triage for independent assessors and salvage operators.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Assessment Workflow (Connected Graphical Sequence) */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto 48px auto',
          padding: '0 48px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>METHODOLOGY</div>
          <h2 style={{ fontSize: '24px', color: 'var(--deep-navy)' }}>Evidence-based assessment workflow</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {[
            {
              step: '01',
              title: 'Pack Intake',
              desc: 'Register physical pack identity, manufacturer serial, chemistry, and target second-life application.',
              icon: Plus,
            },
            {
              step: '02',
              title: 'Evidence Ingest',
              desc: 'Upload cycler CSV/JSON files, map measurement columns, normalise units, and run data quality validation.',
              icon: Layers,
            },
            {
              step: '03',
              title: '3D Spatial Inspection',
              desc: 'Investigate 24-module pack layout, highlight voltage deviations, and verify sensor mapping in 3D.',
              icon: Cpu,
            },
            {
              step: '04',
              title: 'Human Governance',
              desc: 'Challenge automated findings, record technical justifications, and sign off the next qualification gate.',
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="surface-card"
                style={{
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  borderTop: '3px solid var(--accent-teal)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-teal)' }}>
                    {item.step}
                  </span>
                  <Icon size={18} color="var(--deep-navy)" />
                </div>
                <h3 style={{ fontSize: '16px', margin: 0, color: 'var(--deep-navy)' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Recent Assessments Repository Table */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto 64px auto',
          padding: '0 48px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <div className="eyebrow-badge" style={{ marginBottom: '8px' }}>INVENTORY</div>
            <h2 style={{ fontSize: '24px', color: 'var(--deep-navy)' }}>Recent battery assessments</h2>
          </div>

          <button
            onClick={() => navigate('#/assessments')}
            className="btn-secondary"
            style={{ fontSize: '13px' }}
          >
            <span>View all cases</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="surface-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--bg-surface-secondary)',
                  borderBottom: '1px solid var(--border-divider)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '12px 20px' }}>Battery ID</th>
                <th style={{ padding: '12px 20px' }}>Vehicle / Model</th>
                <th style={{ padding: '12px 20px' }}>Chemistry</th>
                <th style={{ padding: '12px 20px' }}>Reported SoH</th>
                <th style={{ padding: '12px 20px' }}>Status</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCases.map((c) => {
                const isConflict = c.id === 'BL-003';
                const decision = humanDecisions[c.id];

                return (
                  <tr
                    key={c.id}
                    onClick={() => {
                      onSelectBattery(c.id);
                      navigate(`#/assessments/${c.id}/inspect`);
                    }}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-surface-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--deep-navy)' }}>
                          {c.id}
                        </span>
                        {isConflict && <span className="badge badge-coral" style={{ fontSize: '10px' }}>CONFLICT</span>}
                      </div>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                        {c.vehicleModel}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {c.chemistry}
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: isConflict ? 'var(--accent-review-coral)' : 'var(--text-primary)' }}>
                        {c.reportedSoH}%
                      </span>
                    </td>

                    <td style={{ padding: '14px 20px' }}>
                      {decision ? (
                        <span className="badge badge-teal">
                          <CheckCircle2 size={11} />
                          {decision.pathwayTitle}
                        </span>
                      ) : isConflict ? (
                        <span className="badge badge-coral">Evidence Conflict</span>
                      ) : c.criticalSafetyFlag ? (
                        <span className="badge badge-red">Critical Flag</span>
                      ) : (
                        <span className="badge badge-neutral">In Triage</span>
                      )}
                    </td>

                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBattery(c.id);
                          navigate(`#/assessments/${c.id}/inspect`);
                        }}
                        className="btn-secondary"
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                      >
                        <span>Open assessment</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
