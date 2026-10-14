import React, { useState } from 'react';
import type { BatteryCase, ModuleData } from '../assessment/assessment.types';
import { BatteryScene } from '../battery3d/BatteryScene';
import { WorkflowInstructionStrip } from '../../components/WorkflowInstructionStrip';
import {
  ArrowRight,
  AlertTriangle,
  Edit3,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

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
  const [showWhySoH, setShowWhySoH] = useState(false);
  const [showWhyVoltage, setShowWhyVoltage] = useState(false);

  const selectedModule: ModuleData | undefined = battery.modules.find(
    (m) => m.moduleId === selectedModuleId
  );

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
          <span className="badge badge-teal">02 · INSPECT</span>
          <span className="text-caption">Sensor & Provenance Inspection</span>
        </div>
        <h1 style={{ marginBottom: '2px' }}>
          Inspect the battery and understand its evidence.
        </h1>
        <p className="text-body" style={{ fontSize: '13px', margin: 0 }}>
          Investigate the selected battery, verify source origins, and determine what its data actually tells us.
        </p>
      </div>

      {/* 4-Part Contextual Instruction Strip */}
      <WorkflowInstructionStrip
        task="Investigate pack module measurements and identify telemetry provenance."
        input="24 individual module sensor channels and diagnostic test history records."
        response="Maps telemetry onto procedural 3D pack geometry and isolates anomalies."
        output="An evidence snapshot showing what is known, where it came from, and what is missing."
      />

      {/* Main 2-Column Workbench: Dominant 3D Centerpiece + Detailed Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 440px',
        gap: '18px',
        alignItems: 'stretch',
        minHeight: '500px',
      }}>
        {/* LEFT: 3D Pack Centerpiece */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: '460px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Interactive 3D Pack Model · {battery.id}
              </span>
              <span className="text-caption">
                (Click any module to inspect telemetry)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-teal">R3F Interactive Scene</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                M03 = Anomaly Highlight
              </span>
            </div>
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

        {/* RIGHT: Supporting Evidence Inspector Panel */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-divider)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--shadow-xs)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 280px)',
        }}>
          {/* Selected Module Summary Box */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {selectedModule ? `Module ${selectedModule.moduleId}` : 'Select a Module'}
                </span>
                <span className="text-caption">
                  Channel #{selectedModule?.moduleId.replace('M', '')}
                </span>
              </div>
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
                  {selectedModule.hasConflict ? 'Telemetry Conflict' : selectedModule.status}
                </span>
              )}
            </div>

            {selectedModule && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
              }}>
                <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Voltage Delta</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: selectedModule.voltageDeviationMv > 100 ? 'var(--accent-review-coral)' : 'inherit',
                  }}>
                    {selectedModule.voltageDeviationMv} mV
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Temp Variance</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600 }}>
                    +{selectedModule.tempVarianceC}°C
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Impedance</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 600 }}>
                    {selectedModule.internalResistanceMohm} mΩ
                  </div>
                </div>
              </div>
            )}

            {/* M03 Specific Anomaly Callout */}
            {selectedModule?.hasConflict && (
              <div style={{
                marginTop: '10px',
                background: 'var(--accent-review-light)',
                border: '1px solid rgba(255, 114, 94, 0.3)',
                borderRadius: 'var(--radius-xs)',
                padding: '8px 10px',
                fontSize: '11px',
                color: 'var(--text-primary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: 'var(--accent-review-coral)', marginBottom: '2px' }}>
                  <AlertTriangle size={13} />
                  <span>Cell Deviation Anomaly</span>
                </div>
                <span>{selectedModule.issueDescription}</span>
              </div>
            )}
          </div>

          {/* Educational "Why This Matters" Expanders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Why SoH matters */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '8px 10px',
            }}>
              <button
                onClick={() => setShowWhySoH(!showWhySoH)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <HelpCircle size={12} color="var(--accent-primary)" />
                  <span>Why does Reported SoH matter?</span>
                </span>
                {showWhySoH ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {showWhySoH && (
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                  Reported SoH is a software estimate calculated by the vehicle's onboard BMS from Coulomb counting and voltage lookup tables. It is an initial degradation indicator, <strong>not certified physical proof</strong> of cell safety or absence of internal shorts.
                </p>
              )}
            </div>

            {/* Why Cell-voltage deviation matters */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '8px 10px',
            }}>
              <button
                onClick={() => setShowWhyVoltage(!showWhyVoltage)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <HelpCircle size={12} color="var(--accent-primary)" />
                  <span>Why does Cell-Voltage Deviation matter?</span>
                </span>
                {showWhyVoltage ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {showWhyVoltage && (
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                  Cell-voltage deviation indicates the difference between readings across cells. Large deviations (&gt;50 mV) signal localized cell degradation. Demo thresholds (e.g. 50 mV nominal, 120 mV conflict) are <strong>illustrative screening rules</strong> configured for this demonstration, not universal limits.
                </p>
              )}
            </div>
          </div>

          {/* Compact Evidence Telemetry List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)' }}>
                Evidence Records & Provenance
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {Object.keys(battery.evidence).length} Telemetry Streams
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.values(battery.evidence).map((ev) => (
                <div
                  key={ev.fieldKey}
                  style={{
                    background: ev.isContradictory ? 'var(--accent-review-light)' : 'var(--bg-surface-elevated)',
                    border: ev.isContradictory
                      ? '1px solid rgba(255, 114, 94, 0.4)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ev.label}
                    </span>
                    <span className={
                      ev.status === 'verified'
                        ? 'badge badge-teal'
                        : ev.status === 'partial'
                        ? 'badge badge-amber'
                        : 'badge badge-coral'
                    }>
                      {ev.status === 'verified' ? 'Verified' : ev.status === 'partial' ? 'Partial' : 'Missing'}
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: ev.isContradictory ? 'var(--accent-review-coral)' : 'var(--text-primary)',
                    marginBottom: '4px',
                  }}>
                    {ev.value}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    borderTop: '1px dashed var(--border-divider)',
                    paddingTop: '3px',
                  }}>
                    <span title={ev.source}>Source: {ev.source.length > 28 ? ev.source.substring(0, 26) + '…' : ev.source}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{ev.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button & Quick Review Jump */}
          <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={onJumpToReview}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
            >
              <Edit3 size={13} color="var(--accent-review-coral)" />
              <span>Challenge or Correct Evidence in Stage 04</span>
            </button>
            <button
              onClick={onProceed}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <span>Assess this Evidence (Stage 03)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
