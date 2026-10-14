import React from 'react';
import type { BatteryCase } from '../assessment/assessment.types';
import { BatteryScene } from '../battery3d/BatteryScene';
import { WorkflowInstructionStrip } from '../../components/WorkflowInstructionStrip';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface Stage01SelectProps {
  battery: BatteryCase;
  allBatteries: BatteryCase[];
  selectedModuleId: string | null;
  explode3DView: boolean;
  onSelectBattery: (id: string) => void;
  onSelectModule: (moduleId: string) => void;
  onToggleExplode: () => void;
  onProceed: () => void;
}

export const Stage01Select: React.FC<Stage01SelectProps> = ({
  battery,
  allBatteries,
  selectedModuleId,
  explode3DView,
  onSelectBattery,
  onSelectModule,
  onToggleExplode,
  onProceed,
}) => {
  // Helper to map single consolidated status and short reason
  const getCaseSimplifiedStatus = (b: BatteryCase) => {
    if (b.id === 'BL-003') {
      return {
        status: 'Evidence conflict',
        badgeClass: 'badge-coral',
        reason: '99% reported SoH contradicted by 180 mV cell imbalance on M03 & missing service log.',
      };
    }
    if (b.criticalSafetyFlag) {
      return {
        status: 'Critical risk flag',
        badgeClass: 'badge-red',
        reason: 'Physical casing perforation and thermal venting alarm triggered post-collision.',
      };
    }
    if (b.evidenceCompleteness === 'missing') {
      return {
        status: 'Evidence incomplete',
        badgeClass: 'badge-amber',
        reason: 'Third-party self-reported SoH with missing workshop cycler log and cycle history.',
      };
    }
    if (b.id === 'BL-002') {
      return {
        status: 'Complete evidence',
        badgeClass: 'badge-teal',
        reason: 'Complete records; localized single module M14 impedance drift repairable.',
      };
    }
    return {
      status: 'Complete evidence',
      badgeClass: 'badge-teal',
      reason: 'Verified cycle telemetry and dealer maintenance logs indicate uniform cell aging.',
    };
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: '16px 24px',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Stage Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span className="badge badge-teal">01 · SELECT</span>
          <span className="text-caption">Intake Triage Queue</span>
        </div>
        <h1 style={{ marginBottom: '2px' }}>
          Choose a battery to investigate.
        </h1>
        <p className="text-body" style={{ fontSize: '13px', margin: 0 }}>
          Select a case to understand why it needs assessment and explore its intake profile.
        </p>
      </div>

      {/* 4-Part Contextual Instruction Strip */}
      <WorkflowInstructionStrip
        task="Select an incoming battery case to begin second-life qualification and screening."
        input="Intake record containing vehicle application, reported SoH, and available telemetry streams."
        response="Loads the 3D procedural pack geometry and highlights initial evidence status."
        output="Selected battery dossier ready for physical and sensor inspection in Stage 02."
      />

      {/* Main 3-Column Workbench */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '340px 1fr 340px',
        gap: '16px',
        alignItems: 'stretch',
        minHeight: '480px',
      }}>
        {/* LEFT COLUMN: Simplified Battery Cases List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 280px)',
          paddingRight: '4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '2px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Intake Candidates
            </span>
            <span className="badge badge-neutral">5 Seeded Cases</span>
          </div>

          {allBatteries.map((b) => {
            const isSelected = b.id === battery.id;
            const isBL003 = b.id === 'BL-003';
            const { status, badgeClass, reason } = getCaseSimplifiedStatus(b);

            return (
              <button
                key={b.id}
                onClick={() => onSelectBattery(b.id)}
                style={{
                  background: isSelected
                    ? isBL003
                      ? '#FFFFFF'
                      : 'var(--bg-surface)'
                    : 'var(--bg-surface)',
                  border: isSelected
                    ? isBL003
                      ? '2px solid var(--accent-review-coral)'
                      : '2px solid var(--accent-primary)'
                    : '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  transition: 'border-color 0.15s ease, transform 0.1s ease',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                }}
              >
                {/* Top Row: ID, Vehicle & Highlight Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '13px',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}>
                      {b.id}
                    </span>
                    {isBL003 && (
                      <span className="badge badge-lime">
                        Primary Demo
                      </span>
                    )}
                  </div>
                  <span className={`badge ${badgeClass}`}>
                    {status}
                  </span>
                </div>

                {/* Second Row: Vehicle Model & SoH */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {b.vehicleModel}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {b.reportedSoH}% SoH
                  </span>
                </div>

                {/* Third Row: Single Plain-English Reason */}
                <p style={{
                  fontSize: '11px',
                  color: isBL003 ? 'var(--accent-review-coral)' : 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.35,
                  fontWeight: isBL003 ? 600 : 400,
                }}>
                  {reason}
                </p>
              </button>
            );
          })}
        </div>

        {/* CENTER COLUMN: Real Interactive 3D Pack Centerpiece */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: '440px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                3D Pack Geometry · {battery.id}
              </span>
              <span className="text-caption">
                (Drag to rotate · Scroll to zoom)
              </span>
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
              24 Addressable Module Meshes
            </span>
          </div>

          <div style={{ flex: 1, minHeight: '400px', position: 'relative' }}>
            <BatteryScene
              battery={battery}
              selectedModuleId={selectedModuleId}
              onSelectModule={onSelectModule}
              isExploded={explode3DView}
              onToggleExplode={onToggleExplode}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Battery Dossier & Next Action */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'var(--shadow-xs)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 280px)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="badge badge-teal">Selected Case Dossier</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {battery.chemistry}
              </span>
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '2px 0 4px 0' }}>
              {battery.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {battery.summary}
            </p>
          </div>

          {/* Primary Demo Callout for BL-003 */}
          {battery.id === 'BL-003' && (
            <div style={{
              background: 'var(--accent-review-light)',
              border: '1px solid rgba(255, 114, 94, 0.35)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-review-coral)', fontWeight: 700, fontSize: '12px', marginBottom: '3px' }}>
                <AlertTriangle size={14} />
                <span>Featured Demo Case · Telemetry Conflict</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                BMS self-reports <strong>99% SoH</strong>, but bench diagnostics on <strong>Module M03</strong> reveal a severe <strong>180 mV</strong> voltage deviation with missing service records.
              </p>
            </div>
          )}

          {/* Core Telemetry Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reported SoH</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {battery.reportedSoH}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pack Voltage</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {battery.nominalVoltageV} V
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Capacity</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600 }}>
                {battery.nominalCapacityKwh} kWh
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cycle Count</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600 }}>
                {battery.cycleCount} cyc
              </div>
            </div>
          </div>

          {/* Simulated Data Transparency Notice */}
          <div style={{
            background: 'var(--bg-surface-muted)',
            border: '1px solid var(--border-divider)',
            borderRadius: 'var(--radius-xs)',
            padding: '8px 10px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.35,
          }}>
            <strong>Simulated Data Notice:</strong> All battery cases and measurements in this workspace are illustrative simulated engineering records.
          </div>

          {/* Primary Action Button */}
          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
            <button
              onClick={onProceed}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <span>Inspect Selected Battery</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
