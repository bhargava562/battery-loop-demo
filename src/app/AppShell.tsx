import React from 'react';
import { useBatteryLoopStore } from '../state/useBatteryLoopStore';
import { Header } from '../components/Header';
import { StageStepper } from '../components/StageStepper';
import { LoopGuide } from '../components/LoopGuide';
import { Stage01Select } from '../features/workspace/Stage01Select';
import { Stage02Inspect } from '../features/evidence/Stage02Inspect';
import { Stage03Assess } from '../features/assessment/Stage03Assess';
import { Stage04Review } from '../features/review/Stage04Review';
import { Stage05Simulate } from '../features/simulator/Stage05Simulate';
import { Stage06Decide } from '../features/decision/Stage06Decide';

export const AppShell: React.FC = () => {
  const {
    currentStage,
    selectedBatteryId,
    selectedModuleId,
    explode3DView,
    loopSpeechDismissed,
    batteryCases,
    reviewRecords,
    reasoningFlags,
    simulatedInputs,
    humanDecisions,
    auditLog,
    setStage,
    selectBattery,
    selectModule,
    toggleExplodeView,
    recordEvidenceCorrection,
    flagReasoning,
    updateSimulationInput,
    resetSimulation,
    applySimulationToReview,
    recordHumanDecision,
    resetCaseToSeed,
    resetEntireDemo,
    dismissLoopSpeech,
    restoreLoopSpeech,
    getEffectiveBattery,
    getAssessment,
    getSimulatedAssessment,
  } = useBatteryLoopStore();

  const battery = getEffectiveBattery(selectedBatteryId);
  const baseAssessment = getAssessment(selectedBatteryId);
  const simulatedAssessment = getSimulatedAssessment(selectedBatteryId);
  const existingDecision = humanDecisions[selectedBatteryId];

  const allBatteries = Object.values(batteryCases);

  const handleExportDossier = () => {
    const exportData = {
      title: 'BatteryLoop Decision Theatre — Triage Audit Dossier',
      exportedAt: new Date().toISOString(),
      packId: battery.id,
      vehicleModel: battery.vehicleModel,
      chemistry: battery.chemistry,
      reportedSoH: battery.reportedSoH,
      evidenceCoverage: baseAssessment.evidenceCoverage,
      ruleSuggestion: baseAssessment.pathwayTitle,
      ruleIds: baseAssessment.ruleIds,
      humanDecision: existingDecision || 'Pending Sign-off',
      reviewedEvidence: battery.evidence,
      reviewRecords: reviewRecords.filter((r) => r.batteryId === selectedBatteryId),
      reasoningFlags: reasoningFlags.filter((f) => f.batteryId === selectedBatteryId),
      auditTimeline: auditLog.filter((a) => a.batteryId === selectedBatteryId),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BatteryLoop_Dossier_${battery.id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-warm-paper)',
      color: 'var(--text-forest-graphite)',
    }}>
      {/* Top Application Header */}
      <Header
        battery={battery}
        allBatteries={allBatteries}
        onSelectBattery={selectBattery}
        onResetCase={() => resetCaseToSeed(selectedBatteryId)}
        onResetEntireDemo={resetEntireDemo}
        onExportAudit={handleExportDossier}
      />

      {/* 6-Stage Workflow Stepper */}
      <StageStepper
        currentStage={currentStage}
        onSelectStage={setStage}
        hasCorrections={reviewRecords.some((r) => r.batteryId === selectedBatteryId)}
        hasDecision={!!existingDecision}
      />

      {/* Main Workbench Stage View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentStage === 1 && (
          <Stage01Select
            battery={battery}
            allBatteries={allBatteries}
            selectedModuleId={selectedModuleId}
            explode3DView={explode3DView}
            onSelectBattery={selectBattery}
            onSelectModule={selectModule}
            onToggleExplode={toggleExplodeView}
            onProceed={() => setStage(2)}
          />
        )}

        {currentStage === 2 && (
          <Stage02Inspect
            battery={battery}
            selectedModuleId={selectedModuleId}
            explode3DView={explode3DView}
            onSelectModule={selectModule}
            onToggleExplode={toggleExplodeView}
            onProceed={() => setStage(3)}
            onJumpToReview={() => setStage(4)}
          />
        )}

        {currentStage === 3 && (
          <Stage03Assess
            battery={battery}
            assessment={baseAssessment}
            onBack={() => setStage(2)}
            onProceed={() => setStage(4)}
          />
        )}

        {currentStage === 4 && (
          <Stage04Review
            battery={battery}
            assessment={baseAssessment}
            reviewRecords={reviewRecords.filter((r) => r.batteryId === selectedBatteryId)}
            reasoningFlags={reasoningFlags.filter((f) => f.batteryId === selectedBatteryId)}
            onSaveCorrection={(fieldKey, fieldLabel, correctedVal, correctedStat, reason, note) => {
              recordEvidenceCorrection(
                selectedBatteryId,
                fieldKey,
                fieldLabel,
                correctedVal,
                correctedStat,
                reason,
                note
              );
            }}
            onFlagReasoning={(ruleId, ruleTitle, concern, reviewer) => {
              flagReasoning(selectedBatteryId, ruleId, ruleTitle, concern, reviewer);
            }}
            onBack={() => setStage(3)}
            onProceed={() => setStage(5)}
          />
        )}

        {currentStage === 5 && (
          <Stage05Simulate
            battery={battery}
            selectedModuleId={selectedModuleId}
            baseAssessment={baseAssessment}
            simulatedAssessment={simulatedAssessment}
            simulatedInputs={simulatedInputs}
            onUpdateSimulation={updateSimulationInput}
            onResetSimulation={resetSimulation}
            onApplySimulationToReview={() => applySimulationToReview(selectedBatteryId)}
            onBack={() => setStage(4)}
            onProceed={() => setStage(6)}
          />
        )}

        {currentStage === 6 && (
          <Stage06Decide
            battery={battery}
            assessment={baseAssessment}
            auditLog={auditLog.filter((a) => a.batteryId === selectedBatteryId)}
            existingDecision={existingDecision}
            onRecordDecision={recordHumanDecision}
            onExportAudit={handleExportDossier}
            onResetCase={() => resetCaseToSeed(selectedBatteryId)}
            onBack={() => setStage(5)}
          />
        )}
      </main>

      {/* Contextual Loop Guide Mascot */}
      <LoopGuide
        currentStage={currentStage}
        assessment={baseAssessment}
        selectedModuleId={selectedModuleId}
        hasOverrides={reviewRecords.some((r) => r.batteryId === selectedBatteryId)}
        hasReasoningFlag={reasoningFlags.some((f) => f.batteryId === selectedBatteryId)}
        isDismissed={loopSpeechDismissed}
        onDismiss={dismissLoopSpeech}
        onRestore={restoreLoopSpeech}
      />
    </div>
  );
};
