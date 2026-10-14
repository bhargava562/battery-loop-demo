import React from 'react';
import {
  Layers,
  FileSpreadsheet,
  Cpu,
  Edit3,
  Sliders,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import type {
  Assessment,
  BatteryCase,
  HumanDecisionRecord,
  ModuleData,
  ReasoningFlag,
  ReviewRecord,
} from '../features/assessment/assessment.types';
import { type CaseTab, navigate } from '../app/routes';
import { BatteryScene } from '../features/battery3d/BatteryScene';
import { EvidenceImportScreen } from './EvidenceImportScreen';
import { Stage03Assess } from '../features/assessment/Stage03Assess';
import { Stage04Review } from '../features/review/Stage04Review';
import { Stage05Simulate } from '../features/simulator/Stage05Simulate';
import { Stage06Decide } from '../features/decision/Stage06Decide';

interface BatteryCaseWorkspaceScreenProps {
  battery: BatteryCase;
  activeTab: CaseTab;
  selectedModuleId: string | null;
  explode3DView: boolean;
  baseAssessment: Assessment;
  simulatedAssessment: Assessment;
  simulatedInputs: Record<string, any> | null;
  existingDecision?: HumanDecisionRecord;
  reviewRecords: ReviewRecord[];
  reasoningFlags: ReasoningFlag[];
  auditTimeline: any[];
  onSelectModule: (id: string) => void;
  onToggleExplode: () => void;
  onImportEvidence: (
    batteryId: string,
    evidence: any,
    sourceName: string,
    metadata?: any
  ) => void;
  onSaveCorrection: (
    fieldKey: string,
    fieldLabel: string,
    correctedVal: any,
    correctedStat: any,
    reason: string,
    note: string
  ) => void;
  onFlagReasoning: (
    ruleId: string,
    ruleTitle: string,
    concern: string,
    reviewer: string
  ) => void;
  onUpdateSimulation: (key: string, value: any) => void;
  onResetSimulation: () => void;
  onApplySimulationToReview: () => void;
  onRecordDecision: (record: HumanDecisionRecord) => void;
  onExportAudit: () => void;
  onResetCase: () => void;
}

export const BatteryCaseWorkspaceScreen: React.FC<BatteryCaseWorkspaceScreenProps> = ({
  battery,
  activeTab,
  selectedModuleId,
  explode3DView,
  baseAssessment,
  simulatedAssessment,
  simulatedInputs,
  existingDecision,
  reviewRecords,
  reasoningFlags,
  auditTimeline,
  onSelectModule,
  onToggleExplode,
  onImportEvidence,
  onSaveCorrection,
  onFlagReasoning,
  onUpdateSimulation,
  onResetSimulation,
  onApplySimulationToReview,
  onRecordDecision,
  onExportAudit,
  onResetCase,
}) => {
  const selectedModule: ModuleData | undefined = battery.modules.find(
    (m) => m.moduleId === selectedModuleId
  );

  const tabs: Array<{ id: CaseTab; label: string; icon: any }> = [
    { id: 'inspect', label: '3D Inspect', icon: Layers },
    { id: 'import', label: 'Evidence', icon: FileSpreadsheet },
    { id: 'assessment', label: 'Assessment', icon: Cpu },
    { id: 'review', label: 'Review', icon: Edit3 },
    { id: 'simulate', label: 'Simulate', icon: Sliders },
    { id: 'decision', label: 'Decision', icon: FileCheck2 },
  ];

  const handleTabChange = (newTab: CaseTab) => {
    navigate(`#/batteries/${battery.id}/${newTab}`);
  };

  const isBL003 = battery.id === 'BL-003';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--bg-canvas, #F5F7F3)',
      }}
    >
      {/* Sleek Horizontal Case Header & Contextual Subtab Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-divider)',
          padding: '12px 32px 0 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Identity & Technical Specs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '18px',
                color: 'var(--text-primary)',
              }}
            >
              {battery.id}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {battery.vehicleModel}
            </span>

            <span
              className={
                isBL003
                  ? 'badge badge-coral'
                  : battery.criticalSafetyFlag
                  ? 'badge badge-red'
                  : battery.evidenceCompleteness === 'complete'
                  ? 'badge badge-teal'
                  : 'badge badge-amber'
              }
            >
              {isBL003
                ? 'Conflict'
                : battery.criticalSafetyFlag
                ? 'Critical Flag'
                : battery.evidenceCompleteness === 'complete'
                ? 'Complete Data'
                : 'Incomplete'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{battery.chemistry}</span>
              <span>·</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{battery.nominalCapacityKwh} kWh / {battery.nominalVoltageV}V</span>
              <span>·</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{battery.cycleCount} cycles</span>
            </div>
          </div>

          {/* Quick CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleTabChange('decision')}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <span>Record Decision</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Thin Horizontal Contextual Navigation */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} color={active ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Screen Area */}
      <div style={{ flex: 1, padding: activeTab === 'inspect' ? '16px 24px' : '20px 32px' }}>
        {activeTab === 'inspect' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 340px',
              gap: '16px',
              height: 'calc(100vh - var(--header-height) - 100px)',
              minHeight: '560px',
            }}
          >
            {/* 70% Left Zone: Immersive 3D Battery Canvas */}
            <div
              style={{
                background: 'var(--bg-3d-canvas, #0B211F)',
                borderRadius: 'var(--radius-lg, 14px)',
                border: '1px solid var(--border-dark, #1A4641)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Floating Top HUD inside 3D Canvas */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {/* Module Target Pill */}
                <div
                  style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(11, 33, 31, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: '#FFFFFF',
                  }}
                >
                  <span style={{ color: '#869792' }}>Module:</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: selectedModuleId === 'M03' ? 'var(--accent-review-coral)' : 'var(--accent-highlight)',
                    }}
                  >
                    {selectedModuleId || 'M01'}
                  </span>
                  {selectedModuleId === 'M03' && (
                    <span className="badge badge-coral" style={{ fontSize: '10px', padding: '1px 5px' }}>
                      180 mV Delta
                    </span>
                  )}
                </div>

                {/* Floating View Controls */}
                <div
                  style={{
                    pointerEvents: 'auto',
                    display: 'flex',
                    gap: '6px',
                    background: 'rgba(11, 33, 31, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '3px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <button
                    onClick={onToggleExplode}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-xs)',
                      background: explode3DView ? 'var(--accent-highlight)' : 'transparent',
                      color: explode3DView ? 'var(--accent-highlight-text)' : '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {explode3DView ? 'Assemble Pack' : 'Explode View'}
                  </button>
                </div>
              </div>

              {/* Procedural 3D Canvas */}
              <div style={{ flex: 1, position: 'relative' }}>
                <BatteryScene
                  battery={battery}
                  selectedModuleId={selectedModuleId}
                  isExploded={explode3DView}
                  onToggleExplode={onToggleExplode}
                  onSelectModule={onSelectModule}
                />
              </div>

              {/* Floating Bottom Legend HUD */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#869792',
                  pointerEvents: 'none',
                }}
              >
                <span>Click any module mesh to inspect · Left-drag to orbit · Scroll to zoom</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-highlight)' }} />
                    <span style={{ color: '#EAF0EA' }}>Selected</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-review-coral)' }} />
                    <span style={{ color: '#EAF0EA' }}>Anomaly (M03)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 30% Right Zone: Docked Telemetry & Issue Inspector */}
            <div
              className="surface-card"
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg, 14px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Selected Telemetry
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Module {selectedModuleId || 'M01'}
                    </div>
                  </div>
                  <span
                    className={
                      selectedModule?.status === 'nominal' ? 'badge badge-teal' : 'badge badge-coral'
                    }
                  >
                    {selectedModule?.status || 'nominal'}
                  </span>
                </div>

                {/* Instrumentation Metrics */}
                {selectedModule && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-soft)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Voltage Spread</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: selectedModule.voltageDeviationMv > 50 ? 'var(--accent-review-coral)' : 'var(--text-primary)',
                        }}
                      >
                        {selectedModule.voltageDeviationMv} mV
                      </span>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-soft)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Thermal Delta</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600 }}>
                        {selectedModule.tempVarianceC} °C
                      </span>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface-soft)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AC Impedance</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 600 }}>
                        {Number(selectedModule.internalResistanceMohm).toFixed(2)} mΩ
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick 24-Module Selector Grid */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
                    Module Select
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '4px',
                    }}
                  >
                    {battery.modules.map((m) => {
                      const isTarget = m.moduleId === selectedModuleId;
                      const isFlagged = m.moduleId === 'M03';

                      return (
                        <button
                          key={m.moduleId}
                          onClick={() => onSelectModule(m.moduleId)}
                          style={{
                            padding: '6px 0',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-xs)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: isTarget ? 700 : 500,
                            background: isTarget
                              ? 'var(--accent-highlight)'
                              : isFlagged
                              ? 'var(--accent-review-light)'
                              : 'var(--bg-surface-soft)',
                            color: isTarget
                              ? 'var(--accent-highlight-text)'
                              : isFlagged
                              ? 'var(--accent-review-coral)'
                              : 'var(--text-secondary)',
                            border: isTarget
                              ? '1px solid var(--accent-highlight)'
                              : isFlagged
                              ? '1px solid #FFD3CC'
                              : '1px solid transparent',
                            cursor: 'pointer',
                          }}
                        >
                          {m.moduleId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => handleTabChange('assessment')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  <span>Assess available evidence</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <EvidenceImportScreen
            battery={battery}
            onImportEvidence={onImportEvidence}
          />
        )}

        {activeTab === 'assessment' && (
          <Stage03Assess
            battery={battery}
            assessment={baseAssessment}
            onBack={() => handleTabChange('inspect')}
            onProceed={() => handleTabChange('review')}
          />
        )}

        {activeTab === 'review' && (
          <Stage04Review
            battery={battery}
            assessment={baseAssessment}
            reviewRecords={reviewRecords.filter((r) => r.batteryId === battery.id)}
            reasoningFlags={reasoningFlags.filter((f) => f.batteryId === battery.id)}
            onSaveCorrection={onSaveCorrection}
            onFlagReasoning={onFlagReasoning}
            onBack={() => handleTabChange('assessment')}
            onProceed={() => handleTabChange('simulate')}
          />
        )}

        {activeTab === 'simulate' && (
          <Stage05Simulate
            battery={battery}
            selectedModuleId={selectedModuleId}
            baseAssessment={baseAssessment}
            simulatedAssessment={simulatedAssessment}
            simulatedInputs={simulatedInputs}
            onUpdateSimulation={onUpdateSimulation}
            onResetSimulation={onResetSimulation}
            onApplySimulationToReview={onApplySimulationToReview}
            onBack={() => handleTabChange('review')}
            onProceed={() => handleTabChange('decision')}
          />
        )}

        {activeTab === 'decision' && (
          <Stage06Decide
            battery={battery}
            assessment={baseAssessment}
            auditLog={auditTimeline}
            existingDecision={existingDecision}
            onRecordDecision={onRecordDecision}
            onExportAudit={onExportAudit}
            onResetCase={onResetCase}
            onBack={() => handleTabChange('simulate')}
          />
        )}
      </div>
    </div>
  );
};
