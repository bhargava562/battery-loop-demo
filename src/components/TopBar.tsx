import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Bell,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { BatteryCase } from '../features/assessment/assessment.types';
import { type AppRoute, navigate } from '../app/routes';

interface TopBarProps {
  currentRoute: AppRoute;
  battery: BatteryCase;
  allBatteries: BatteryCase[];
  onSelectBattery: (id: string) => void;
  onResetCase: () => void;
  onResetEntireDemo: () => void;
  onExportAudit: () => void;
  pendingAttentionCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  battery,
  allBatteries,
  onSelectBattery,
  onResetCase,
  onResetEntireDemo,
  onExportAudit,
  pendingAttentionCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive breadcrumbs based on route
  const getBreadcrumbs = () => {
    const crumbs: Array<{ label: string; path?: string }> = [
      { label: 'Workspace', path: '#/workspace' },
    ];

    if (currentRoute.type === 'batteries') {
      crumbs.push({ label: 'Battery Cases' });
    } else if (currentRoute.type === 'battery-new') {
      crumbs.push({ label: 'Battery Cases', path: '#/batteries' });
      crumbs.push({ label: 'Register Battery' });
    } else if (currentRoute.type === 'battery-case') {
      crumbs.push({ label: 'Battery Cases', path: '#/batteries' });
      crumbs.push({ label: currentRoute.batteryId, path: `#/batteries/${currentRoute.batteryId}/inspect` });

      const tabLabels: Record<string, string> = {
        inspect: '3D Inspection',
        import: 'Evidence Intake',
        assessment: 'Rule Assessment',
        review: 'Evidence Review',
        simulate: 'What-If Simulation',
        decision: 'Decision Dossier',
      };
      crumbs.push({ label: tabLabels[currentRoute.tab] || 'Case Detail' });
    } else if (currentRoute.type === 'dossiers') {
      crumbs.push({ label: 'Decision Dossiers' });
    } else if (currentRoute.type === 'history') {
      crumbs.push({ label: 'Audit History' });
    } else if (currentRoute.type === 'settings') {
      crumbs.push({ label: 'Settings & Templates' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      style={{
        height: 'var(--header-height, 56px)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-divider, #DDE5DF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 40,
        position: 'sticky',
        top: 0,
        boxShadow: 'var(--shadow-xs, 0 1px 2px rgba(21, 41, 38, 0.04))',
      }}
    >
      {/* Left: Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={13} color="var(--text-muted, #7E908B)" />}
            {crumb.path ? (
              <button
                onClick={() => navigate(crumb.path!)}
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  color: 'var(--text-secondary, #60706B)',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary, #087F73)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary, #60706B)')}
              >
                {crumb.label}
              </button>
            ) : (
              <span
                style={{
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  color: 'var(--text-primary, #172B29)',
                  padding: '2px 4px',
                }}
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Center / Right: Active Case Switcher, Demo Indicator, Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Active Case Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Case:
          </span>
          <select
            value={battery.id}
            onChange={(e) => {
              const newId = e.target.value;
              onSelectBattery(newId);
              if (currentRoute.type === 'battery-case') {
                navigate(`#/batteries/${newId}/${currentRoute.tab}`);
              }
            }}
            aria-label="Active Battery Case"
            style={{
              background: 'var(--bg-surface-secondary, #EDF2EC)',
              color: 'var(--text-primary, #172B29)',
              border: '1px solid var(--border-divider, #DDE5DF)',
              borderRadius: 'var(--radius-xs, 4px)',
              padding: '5px 10px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
            }}
          >
            {allBatteries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} · {b.vehicleModel} (SoH {b.reportedSoH}%)
              </option>
            ))}
          </select>

          {/* Quick Case Status Pill */}
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
              ? 'Complete'
              : 'Incomplete'}
          </span>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-divider)' }} />

        {/* Prominent Simulated Demo Data Notice */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            color: '#7A5A0A',
            background: 'var(--signal-amber-light, #FDF6E7)',
            border: '1px solid #E6CA85',
            padding: '3px 8px',
            borderRadius: 'var(--radius-xs)',
          }}
          title="All baseline batteries are simulated demo cases. Physical test validation required before second-life deployment."
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--signal-amber)' }} />
          <span>SIMULATED DEMO DATA</span>
        </div>

        {/* Notifications Popover Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Triage alerts & pending reviews"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-divider)',
              background: showNotifications ? 'var(--bg-surface-secondary)' : 'transparent',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Bell size={16} />
            {pendingAttentionCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  background: 'var(--accent-review-coral, #FF735E)',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pendingAttentionCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                width: '320px',
                background: '#FFFFFF',
                border: '1px solid var(--border-divider)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '14px',
                zIndex: 100,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                  Assessment Alerts ({pendingAttentionCount})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Automated Screening</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-review-light)',
                    border: '1px solid #FFD3CC',
                    display: 'flex',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('#/batteries/BL-003/review');
                    setShowNotifications(false);
                  }}
                >
                  <ShieldAlert size={16} color="var(--accent-review-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      BL-003 · Evidence Conflict
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      99% SoH contradicted by 180 mV delta on M03.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--risk-red-light)',
                    border: '1px solid #F6C8CB',
                    display: 'flex',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('#/batteries/BL-004/inspect');
                    setShowNotifications(false);
                  }}
                >
                  <ShieldAlert size={16} color="var(--risk-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      BL-004 · Critical Safety Block
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Venting alarm post-collision. Second-life blocked.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--signal-amber-light)',
                    border: '1px solid #F5E0B2',
                    display: 'flex',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigate('#/batteries/BL-005/import');
                    setShowNotifications(false);
                  }}
                >
                  <Info size={16} color="var(--signal-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      BL-005 · Incomplete Telemetry
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Missing cycler log & warranty maintenance records.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Action Tools */}
        <button
          onClick={onExportAudit}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
          title="Export JSON audit dossier"
        >
          <Download size={13} />
          <span>Export Dossier</span>
        </button>

        <button
          onClick={onResetCase}
          className="btn-secondary"
          style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--text-secondary)' }}
          title="Reset active case to seeded baseline"
        >
          <RotateCcw size={12} />
          <span>Reset Case</span>
        </button>

        <button
          onClick={onResetEntireDemo}
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textDecoration: 'underline',
            padding: '4px',
            cursor: 'pointer',
          }}
          title="Reset all local storage records and seed state"
        >
          Reset All
        </button>
      </div>
    </header>
  );
};
