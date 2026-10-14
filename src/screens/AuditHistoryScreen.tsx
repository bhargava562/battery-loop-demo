import React, { useState } from 'react';
import {
  History,
  ArrowRight,
} from 'lucide-react';
import type { AuditEvent } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface AuditHistoryScreenProps {
  auditLog: AuditEvent[];
  onSelectBattery: (id: string) => void;
}

export const AuditHistoryScreen: React.FC<AuditHistoryScreenProps> = ({
  auditLog,
  onSelectBattery,
}) => {
  const [selectedBatteryFilter, setSelectedBatteryFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  const filteredLog = auditLog.filter((evt) => {
    const matchesBattery =
      selectedBatteryFilter === 'ALL' || evt.batteryId === selectedBatteryFilter;
    const matchesType =
      selectedTypeFilter === 'ALL' || evt.type === selectedTypeFilter;
    return matchesBattery && matchesType;
  });

  const getEventBadge = (type: AuditEvent['type']) => {
    switch (type) {
      case 'DECISION_RECORDED':
        return <span className="badge badge-teal">HUMAN DECISION</span>;
      case 'CORRECTION_RECORDED':
        return <span className="badge badge-coral">EVIDENCE OVERRIDE</span>;
      case 'REASONING_FLAGGED':
        return <span className="badge badge-amber">REASONING OBJECTION</span>;
      case 'SIMULATION_APPLIED':
        return <span className="badge badge-lime">SIMULATION APPLIED</span>;
      case 'EVIDENCE_IMPORTED':
        return <span className="badge badge-teal">EVIDENCE IMPORT</span>;
      case 'CASE_REGISTERED':
        return <span className="badge badge-teal">REGISTRATION</span>;
      case 'CASE_RESET':
        return <span className="badge badge-neutral">CASE RESET</span>;
      default:
        return <span className="badge badge-neutral">{type}</span>;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-teal">AUDIT</span>
            <span className="text-caption">Traceability Log</span>
          </div>
          <h1>Assessment history</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="surface-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Filter by Case:</span>
            <select
              value={selectedBatteryFilter}
              onChange={(e) => setSelectedBatteryFilter(e.target.value)}
              aria-label="Filter by Battery Case"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <option value="ALL">All Battery Cases</option>
              <option value="BL-001">BL-001</option>
              <option value="BL-002">BL-002</option>
              <option value="BL-003">BL-003 (Demo Benchmark)</option>
              <option value="BL-004">BL-004</option>
              <option value="BL-005">BL-005</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Event Type:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              aria-label="Filter by Event Type"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
              }}
            >
              <option value="ALL">All Event Types</option>
              <option value="DECISION_RECORDED">Human Decisions</option>
              <option value="CORRECTION_RECORDED">Evidence Overrides</option>
              <option value="REASONING_FLAGGED">Reasoning Objections</option>
              <option value="SIMULATION_APPLIED">Applied Simulations</option>
              <option value="EVIDENCE_IMPORTED">Evidence Imports</option>
              <option value="CASE_REGISTERED">Registrations</option>
            </select>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing {filteredLog.length} recorded events
        </span>
      </div>

      {/* Timeline List */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredLog.map((evt, idx) => (
            <div
              key={evt.id || idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
              }}
            >
              {/* Event Type Badge */}
              <div style={{ minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {getEventBadge(evt.type)}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {evt.timestamp.replace('T', ' ').slice(0, 16)}
                </span>
              </div>

              {/* Event Detail */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      onSelectBattery(evt.batteryId);
                      navigate(`#/batteries/${evt.batteryId}/inspect`);
                    }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {evt.batteryId}
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    by {evt.author || 'Lead Reviewer'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {evt.summary}
                </div>

                {evt.details && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-surface-secondary)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(evt.details, null, 2)}
                  </div>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  onSelectBattery(evt.batteryId);
                  navigate(`#/batteries/${evt.batteryId}/inspect`);
                }}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
              >
                <span>View Case</span>
                <ArrowRight size={11} />
              </button>
            </div>
          ))}

          {filteredLog.length === 0 && (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <History size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <p style={{ fontWeight: 600 }}>No audit events found</p>
              <p style={{ fontSize: '12px' }}>Adjust filters to inspect full event log.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
