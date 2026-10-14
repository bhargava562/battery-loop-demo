import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  Search,
} from 'lucide-react';
import type { BatteryCase, HumanDecisionRecord } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface WorkspaceOverviewScreenProps {
  batteryCases: Record<string, BatteryCase>;
  humanDecisions: Record<string, HumanDecisionRecord>;
  onSelectBattery: (id: string) => void;
}

export const WorkspaceOverviewScreen: React.FC<WorkspaceOverviewScreenProps> = ({
  batteryCases,
  humanDecisions,
  onSelectBattery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allCases = Object.values(batteryCases);

  const featured = batteryCases['BL-003'] || allCases[0];

  const needsAttention = allCases.filter(
    (c) => c.id === 'BL-003' || c.criticalSafetyFlag || c.evidenceCompleteness !== 'complete'
  );

  const filteredCases = allCases.filter(
    (c) =>
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '28px 36px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Confident Header with Minimal Counts */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Assessment workspace
          </h1>
          <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span><strong>{allCases.length}</strong> cases</span>
            <span>·</span>
            <span style={{ color: 'var(--accent-review-coral)', fontWeight: 600 }}>
              <strong>{needsAttention.length}</strong> need attention
            </span>
            <span>·</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              <strong>{Object.keys(humanDecisions).length}</strong> decided
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('#/batteries/new')}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <Plus size={15} />
          <span>New assessment</span>
        </button>
      </div>

      {/* Featured Hero Workbench: Resume BL-003 + Needs Attention Queue */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        {/* Featured Demonstration Hero: BL-003 */}
        <div
          className="surface-card"
          style={{
            padding: '24px',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAF7 100%)',
            border: '1.5px solid var(--border-divider)',
            borderRadius: 'var(--radius-lg, 14px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-lime">CONTINUE ASSESSMENT</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Active Benchmark
                </span>
              </div>
              <span className="badge badge-coral">Evidence Conflict</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '26px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                {featured.id}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {featured.vehicleModel}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Reported SoH 99% contradicts 180 mV cell imbalance on Module M03.
            </div>

            {/* Visual Telemetry Mini Instrumentation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                background: 'var(--bg-surface-soft)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reported SoH</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {featured.reportedSoH}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Delta</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '17px', fontWeight: 700, color: 'var(--accent-review-coral)', marginTop: '2px' }}>
                  180 mV
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Chemistry</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {featured.chemistry}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rule Pathway</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--signal-amber)', marginTop: '4px' }}>
                  Further Testing
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', zIndex: 2 }}>
            <button
              onClick={() => {
                onSelectBattery(featured.id);
                navigate(`#/batteries/${featured.id}/inspect`);
              }}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              <span>Inspect 3D Battery</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Priority "Needs Attention" Queue */}
        <div
          className="surface-card"
          style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg, 14px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>
                  Needs Attention
                </span>
                <span className="badge badge-amber">{needsAttention.length}</span>
              </div>
              <button
                onClick={() => navigate('#/batteries')}
                style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}
              >
                View all cases →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {needsAttention.slice(0, 3).map((c) => {
                const isConflict = c.id === 'BL-003';
                const isCritical = c.criticalSafetyFlag;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectBattery(c.id);
                      navigate(`#/batteries/${c.id}/inspect`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface-soft)',
                      border: '1px solid var(--border-divider)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px' }}>
                        {c.id}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {c.vehicleModel}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        className={
                          isConflict
                            ? 'badge badge-coral'
                            : isCritical
                            ? 'badge badge-red'
                            : 'badge badge-amber'
                        }
                      >
                        {isConflict ? 'Conflict' : isCritical ? 'Critical Flag' : 'Incomplete'}
                      </span>
                      <ArrowRight size={13} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>Qualified physical inspection mandatory before reuse.</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>IEC / SAE Compliance</span>
          </div>
        </div>
      </div>

      {/* Case Directory Explorer */}
      <div className="surface-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg, 14px)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>
              Battery cases
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({allCases.length})</span>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
            <input
              type="text"
              placeholder="Search case ID or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface-soft)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredCases.map((c) => {
            const isSelected = c.id === featured.id;
            const decision = humanDecisions[c.id];

            return (
              <div
                key={c.id}
                onClick={() => {
                  onSelectBattery(c.id);
                  navigate(`#/batteries/${c.id}/inspect`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(215, 245, 107, 0.12)' : 'transparent',
                  border: isSelected ? '1px solid var(--accent-highlight)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                    {c.id}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {c.vehicleModel}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {c.chemistry} · {c.nominalCapacityKwh} kWh
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px' }}>
                      {c.reportedSoH}%
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SoH</span>
                  </div>

                  <span
                    className={
                      c.id === 'BL-003'
                        ? 'badge badge-coral'
                        : c.criticalSafetyFlag
                        ? 'badge badge-red'
                        : c.evidenceCompleteness === 'complete'
                        ? 'badge badge-teal'
                        : 'badge badge-amber'
                    }
                  >
                    {c.id === 'BL-003' ? 'Conflict' : c.criticalSafetyFlag ? 'Critical Flag' : c.evidenceCompleteness === 'complete' ? 'Complete' : 'Incomplete'}
                  </span>

                  {decision ? (
                    <span className="badge badge-teal" style={{ fontSize: '11px' }}>
                      Decided: {decision.pathwayTitle}
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Open →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
