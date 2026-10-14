import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  ShieldAlert,
  Info,
  Check,
  FileSpreadsheet,
  FileCode,
  Database,
} from 'lucide-react';
import { DEMO_THRESHOLDS } from '../features/assessment/demoRules';

interface SettingsScreenProps {
  onResetEntireDemo: () => void;
  reviewRecordsCount: number;
  auditEventsCount: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onResetEntireDemo,
  reviewRecordsCount,
  auditEventsCount,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    const csvContent =
      'pack_id,reported_soh,max_voltage_deviation_mv,cycle_count,peak_temp_c,service_log_id\n' +
      'BL-EXAMPLE,88,24,350,42.1,OEM-LOG-4491\n' +
      'M01_VOLTAGE,M02_VOLTAGE,M03_VOLTAGE,M04_VOLTAGE,M05_VOLTAGE\n' +
      '3.650,3.648,3.470,3.652,3.649\n';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batteryloop_cycler_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('CSV template downloaded.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadJSON = () => {
    const schemaContent = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: 'BatteryLoop Evidence Import Schema',
      type: 'object',
      properties: {
        batteryId: { type: 'string', pattern: '^BL-[0-9]{3}$' },
        reportedSoH: { type: 'number', minimum: 0, maximum: 100 },
        maxVoltageDeviationMv: { type: 'number', minimum: 0, maximum: 1000 },
        cycleCount: { type: 'integer', minimum: 0 },
        modules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              moduleId: { type: 'string' },
              voltageDeviationMv: { type: 'number' },
              status: { enum: ['nominal', 'flagged', 'critical'] },
            },
          },
        },
      },
    };

    const blob = new Blob([JSON.stringify(schemaContent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batteryloop_evidence_schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('JSON schema downloaded.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-teal">SYSTEM CONFIGURATION</span>
          <span className="text-caption">Facility Reference & Rules</span>
        </div>
        <h1 style={{ marginBottom: '4px' }}>Settings & Evidence Templates</h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
          Manage import templates, inspect read-only demo screening rules, and view local storage diagnostics.
        </p>
      </div>

      {downloadSuccess && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary-light)',
            color: 'var(--accent-primary)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Section 1: Evidence Import Templates */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '4px' }}>Evidence import templates</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Download standard intake formats for field technicians or automated cycler station exports.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-divider)',
              background: 'var(--bg-surface-secondary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <FileSpreadsheet size={22} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Standard Cycler CSV Template
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Includes 24-module voltage channels, pack capacity, and timestamp headers.
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-start' }}
            >
              <Download size={13} />
              <span>Download CSV Template</span>
            </button>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-divider)',
              background: 'var(--bg-surface-secondary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <FileCode size={22} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Telemetry JSON Schema
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Standard schema for automated REST/file ingest integrations.
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadJSON}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-start' }}
            >
              <Download size={13} />
              <span>Download JSON Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Read-Only Rule Engine Config */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '16px', margin: 0 }}>Screening rules & illustrative thresholds</h2>
          <span className="badge badge-teal">Transparent Deterministic Engine</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          These thresholds are illustrative screening parameters configured for this demonstration workspace.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Nominal Cell Delta</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              ≤ {DEMO_THRESHOLDS.NOMINAL_VOLTAGE_DEVIATION_MV} mV
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Uniform cell spread gate</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Severe Cell Delta</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, color: 'var(--accent-review-coral)', marginTop: '2px' }}>
              ≥ {DEMO_THRESHOLDS.SEVERE_VOLTAGE_DEVIATION_MV} mV
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Triggers contradiction rule</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High Reported SoH</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              ≥ {DEMO_THRESHOLDS.HIGH_REPORTED_SOH_PERCENT}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>BMS claim threshold</div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-secondary)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Second-Life Min SoH</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 700, marginTop: '2px' }}>
              ≥ {DEMO_THRESHOLDS.MIN_SECOND_LIFE_SOH_PERCENT}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Commercial viability floor</div>
          </div>
        </div>
      </div>

      {/* Section 3: Local Storage Diagnostics & Reset */}
      <div className="surface-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '4px' }}>Local workspace data storage</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          All modifications, technician corrections, and recorded decisions persist in your browser's local storage.
        </p>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{reviewRecordsCount}</strong> reviewer overrides recorded
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>{auditEventsCount}</strong> audit events in timeline
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowResetModal(true)}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #FFD3CC',
            background: 'var(--accent-review-light)',
            color: 'var(--accent-review-coral)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          <span>Reset All Demo Data to Baseline</span>
        </button>
      </div>

      {/* Section 4: Boundary & Prototype Limitations Notice */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-divider)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          <Info size={15} color="var(--accent-primary)" />
          <span>Prototype Scope & Safety Notice</span>
        </div>
        BatteryLoop Decision Theatre is an engineering assessment prototype. It does not connect to external AI services or make safety certifications. All baseline records are simulated cases. Physical high-voltage safety qualification and certified cycler validation remain mandatory before any real-world battery reuse or stationary deployment.
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="surface-card"
            style={{
              width: '420px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-review-coral)', marginBottom: '10px' }}>
              <ShieldAlert size={24} />
              <h3 style={{ fontSize: '17px', margin: 0, color: 'var(--text-primary)' }}>Reset entire workspace?</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.4 }}>
              This will erase all custom registered cases, technician overrides, what-if parameters, and signed-off decisions, restoring the five standard demo benchmark cases.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowResetModal(false)}
                className="btn-secondary"
                style={{ padding: '8px 14px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetEntireDemo();
                  setShowResetModal(false);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-review-coral)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Yes, reset to baseline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
