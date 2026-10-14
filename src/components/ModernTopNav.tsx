import React from 'react';
import { Download, RotateCcw, Plus, Layers, LayoutDashboard, FileSpreadsheet, FileCheck2 } from 'lucide-react';
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
    if (key === 'workspace') return currentRoute.type === 'workspace';
    if (key === 'batteries') return currentRoute.type === 'batteries';
    if (key === 'evidence') return currentRoute.type === 'battery-case' && currentRoute.tab === 'import';
    if (key === 'dossiers') return currentRoute.type === 'dossiers' || (currentRoute.type === 'battery-case' && currentRoute.tab === 'decision');
    return false;
  };

  return (
    <header
      style={{
        height: 'var(--header-height, 54px)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-divider, #DFE7E0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Brand Wordmark + Primary Destinations */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {/* Brand */}
        <div
          onClick={() => navigate('#/workspace')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
          title="BatteryLoop"
        >
          <BatteryLoopBrandMark size={24} color="var(--bg-deep-forest, #10332F)" accentColor="var(--accent-primary, #087F73)" />
          <span
            style={{
              fontFamily: 'var(--font-display, "Sora")',
              fontWeight: 700,
              fontSize: '17px',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary, #152825)',
            }}
          >
            BatteryLoop
          </span>
        </div>

        {/* Top Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[
            { key: 'workspace', label: 'Workspace', path: '#/workspace', icon: LayoutDashboard },
            { key: 'batteries', label: 'Cases', path: '#/batteries', icon: Layers },
            { key: 'evidence', label: 'Evidence', path: `#/batteries/${battery.id}/import`, icon: FileSpreadsheet },
            { key: 'dossiers', label: 'Dossiers', path: '#/dossiers', icon: FileCheck2 },
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
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  background: active ? 'var(--bg-surface-soft, #EAF0EA)' : 'transparent',
                  color: active ? 'var(--text-primary, #152825)' : 'var(--text-secondary, #657670)',
                  fontWeight: active ? 600 : 500,
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease',
                  border: '1px solid transparent',
                }}
              >
                <Icon size={14} color={active ? 'var(--accent-primary, #087F73)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center/Right: Case Selector, Status & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Case Selector Dropdown (when inside case or available) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={battery.id}
            onChange={(e) => {
              const newId = e.target.value;
              onSelectBattery(newId);
              if (currentRoute.type === 'battery-case') {
                navigate(`#/batteries/${newId}/${currentRoute.tab}`);
              }
            }}
            aria-label="Active Case"
            style={{
              background: 'var(--bg-surface-soft, #EAF0EA)',
              color: 'var(--text-primary, #152825)',
              border: '1px solid var(--border-divider, #DFE7E0)',
              borderRadius: 'var(--radius-sm, 6px)',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            {allBatteries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} · {b.vehicleModel} ({b.reportedSoH}% SoH)
              </option>
            ))}
          </select>

          {/* Conflict / Status Pill */}
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
            style={{ fontSize: '11px', padding: '3px 8px' }}
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
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            background: 'var(--bg-surface-soft)',
            border: '1px solid var(--border-divider)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--signal-amber)' }} />
          SIMULATED
        </span>

        {/* New Assessment Action */}
        <button
          onClick={() => navigate('#/batteries/new')}
          className="btn-primary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <Plus size={14} />
          <span>New Assessment</span>
        </button>

        {/* Quick Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onExportAudit}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="Export JSON Dossier"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          <button
            onClick={onResetCase}
            className="btn-secondary"
            style={{ padding: '6px 8px', fontSize: '12px', color: 'var(--text-muted)' }}
            title="Reset active case to baseline"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </header>
  );
};
