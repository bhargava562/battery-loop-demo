import React from 'react';
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
        backgroundColor: 'var(--bg-deep-workspace)',
        color: 'var(--text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-dark)',
        zIndex: 50,
      }}
    >
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={17} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              BatteryLoop
            </span>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                color: '#8CAAA4',
                letterSpacing: '0.02em',
              }}
            >
              Decision Theatre
            </span>
          </div>
        </div>

        {/* Clear Notice: SIMULATED DEMO DATA */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: '#B6D2CD',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--signal-amber)' }} />
          <span>SIMULATED DEMO DATA · SCREENING PROTOTYPE</span>
        </div>
      </div>

      {/* Center: Case Quick Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', color: '#8CAAA4', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
          Active Case:
        </span>
        <select
          value={battery.id}
          onChange={(e) => onSelectBattery(e.target.value)}
          aria-label="Active Battery Case"
          style={{
            background: '#133935',
            color: '#FFFFFF',
            border: '1px solid #23524C',
            borderRadius: 'var(--radius-xs)',
            padding: '5px 10px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {allBatteries.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} · {b.vehicleModel} (SoH {b.reportedSoH}%)
            </option>
          ))}
        </select>

        <span
          className={
            battery.id === 'BL-003'
              ? 'badge badge-coral'
              : battery.criticalSafetyFlag
              ? 'badge badge-red'
              : battery.evidenceCompleteness === 'complete'
              ? 'badge badge-teal'
              : 'badge badge-amber'
          }
        >
          {battery.id === 'BL-003'
            ? 'Evidence Conflict'
            : battery.criticalSafetyFlag
            ? 'Critical Flag'
            : battery.evidenceCompleteness === 'complete'
            ? 'Complete Data'
            : 'Partial Data'}
        </span>
      </div>

      {/* Right Action Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onExportAudit}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-xs)',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          title="Export JSON audit trail and decision dossier"
        >
          <Download size={13} />
          <span>Export Dossier</span>
        </button>

        <button
          onClick={onResetCase}
          style={{
            background: 'transparent',
            color: '#A2BEB9',
            border: '1px solid #23524C',
            borderRadius: 'var(--radius-xs)',
            padding: '5px 10px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
          title="Restore current case to initial seeded values"
        >
          <RotateCcw size={12} />
          <span>Reset Case</span>
        </button>

        <button
          onClick={onResetEntireDemo}
          style={{
            background: 'transparent',
            color: '#71928C',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            padding: '4px 6px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          title="Clear all stored corrections"
        >
          Reset All
        </button>
      </div>
    </header>
  );
};
