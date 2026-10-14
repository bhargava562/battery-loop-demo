import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  ArrowRight,
  Grid,
  List,
} from 'lucide-react';
import type { BatteryCase, HumanDecisionRecord } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface BatteryLibraryScreenProps {
  batteryCases: Record<string, BatteryCase>;
  humanDecisions: Record<string, HumanDecisionRecord>;
  selectedBatteryId: string;
  onSelectBattery: (id: string) => void;
}

export const BatteryLibraryScreen: React.FC<BatteryLibraryScreenProps> = ({
  batteryCases,
  humanDecisions,
  selectedBatteryId,
  onSelectBattery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chemistryFilter, setChemistryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const allCases = Object.values(batteryCases);

  const filteredCases = allCases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChemistry =
      chemistryFilter === 'ALL' || c.chemistry.toUpperCase().includes(chemistryFilter);

    let matchesStatus = true;
    if (statusFilter === 'CONFLICT') {
      matchesStatus = c.id === 'BL-003';
    } else if (statusFilter === 'CRITICAL') {
      matchesStatus = c.criticalSafetyFlag;
    } else if (statusFilter === 'INCOMPLETE') {
      matchesStatus = c.evidenceCompleteness !== 'complete' && c.id !== 'BL-003';
    } else if (statusFilter === 'DECIDED') {
      matchesStatus = !!humanDecisions[c.id];
    }

    return matchesSearch && matchesChemistry && matchesStatus;
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 32px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Screen Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-teal">CASES</span>
            <span className="text-caption">Triage Directory</span>
          </div>
          <h1>Battery case library</h1>
        </div>

        <button
          onClick={() => navigate('#/batteries/new')}
          className="btn-primary"
          style={{ padding: '10px 18px' }}
        >
          <PlusCircle size={16} />
          <span>Create assessment</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
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
        {/* Left: Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px', maxWidth: '400px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search by ID, model, or pack name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search cases"
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface-secondary)',
                fontSize: '13px',
              }}
            />
          </div>
        </div>

        {/* Right: Filters & Density Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Chemistry:</span>
            <select
              value={chemistryFilter}
              onChange={(e) => setChemistryFilter(e.target.value)}
              aria-label="Filter by Chemistry"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
              }}
            >
              <option value="ALL">All Chemistries</option>
              <option value="NMC">NMC</option>
              <option value="LFP">LFP</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Status"
              style={{
                padding: '5px 8px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-divider)',
                background: 'var(--bg-surface)',
                fontSize: '12px',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFLICT">Evidence Conflict</option>
              <option value="CRITICAL">Critical Safety Flag</option>
              <option value="INCOMPLETE">Incomplete Evidence</option>
              <option value="DECIDED">Decision Recorded</option>
            </select>
          </div>

          {/* Density Switch */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-surface-secondary)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-divider)',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setDensity('comfortable')}
              title="Comfortable row density"
              style={{
                padding: '4px 6px',
                borderRadius: '3px',
                background: density === 'comfortable' ? '#FFFFFF' : 'transparent',
                color: density === 'comfortable' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setDensity('compact')}
              title="Compact row density"
              style={{
                padding: '4px 6px',
                borderRadius: '3px',
                background: density === 'compact' ? '#FFFFFF' : 'transparent',
                color: density === 'compact' ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <Grid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="surface-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr
              style={{
                background: 'var(--bg-surface-secondary)',
                borderBottom: '1px solid var(--border-divider)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              <th style={{ padding: '10px 16px' }}>Battery ID</th>
              <th style={{ padding: '10px 16px' }}>Vehicle / Application</th>
              <th style={{ padding: '10px 16px' }}>Chemistry & Specs</th>
              <th style={{ padding: '10px 16px' }}>Reported SoH</th>
              <th style={{ padding: '10px 16px' }}>Evidence Status</th>
              <th style={{ padding: '10px 16px' }}>Triage Pathway</th>
              <th style={{ padding: '10px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => {
              const isSelected = c.id === selectedBatteryId;
              const isBL003 = c.id === 'BL-003';
              const decision = humanDecisions[c.id];

              let badgeClass = 'badge-teal';
              let statusText = 'Complete evidence';
              if (isBL003) {
                badgeClass = 'badge-coral';
                statusText = 'Evidence conflict';
              } else if (c.criticalSafetyFlag) {
                badgeClass = 'badge-red';
                statusText = 'Critical safety flag';
              } else if (c.evidenceCompleteness !== 'complete') {
                badgeClass = 'badge-amber';
                statusText = 'Evidence incomplete';
              }

              const rowPadding = density === 'comfortable' ? '14px 16px' : '8px 16px';

              return (
                <tr
                  key={c.id}
                  onClick={() => {
                    onSelectBattery(c.id);
                    navigate(`#/batteries/${c.id}/inspect`);
                  }}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: isSelected
                      ? 'rgba(213, 243, 106, 0.12)'
                      : isBL003
                      ? '#FFFBFA'
                      : '#FFFFFF',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = isBL003 ? '#FFFBFA' : '#FFFFFF';
                    }
                  }}
                >
                  <td style={{ padding: rowPadding }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '13px',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                        }}
                      >
                        {c.id}
                      </span>
                      {isBL003 && <span className="badge badge-lime" style={{ fontSize: '10px' }}>DEMO</span>}
                    </div>
                  </td>

                  <td style={{ padding: rowPadding }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {c.vehicleModel}
                    </div>
                    {density === 'comfortable' && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.name}</div>
                    )}
                  </td>

                  <td style={{ padding: rowPadding }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{c.chemistry}</div>
                    {density === 'comfortable' && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {c.nominalCapacityKwh} kWh · {c.nominalVoltageV}V
                      </div>
                    )}
                  </td>

                  <td style={{ padding: rowPadding }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: isBL003 ? 'var(--accent-review-coral)' : 'var(--text-primary)',
                        }}
                      >
                        {c.reportedSoH}%
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>BMS</span>
                    </div>
                  </td>

                  <td style={{ padding: rowPadding }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className={`badge ${badgeClass}`}>{statusText}</span>
                      {decision && (
                        <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                          Decision: {decision.pathwayTitle}
                        </span>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: rowPadding }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {c.initialRecommendationHint || 'Screening pending'}
                    </div>
                  </td>

                  <td style={{ padding: rowPadding, textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBattery(c.id);
                        navigate(`#/batteries/${c.id}/inspect`);
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      <span>Open Workspace</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCases.length === 0 && (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: '4px' }}>No matching cases found</p>
            <p style={{ fontSize: '13px' }}>Try adjusting your search query or chemistry/status filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
