import React from 'react';
import { ArrowRight, Plus, ShieldCheck, AlertTriangle, Layers, Cpu, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
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
