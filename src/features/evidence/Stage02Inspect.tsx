import type { BatteryCase, ModuleData } from '../assessment/assessment.types';
import { BatteryScene } from '../battery3d/BatteryScene';
import { ArrowRight, AlertTriangle, Database, Clock, Edit3 } from 'lucide-react';

interface Stage02InspectProps {
  battery: BatteryCase;
  selectedModuleId: string | null;
  explode3DView: boolean;
  onSelectModule: (moduleId: string) => void;
  onToggleExplode: () => void;
  onProceed: () => void;
  onJumpToReview: () => void;
}

export const Stage02Inspect: React.FC<Stage02InspectProps> = ({
  battery,
  selectedModuleId,
  explode3DView,
  onSelectModule,
  onToggleExplode,
  onProceed,
  onJumpToReview,
}) => {
  const selectedModule: ModuleData | undefined = battery.modules.find(
    (m) => m.moduleId === selectedModuleId
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 420px',
      gap: '20px',
      height: '100%',
      padding: '20px 24px',
      boxSizing: 'border-box',
    }}>
      {/* LEFT: 3D Pack Centerpiece */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
              Physical & Telemetry Inspection · {battery.id}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Click individual modules to inspect telemetry provenance and sensor tap health
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-teal">EVIDENCE INPUT VIEW</span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              M03 = Conflict Highlight
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: '480px', position: 'relative' }}>
          <BatteryScene
            battery={battery}
            selectedModuleId={selectedModuleId}
            onSelectModule={onSelectModule}
            isExploded={explode3DView}
            onToggleExplode={onToggleExplode}
          />
        </div>
      </div>

      {/* RIGHT: Detailed Evidence Inspector Panel */}
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
        {/* Module Sub-Header */}
        <div style={{
          borderBottom: '1px solid var(--border-quiet-line)',
          paddingBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-forest-graphite)',
            }}>
              {selectedModule ? `Module ${selectedModule.moduleId}` : 'Select a Module'}
            </span>
            {selectedModule && (
              <span
                className={
                  selectedModule.hasConflict
                    ? 'badge badge-coral'
                    : selectedModule.status === 'flagged'
                    ? 'badge badge-amber'
                    : 'badge badge-teal'
                }
              >
                {selectedModule.hasConflict ? 'Severe Conflict' : selectedModule.status}
              </span>
            )}
          </div>

          {selectedModule && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginTop: '10px',
            }}>
              <div style={{ background: '#F8F6EF', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cell Δ Voltage</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: selectedModule.voltageDeviationMv > 100 ? 'var(--accent-oxide-coral)' : 'inherit',
                }}>
                  {selectedModule.voltageDeviationMv} mV
                </div>
              </div>
              <div style={{ background: '#F8F6EF', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Temp Variance</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600 }}>
                  +{selectedModule.tempVarianceC}°C
                </div>
              </div>
              <div style={{ background: '#F8F6EF', padding: '8px', borderRadius: '4px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Internal Res.</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600 }}>
                  {selectedModule.internalResistanceMohm} mΩ
                </div>
              </div>
            </div>
          )}

          {selectedModule?.hasConflict && (
            <div style={{
              marginTop: '10px',
              background: 'var(--accent-coral-light)',
              border: '1px solid rgba(231, 111, 81, 0.3)',
              borderRadius: '4px',
              padding: '8px 10px',
              fontSize: '12px',
              color: 'var(--text-forest-graphite)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: 'var(--accent-oxide-coral)', marginBottom: '2px' }}>
                <AlertTriangle size={13} />
                <span>Diagnostic Anomaly</span>
              </div>
              <span>{selectedModule.issueDescription}</span>
            </div>
          )}
        </div>

        {/* Evidence Table with Sources & Timestamps */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Evidence Telemetry Streams
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
              Source & Pedigree
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.values(battery.evidence).map((ev) => (
              <div
                key={ev.fieldKey}
                style={{
                  background: ev.isContradictory ? 'var(--accent-coral-light)' : '#F8F6EF',
                  border: ev.isContradictory ? '1px solid rgba(231, 111, 81, 0.3)' : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-forest-graphite)' }}>
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

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: ev.isContradictory ? 'var(--accent-oxide-coral)' : 'var(--text-forest-graphite)',
                  marginBottom: '6px',
                }}>
                  {ev.value}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  borderTop: '1px dashed var(--border-quiet-line)',
                  paddingTop: '4px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Database size={11} />
                    <span title={ev.source}>{ev.source.length > 28 ? ev.source.substring(0, 26) + '…' : ev.source}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={11} />
                    <span>{ev.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Review / Edit Jump Callout */}
        <div style={{
          background: 'var(--accent-teal-light)',
          border: '1px solid rgba(17, 124, 114, 0.3)',
          borderRadius: '6px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-instrument-teal)' }}>
              Notice inaccuracies or missing records?
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              You can challenge evidence in Stage 04
            </div>
          </div>
          <button
            onClick={onJumpToReview}
            style={{
              background: 'var(--accent-instrument-teal)',
              color: '#FFFEFA',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Edit3 size={12} />
            Review Now
          </button>
        </div>

        {/* Navigation Action */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
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
            <span>Proceed to Assess Output (Stage 03)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
