import type { BatteryCase } from '../assessment/assessment.types';
import { BatteryScene } from '../battery3d/BatteryScene';
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
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr 340px',
      gap: '20px',
      height: '100%',
      padding: '20px 24px',
      boxSizing: 'border-box',
    }}>
      {/* LEFT COLUMN: Seeded Battery Cases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Battery Records</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Select a field pack for triage evaluation
            </p>
          </div>
          <span className="badge badge-neutral">5 Seeded Cases</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {allBatteries.map((b) => {
            const isSelected = b.id === battery.id;
            const hasConflict = b.id === 'BL-003';
            const hasCritical = b.criticalSafetyFlag;

            return (
              <button
                key={b.id}
                onClick={() => onSelectBattery(b.id)}
                style={{
                  background: isSelected ? 'var(--bg-soft-white)' : '#EBE6DA',
                  border: isSelected
                    ? '2px solid var(--accent-instrument-teal)'
                    : '1px solid var(--border-quiet-line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: isSelected ? 'var(--accent-instrument-teal)' : 'var(--text-forest-graphite)',
                  }}>
                    {b.id}
                  </span>
                  <span
                    className={
                      hasCritical
                        ? 'badge badge-red'
                        : hasConflict
                        ? 'badge badge-coral'
                        : b.evidenceCompleteness === 'complete'
                        ? 'badge badge-teal'
                        : 'badge badge-amber'
                    }
                  >
                    {hasCritical ? 'Safety Flag' : hasConflict ? 'Contradiction' : `${b.reportedSoH}% SoH`}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-forest-graphite)', marginBottom: '4px' }}>
                  {b.vehicleModel}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}>
                  <span>{b.chemistry}</span>
                  <span>·</span>
                  <span>{b.nominalCapacityKwh} kWh</span>
                  <span>·</span>
                  <span>{b.ageYears} yrs</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER COLUMN: Real 3D Pack Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>
              PACK PREVIEW: {battery.id}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
              (Rotate · Zoom · Click Modules)
            </span>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            24 Procedural R3F Meshes
          </span>
        </div>

        <div style={{ flex: 1, minHeight: '440px', position: 'relative' }}>
          <BatteryScene
            battery={battery}
            selectedModuleId={selectedModuleId}
            onSelectModule={onSelectModule}
            isExploded={explode3DView}
            onToggleExplode={onToggleExplode}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Selected Battery Telemetry Dossier */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--bg-soft-white)',
        border: '1px solid var(--border-quiet-line)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        overflowY: 'auto',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span className="badge badge-teal">Pack Dossier</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-subtle)' }}>
              {battery.chemistry}
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{battery.name}</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {battery.summary}
          </p>
        </div>

        {/* Highlight Banner for BL-003 */}
        {battery.id === 'BL-003' && (
          <div style={{
            background: 'var(--accent-coral-light)',
            border: '1px solid rgba(231, 111, 81, 0.4)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-oxide-coral)', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
              <AlertTriangle size={15} />
              <span>KEY DEMO CASE: TELEMETRY CONFLICT</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-forest-graphite)', margin: 0, lineHeight: 1.45 }}>
              Onboard BMS self-reports <strong>99% SoH</strong>, but bench diagnostics on <strong>Module M03</strong> reveal a <strong>180 mV</strong> voltage deviation with missing service records.
            </p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}>
          <div style={{ background: '#F8F6EF', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reported SoH</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-forest-graphite)' }}>
              {battery.reportedSoH}%
            </div>
          </div>
          <div style={{ background: '#F8F6EF', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pack Voltage</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--text-forest-graphite)' }}>
              {battery.nominalVoltageV} V
            </div>
          </div>
          <div style={{ background: '#F8F6EF', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Capacity</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600 }}>
              {battery.nominalCapacityKwh} kWh
            </div>
          </div>
          <div style={{ background: '#F8F6EF', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cycle Count</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600 }}>
              {battery.cycleCount} cyc
            </div>
          </div>
        </div>

        {/* Evidence Health checklist */}
        <div style={{ borderTop: '1px solid var(--border-quiet-line)', paddingTop: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
            Evidence Records Overview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            {Object.values(battery.evidence).map((ev) => (
              <div key={ev.fieldKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-forest-graphite)' }}>{ev.label}</span>
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
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            onClick={onProceed}
            style={{
              width: '100%',
              background: 'var(--accent-instrument-teal)',
              color: '#FFFEFA',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>Inspect Evidence (Stage 02)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
