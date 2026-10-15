import React from 'react';
import { Download, RotateCcw, Plus, Layers, FileSpreadsheet, FileCheck2, Compass } from 'lucide-react';
import type { BatteryCase } from '../features/assessment/assessment.types';
import { type AppRoute, navigate } from '../app/routes';
import { BatteryLoopBrandMark } from './BatteryLoopBrandMark';

interface ModernTopNavProps {
  currentRoute: AppRoute;
  battery: BatteryCase;
  allBatteries: BatteryCase[];
  onSelectBattery: (id: string) => void;
  onResetCase: () => void;
  onExportAudit: () => void;
}

export const ModernTopNav: React.FC<ModernTopNavProps> = ({
  currentRoute,
  battery,
  allBatteries,
  onSelectBattery,
  onResetCase,
  onExportAudit,
}) => {
  const isNavActive = (key: string): boolean => {
    if (key === 'overview') return currentRoute.type === 'overview';
    if (key === 'assessments') return currentRoute.type === 'workspace' || currentRoute.type === 'batteries';
    if (key === 'evidence') return currentRoute.type === 'battery-case' && currentRoute.tab === 'import';
    if (key === 'reports') return currentRoute.type === 'dossiers' || (currentRoute.type === 'battery-case' && currentRoute.tab === 'decision');
    return false;
  };

  return (
    <header
      style={{
        height: 'var(--header-height, 60px)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-divider, #E0E8F0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(18, 36, 58, 0.03)',
      }}
    >
      {/* Left: Brand Wordmark + Primary Destinations */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {/* Brand */}
        <div
          onClick={() => navigate('#/overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
          title="BatteryLoop — Battery Intelligence"
        >
          <BatteryLoopBrandMark size={24} color="var(--deep-navy, #102B46)" accentColor="var(--accent-cyan, #19B9D0)" />
          <span
            style={{
              fontFamily: 'var(--font-display, "Manrope")',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '-0.035em',
              color: 'var(--deep-navy, #102B46)',
            }}
          >
            BatteryLoop
          </span>
        </div>

        {/* Top Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { key: 'overview', label: 'Overview', path: '#/overview', icon: Compass },
            { key: 'assessments', label: 'Battery assessments', path: '#/assessments', icon: Layers },
            { key: 'evidence', label: 'Evidence', path: `#/assessments/${battery.id}/evidence`, icon: FileSpreadsheet },
            { key: 'reports', label: 'Reports', path: '#/reports', icon: FileCheck2 },
          ].map((item) => {
            const active = isNavActive(item.key);
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: active ? 'var(--soft-blue, #DCEEFF)' : 'transparent',
                  color: active ? 'var(--deep-navy, #102B46)' : 'var(--text-secondary, #65758B)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '13px',
                  fontFamily: 'var(--font-display, "Manrope")',
                  transition: 'all 0.15s ease',
                  border: '1px solid transparent',
                }}
              >
                <Icon size={14} color={active ? 'var(--accent-teal, #16A890)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center/Right: Case Selector, Status & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Case Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={battery.id}
            onChange={(e) => {
              const newId = e.target.value;
              onSelectBattery(newId);
              if (currentRoute.type === 'battery-case') {
                navigate(`#/assessments/${newId}/${currentRoute.tab}`);
              }
            }}
            aria-label="Active Case"
            style={{
              background: 'var(--bg-surface-secondary, #F0F5FA)',
              color: 'var(--text-primary, #12243A)',
              border: '1px solid var(--border-divider, #E0E8F0)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {allBatteries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} · {b.vehicleModel} ({b.reportedSoH}% SoH)
              </option>
            ))}
          </select>

          {/* Status Pill */}
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
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {battery.id === 'BL-003'
              ? 'Conflict'
              : battery.criticalSafetyFlag
              ? 'Critical Flag'
              : battery.evidenceCompleteness === 'complete'
              ? 'Complete'
              : 'Incomplete'}
          </span>
        </div>

        {/* Minimal Simulated Data Indicator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-divider)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
          SIMULATED
        </span>

        {/* New Assessment Primary Action */}
        <button
          onClick={() => navigate('#/assessments/new')}
          className="btn-primary"
          style={{ padding: '7px 16px', fontSize: '13px' }}
        >
          <Plus size={14} />
          <span>New assessment</span>
        </button>

        {/* Quick Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onExportAudit}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            title="Export JSON Dossier"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          <button
            onClick={onResetCase}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--text-muted)' }}
            title="Reset active case to baseline"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};
