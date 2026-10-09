import { RotateCcw, Download, Cpu } from 'lucide-react';
import type { BatteryCase } from '../features/assessment/assessment.types';

interface HeaderProps {
  battery: BatteryCase;
  allBatteries: BatteryCase[];
  onSelectBattery: (id: string) => void;
  onResetCase: () => void;
  onResetEntireDemo: () => void;
  onExportAudit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  battery,
  allBatteries,
  onSelectBattery,
  onResetCase,
  onResetEntireDemo,
  onExportAudit,
}) => {
  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-dark-petrol)',
        color: 'var(--text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-dark)',
      }}
    >
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'var(--accent-instrument-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(17, 124, 114, 0.4)',
            }}
          >
            <Cpu size={18} color="#FFFEFA" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                BatteryLoop
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(213, 221, 214, 0.15)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  color: '#A9C4C0',
                  letterSpacing: '0.04em',
                }}
              >
                DECISION THEATRE
              </span>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#89A8A4',
            borderLeft: '1px solid rgba(213, 221, 214, 0.2)',
            paddingLeft: '16px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D9A441' }}></span>
          <span>DEMO WORKSPACE · SIMULATED DATA</span>
        </div>
      </div>

      {/* Center: Quick Battery Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#97B3AF', fontFamily: 'var(--font-mono)' }}>
          Active Case:
        </span>
        <select
          value={battery.id}
          onChange={(e) => onSelectBattery(e.target.value)}
          aria-label="Select Battery Case"
          style={{
            background: '#0F2B28',
            color: '#F4F1E8',
            border: '1px solid #285550',
            borderRadius: '4px',
            padding: '5px 12px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {allBatteries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} — {b.vehicleModel} (SoH {b.reportedSoH}%)
            </option>
          ))}
        </select>

        <span
          className={
            battery.evidenceCompleteness === 'complete'
              ? 'badge badge-teal'
              : battery.evidenceCompleteness === 'partial'
              ? 'badge badge-amber'
              : 'badge badge-coral'
          }
        >
          {battery.evidenceCompleteness} evidence
        </span>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onExportAudit}
          style={{
            background: '#1D4540',
            color: '#F4F1E8',
            border: '1px solid #2A5D57',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
          title="Export JSON audit trail and decision dossier"
        >
          <Download size={14} />
          Export Dossier
        </button>

        <button
          onClick={onResetCase}
          style={{
            background: 'transparent',
            color: '#A9C4C0',
            border: '1px solid #285550',
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          title="Restore current case to seeded telemetry"
        >
          <RotateCcw size={13} />
          Reset Case
        </button>

        <button
          onClick={onResetEntireDemo}
          style={{
            background: 'transparent',
            color: '#738C89',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 6px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          title="Clear all local storage corrections and start clean"
        >
          Reset All
        </button>
      </div>
    </header>
  );
};
