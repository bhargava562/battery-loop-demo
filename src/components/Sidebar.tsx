import React from 'react';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  FileUp,
  FileCheck2,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { type AppRoute, navigate } from '../app/routes';
import { BatteryLoopBrandMark } from './BatteryLoopBrandMark';

interface SidebarProps {
  currentRoute: AppRoute;
  selectedBatteryId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingReviewCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  selectedBatteryId,
  collapsed,
  onToggleCollapse,
  pendingReviewCount = 0,
}) => {
  const isNavActive = (key: string): boolean => {
    if (key === 'workspace') return currentRoute.type === 'workspace';
    if (key === 'batteries') return currentRoute.type === 'batteries';
    if (key === 'battery-new') return currentRoute.type === 'battery-new';
    if (key === 'imports') return currentRoute.type === 'battery-case' && currentRoute.tab === 'import';
    if (key === 'dossiers') return currentRoute.type === 'dossiers' || (currentRoute.type === 'battery-case' && currentRoute.tab === 'decision');
    if (key === 'history') return currentRoute.type === 'history';
    if (key === 'settings') return currentRoute.type === 'settings';
    return false;
  };

  const navItems = [
    {
      key: 'workspace',
      label: 'Workspace',
      icon: LayoutDashboard,
      path: '#/workspace',
      badge: null,
    },
    {
      key: 'batteries',
      label: 'Battery Cases',
      icon: Layers,
      path: '#/batteries',
      badge: null,
    },
    {
      key: 'battery-new',
      label: 'New Assessment',
      icon: PlusCircle,
      path: '#/batteries/new',
      badge: 'Intake',
    },
    {
      key: 'imports',
      label: 'Evidence Imports',
      icon: FileUp,
      path: `#/batteries/${selectedBatteryId}/import`,
      badge: null,
    },
    {
      key: 'dossiers',
      label: 'Decision Dossiers',
      icon: FileCheck2,
      path: '#/dossiers',
      badge: null,
    },
    {
      key: 'history',
      label: 'Audit History',
      icon: History,
      path: '#/history',
      badge: null,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '#/settings',
      badge: null,
    },
  ];

  return (
    <aside
      style={{
        width: collapsed ? '68px' : '230px',
        minWidth: collapsed ? '68px' : '230px',
        backgroundColor: 'var(--bg-nav, #112A27)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-dark, #1E443F)',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 60,
        userSelect: 'none',
      }}
      aria-label="Application Navigation Sidebar"
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            height: 'var(--header-height, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 18px',
            gap: '12px',
            borderBottom: '1px solid var(--border-dark, #1E443F)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('#/workspace')}
          title="BatteryLoop — Battery Assessment Workspace"
        >
          <BatteryLoopBrandMark size={26} color="#FFFFFF" accentColor="var(--accent-highlight, #D5F36A)" />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}
              >
                BatteryLoop
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#8CAAA4',
                  letterSpacing: '0.01em',
                }}
              >
                Assessment Workspace
              </span>
            </div>
          )}
        </div>

        {/* Navigation Destination Links */}
        <nav style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const active = isNavActive(item.key);
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  padding: collapsed ? '10px 0' : '10px 14px',
                  borderRadius: 'var(--radius-sm, 6px)',
                  background: active ? 'rgba(213, 243, 106, 0.14)' : 'transparent',
                  color: active ? 'var(--accent-highlight, #D5F36A)' : '#B4CCC7',
                  border: active ? '1px solid rgba(213, 243, 106, 0.28)' : '1px solid transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  textAlign: 'left',
                  width: '100%',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={active ? 'var(--accent-highlight, #D5F36A)' : '#8FAEA8'} />
                {!collapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: '#E0EDE9',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {!collapsed && item.key === 'workspace' && pendingReviewCount > 0 && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: 'var(--accent-review-coral, #FF735E)',
                      color: '#FFFFFF',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info & Sidebar Collapse Toggle */}
      <div
        style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--border-dark, #1E443F)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* Active Operator Badge */}
        {!collapsed ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm, 6px)',
              background: 'rgba(0, 0, 0, 0.18)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D5F36A',
                flexShrink: 0,
              }}
            >
              <User size={15} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                T. Lindqvist
              </span>
              <span style={{ fontSize: '10px', color: '#8CAAA4' }}>Refurbish Lead</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '6px 0',
            }}
            title="T. Lindqvist · Refurbish Lead"
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D5F36A',
              }}
            >
              <User size={15} />
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px 0',
            width: '100%',
            color: '#8CAAA4',
            fontSize: '11px',
            fontWeight: 500,
            borderRadius: 'var(--radius-xs, 4px)',
            background: 'transparent',
            transition: 'background 0.15s ease',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse sidebar</span></>}
        </button>
      </div>
    </aside>
  );
};
