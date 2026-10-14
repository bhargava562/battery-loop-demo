import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ArrowRight,
  UploadCloud,
  Check,
} from 'lucide-react';
import type { BatteryCase, EvidenceRecord } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface EvidenceImportScreenProps {
  battery: BatteryCase;
  onImportEvidence: (
    batteryId: string,
    evidence: Record<string, EvidenceRecord>,
    sourceName: string,
    metadataUpdates?: Partial<BatteryCase>
  ) => void;
}

interface ColumnMapping {
  originalCol: string;
  mappedField: string;
  detectedUnit: string;
  sampleValue: string;
  status: 'mapped' | 'unmapped' | 'review';
}

export const EvidenceImportScreen: React.FC<EvidenceImportScreenProps> = ({
  battery,
  onImportEvidence,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
    timestamp: string;
  } | null>({
    name: `cycler_export_${battery.id.toLowerCase()}_station4.csv`,
    size: '42.8 KB',
    type: 'CSV / Bench Telemetry Export',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
  });

  const [activeTab, setActiveTab] = useState<'upload' | 'mapping' | 'preview'>('mapping');

  // Realistic field mapping configuration
  const [mappings, setMappings] = useState<ColumnMapping[]>([
    {
      originalCol: 'pack_soh_est',
      mappedField: 'reported_soh',
      detectedUnit: '%',
      sampleValue: `${battery.reportedSoH}%`,
      status: 'mapped',
    },
    {
      originalCol: 'delta_v_max_mv',
      mappedField: 'max_voltage_deviation',
      detectedUnit: 'mV',
      sampleValue: battery.id === 'BL-003' ? '180 mV' : '22 mV',
      status: battery.id === 'BL-003' ? 'review' : 'mapped',
    },
    {
      originalCol: 'cycle_count_total',
      mappedField: 'lifetime_cycles',
      detectedUnit: 'cycles',
      sampleValue: `${battery.cycleCount}`,
      status: 'mapped',
    },
    {
      originalCol: 'peak_temp_c',
      mappedField: 'max_recorded_temp',
      detectedUnit: '°C',
      sampleValue: '48.2 °C',
      status: 'mapped',
    },
    {
      originalCol: 'oem_service_id',
      mappedField: 'service_record',
      detectedUnit: 'text',
      sampleValue: battery.serviceHistory === 'missing' ? 'NULL / NOT_FOUND' : 'LOG-2025-081',
      status: battery.serviceHistory === 'missing' ? 'review' : 'mapped',
    },
    {
      originalCol: 'aux_heater_draw_a',
      mappedField: 'unmapped',
      detectedUnit: 'A',
      sampleValue: '2.4 A',
      status: 'unmapped',
    },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleRemap = (index: number, newField: string) => {
    setMappings((prev) =>
      prev.map((m, i) => (i === index ? { ...m, mappedField: newField, status: newField === 'unmapped' ? 'unmapped' : 'mapped' } : m))
    );
  };

  const handleConfirmImport = () => {
    const importedEvidence: Record<string, EvidenceRecord> = {
      cycler_bench_data: {
        fieldKey: 'cycler_bench_data',
        label: 'Bench Cycler Verified Discharge',
        value: battery.id === 'BL-003' ? '180 mV Delta on M03' : 'Uniform 22 mV Spread',
        unit: 'mV',
        source: selectedFile ? selectedFile.name : 'Cycler Export Station 4',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'verified',
        weight: 35,
        isContradictory: battery.id === 'BL-003',
      },
      thermal_profile: {
        fieldKey: 'thermal_profile',
        label: 'Lifetime Operating Thermal Profile',
        value: 'Max 48.2°C logged',
        unit: '°C',
        source: 'BMS EEPROM Extract',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'verified',
        weight: 20,
      },
    };

    onImportEvidence(battery.id, importedEvidence, selectedFile?.name || 'Bench Cycler CSV');
    setIsSaved(true);
    setTimeout(() => {
      navigate(`#/batteries/${battery.id}/inspect`);
    }, 800);
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
            <span className="badge badge-teal">EVIDENCE</span>
            <span className="text-caption">Case {battery.id} · {battery.vehicleModel}</span>
          </div>
          <h1>Import evidence</h1>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-surface-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-divider)',
            padding: '3px',
          }}
        >
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              background: activeTab === 'upload' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTab === 'upload' ? 600 : 500,
              fontSize: '13px',
            }}
          >
            1. Source File
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              background: activeTab === 'mapping' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTab === 'mapping' ? 600 : 500,
              fontSize: '13px',
            }}
          >
            2. Field Mapping
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-xs)',
              background: activeTab === 'preview' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTab === 'preview' ? 600 : 500,
              fontSize: '13px',
            }}
          >
            3. Validation Preview
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
        {/* Left Side: Active Tab View */}
        <div className="surface-card" style={{ padding: '20px' }}>
          {activeTab === 'upload' && (
            <div>
              <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Upload diagnostic or cycler export</h2>
              <div
                onClick={() =>
                  setSelectedFile({
                    name: `cycler_export_${battery.id.toLowerCase()}_station4.csv`,
                    size: '42.8 KB',
                    type: 'CSV / Bench Telemetry Export',
                    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  })
                }
                style={{
                  border: '2px dashed var(--border-divider)',
                  borderRadius: 'var(--radius-md)',
                  padding: '36px',
                  textAlign: 'center',
                  background: 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                  marginBottom: '16px',
                }}
              >
                <UploadCloud size={40} color="var(--accent-primary)" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                  Drag & drop CSV, Excel, or JSON export here
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Supports Digatron, Arbin, Bitrode, or OEM CAN Bus extracts
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Need a reference format?
                </span>
                <button
                  onClick={() => navigate('#/settings')}
                  style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600 }}
                >
                  Download template CSV →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mapping' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', margin: 0 }}>Column & unit field mapping</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                    Match detected headers to BatteryLoop standard telemetry fields.
                  </p>
                </div>
                <span className="badge badge-teal">5 of 6 auto-mapped</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-divider)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 10px' }}>Source Header</th>
                    <th style={{ padding: '8px 10px' }}>Sample Value</th>
                    <th style={{ padding: '8px 10px' }}>Mapped Field</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {m.originalCol}
                      </td>
                      <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {m.sampleValue}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <select
                          value={m.mappedField}
                          onChange={(e) => handleRemap(idx, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-divider)',
                            fontSize: '12px',
                          }}
                        >
                          <option value="reported_soh">Reported SoH (%)</option>
                          <option value="max_voltage_deviation">Max Cell Delta (mV)</option>
                          <option value="lifetime_cycles">Lifetime Cycle Count</option>
                          <option value="max_recorded_temp">Max Operating Temp (°C)</option>
                          <option value="service_record">OEM Service History</option>
                          <option value="unmapped">— Ignore / Unmapped —</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {m.status === 'mapped' && (
                          <span className="badge badge-teal">Valid</span>
                        )}
                        {m.status === 'review' && (
                          <span className="badge badge-coral">Check Value</span>
                        )}
                        {m.status === 'unmapped' && (
                          <span className="badge badge-neutral">Ignored</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Import preview & sanity check</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Normalized telemetry will be applied to case <strong>{battery.id}</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Target Case:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{battery.id} · {battery.vehicleModel}</span>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Parsed Rows:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>24 Module Readings · 1 Pack Summary</span>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Plausibility Check:</span>
                  <span style={{ color: battery.id === 'BL-003' ? 'var(--accent-review-coral)' : 'var(--accent-primary)', fontWeight: 600 }}>
                    {battery.id === 'BL-003' ? 'Contradiction flagged (SoH 99% vs 180mV)' : 'Nominal Ranges'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Validation Summary & Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* File Snapshot Card */}
          <div className="surface-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <FileSpreadsheet size={24} color="var(--accent-primary)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedFile?.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {selectedFile?.size} · {selectedFile?.type}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              Importing into: <strong>{battery.id} ({battery.vehicleModel})</strong>
            </div>
          </div>

          {/* Validation Gates Summary */}
          <div className="surface-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Validation Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Accepted fields:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>5 of 6</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fields requiring review:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-review-coral)' }}>
                  {battery.id === 'BL-003' ? '1 (M03 spread)' : '0'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Missing required fields:</span>
                <span style={{ fontWeight: 700, color: 'var(--signal-amber)' }}>
                  {battery.serviceHistory === 'missing' ? '1 (Service log)' : '0'}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '10px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--bg-surface-secondary)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              <strong>Data integrity rule:</strong> Unknown units trigger review rather than automatic conversion. Missing values remain explicitly unknown, never zero.
            </div>

            <button
              onClick={handleConfirmImport}
              className="btn-primary"
              style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>Evidence Saved to Case</span>
                </>
              ) : (
                <>
                  <span>Confirm & Save Evidence</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
