import React, { useState } from 'react';
import { ArrowRight, BatteryCharging, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import type { BatteryCase, ModuleData } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface NewBatteryAssessmentScreenProps {
  existingCount: number;
  onRegisterBattery: (battery: BatteryCase) => void;
}

export const NewBatteryAssessmentScreen: React.FC<NewBatteryAssessmentScreenProps> = ({
  existingCount,
  onRegisterBattery,
}) => {
  const generatedId = `BL-${String(existingCount + 1).padStart(3, '0')}`;

  const [id, setId] = useState(generatedId);
  const [name, setName] = useState('Second-Life Return Pack');
  const [vehicleModel, setVehicleModel] = useState('Urban Delivery Van');
  const [serialNumber, setSerialNumber] = useState('SN-4491-X');
  const [chemistry, setChemistry] = useState('NMC 811');
  const [nominalCapacityKwh, setNominalCapacityKwh] = useState(64);
  const [nominalVoltageV, setNominalVoltageV] = useState(380);
  const [reportedSoH, setReportedSoH] = useState(88);
  const [cycleCount, setCycleCount] = useState(420);
  const [ageYears, setAgeYears] = useState(3.0);

  // Section B: Context
  const [batteryState, setBatteryState] = useState<'removed' | 'installed' | 'module-level' | 'unknown'>('removed');
  const [intendedApp, setIntendedApp] = useState<'stationary-storage' | 'continue-use' | 'repair' | 'recycling' | 'undetermined'>('stationary-storage');
  const [technicianName, setTechnicianName] = useState('Bench Technician');
  const [intakeNotes, setIntakeNotes] = useState('Pack decommissioned from commercial fleet after lease maturity. Casing visually intact with zero signs of swelling.');

  // Section C: Source
  const [intakeSourceType, setIntakeSourceType] = useState<'cycler' | 'diagnostic' | 'manual'>('cycler');

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !vehicleModel.trim()) {
      setErrorMsg('Please provide a valid BatteryLoop ID and Vehicle/Application model.');
      return;
    }

    // Generate 24 standard simulated modules for the pack
    const modules: ModuleData[] = Array.from({ length: 24 }, (_, i) => {
      const num = i + 1;
      const modId = `M${num < 10 ? '0' + num : num}`;
      return {
        moduleId: modId,
        label: `Module ${modId}`,
        voltageDeviationMv: 18 + (i % 8),
        tempVarianceC: 1.2,
        internalResistanceMohm: 1.28,
        status: 'nominal',
      };
    });

    const newCase: BatteryCase = {
      id: id.trim(),
      name: name.trim(),
      vehicleModel: vehicleModel.trim(),
      chemistry,
      nominalCapacityKwh: Number(nominalCapacityKwh) || 60,
      nominalVoltageV: Number(nominalVoltageV) || 400,
      reportedSoH: Number(reportedSoH) || 85,
      cycleCount: Number(cycleCount) || 400,
      ageYears: Number(ageYears) || 2.5,
      evidenceCompleteness: 'partial',
      criticalSafetyFlag: false,
      serviceHistory: 'partial',
      modules,
      evidence: {
        intake_registration: {
          fieldKey: 'intake_registration',
          label: 'Physical Pack Intake Record',
          value: `Intake as ${batteryState} pack · Serial ${serialNumber}`,
          source: `Manual Entry by ${technicianName}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'verified',
          weight: 20,
        },
        bms_reported_soh: {
          fieldKey: 'bms_reported_soh',
          label: 'Reported State of Health (BMS)',
          value: `${reportedSoH}% (Self-Reported)`,
          source: 'Intake Inspection Sheet',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'partial',
          weight: 20,
        },
      },
      summary: `${vehicleModel} intake registered for ${intendedApp} evaluation. ${intakeNotes}`,
      initialRecommendationHint: 'Pending cycler & service history evidence intake',
    };

    onRegisterBattery(newCase);
    navigate(`#/batteries/${newCase.id}/import`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 32px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-teal">INTAKE</span>
          <span className="text-caption">Pack Registration</span>
        </div>
        <h1>New battery assessment</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--risk-red-light)',
              color: 'var(--risk-red)',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Section A: Physical Identity */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              A
            </span>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Battery identity & specifications</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                BatteryLoop Case ID *
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: 'var(--bg-surface-secondary)',
                }}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-assigned unique tracking code</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Manufacturer / Vehicle Model *
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Renault Zoe ZE50, Tesla Model 3"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Manufacturer Serial / Barcode
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Pack barcode or OEM serial"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Cell Chemistry
              </label>
              <select
                value={chemistry}
                onChange={(e) => setChemistry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
              >
                <option value="NMC 811">NMC 811 (Nickel-Manganese-Cobalt)</option>
                <option value="NMC 622">NMC 622 (Standard EV)</option>
                <option value="LFP">LFP (Lithium Iron Phosphate)</option>
                <option value="NCA">NCA (Nickel-Cobalt-Aluminum)</option>
                <option value="Other / Unknown">Other / Unknown Chemistry</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Nominal Capacity (kWh)
              </label>
              <input
                type="number"
                value={nominalCapacityKwh}
                onChange={(e) => setNominalCapacityKwh(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Nominal Pack Voltage (V)
              </label>
              <input
                type="number"
                value={nominalVoltageV}
                onChange={(e) => setNominalVoltageV(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Dossier Nickname / Batch Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Prior Cycle Count
              </label>
              <input
                type="number"
                value={cycleCount}
                onChange={(e) => setCycleCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Service Age (Years)
              </label>
              <input
                type="number"
                step="0.1"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section B: Assessment Context */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              B
            </span>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Assessment context & physical state</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Physical Battery State
              </label>
              <select
                value={batteryState}
                onChange={(e) => setBatteryState(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
              >
                <option value="removed">Removed pack on assessment bench</option>
                <option value="installed">Installed in donor vehicle</option>
                <option value="module-level">Module-level sub-pack</option>
                <option value="unknown">Undetermined / In Transit</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Target Second-Life Pathway
              </label>
              <select
                value={intendedApp}
                onChange={(e) => setIntendedApp(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
              >
                <option value="stationary-storage">Stationary Storage (BESS Evaluation)</option>
                <option value="continue-use">Continue Mobile / Fleet Use</option>
                <option value="repair">Module Repair / Reconditioning</option>
                <option value="recycling">Recycling & Material Recovery</option>
                <option value="undetermined">Undetermined Screening</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Assessing Technician / Facility
              </label>
              <input
                type="text"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Reported Intake SoH (%)
              </label>
              <input
                type="number"
                value={reportedSoH}
                onChange={(e) => setReportedSoH(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Self-reported estimate from BMS</span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                Intake Condition Notes
              </label>
              <textarea
                value={intakeNotes}
                onChange={(e) => setIntakeNotes(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-divider)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section C: Source & Next Intake Step */}
        <div className="surface-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              C
            </span>
            <h2 style={{ fontSize: '16px', margin: 0 }}>Planned evidence intake source</h2>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Select how telemetry and diagnostic records will be supplied for this battery:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div
              onClick={() => setIntakeSourceType('cycler')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: intakeSourceType === 'cycler' ? '2px solid var(--accent-primary)' : '1px solid var(--border-divider)',
                background: intakeSourceType === 'cycler' ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
            >
              <FileSpreadsheet size={20} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '13px' }}>CSV / Excel Cycler Export</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Load bench test discharge logs with field-mapping
              </div>
            </div>

            <div
              onClick={() => setIntakeSourceType('diagnostic')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: intakeSourceType === 'diagnostic' ? '2px solid var(--accent-primary)' : '1px solid var(--border-divider)',
                background: intakeSourceType === 'diagnostic' ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
            >
              <BatteryCharging size={20} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Diagnostic Scan Attachment</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Attach PDF or image scan with manual verification
              </div>
            </div>

            <div
              onClick={() => setIntakeSourceType('manual')}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: intakeSourceType === 'manual' ? '2px solid var(--accent-primary)' : '1px solid var(--border-divider)',
                background: intakeSourceType === 'manual' ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
              }}
            >
              <ShieldAlert size={20} color="var(--accent-primary)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Direct Manual Entry</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Transcribe verified nameplate values
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('#/batteries')}
            className="btn-secondary"
            style={{ padding: '10px 18px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 24px' }}
          >
            <span>Proceed to evidence intake</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
