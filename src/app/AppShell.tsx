import React, { useEffect } from 'react';
import { useBatteryLoopStore } from '../state/useBatteryLoopStore';
import { parseHash } from './routes';
import { ModernTopNav } from '../components/ModernTopNav';
import { LoopGuide } from '../components/LoopGuide';
import { WorkspaceOverviewScreen } from '../screens/WorkspaceOverviewScreen';
import { BatteryLibraryScreen } from '../screens/BatteryLibraryScreen';
import { NewBatteryAssessmentScreen } from '../screens/NewBatteryAssessmentScreen';
import { BatteryCaseWorkspaceScreen } from '../screens/BatteryCaseWorkspaceScreen';
import { DecisionDossiersScreen } from '../screens/DecisionDossiersScreen';
import { AuditHistoryScreen } from '../screens/AuditHistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export const AppShell: React.FC = () => {
  const {
    currentRoute,
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
    setCurrentRoute,
    selectBattery,
    selectModule,
    toggleExplodeView,
    registerBattery,
    importEvidenceToCase,
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

  // Listen to browser hash changes for smooth URL routing & back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash || '#/workspace');
      setCurrentRoute(parsed);

      // If route has batteryId, sync selected battery
      if (parsed.type === 'battery-case' && parsed.batteryId) {
        if (parsed.batteryId !== selectedBatteryId && batteryCases[parsed.batteryId]) {
          selectBattery(parsed.batteryId);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initialize default if hash is empty
    if (!window.location.hash) {
      window.location.hash = '#/workspace';
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [batteryCases, selectedBatteryId, selectBattery, setCurrentRoute]);

  const activeBattery = getEffectiveBattery(selectedBatteryId);
  const baseAssessment = getAssessment(selectedBatteryId);
  const simulatedAssessment = getSimulatedAssessment(selectedBatteryId);
  const existingDecision = humanDecisions[selectedBatteryId];
  const allBatteries = Object.values(batteryCases);

  const handleExportDossier = (targetBatteryId?: string) => {
    const idToExport = targetBatteryId || selectedBatteryId;
    const targetBattery = getEffectiveBattery(idToExport);
    const targetAssessment = getAssessment(idToExport);
    const targetDecision = humanDecisions[idToExport];

    const exportData = {
      product: 'BatteryLoop — Battery Assessment Workspace',
      exportTimestamp: new Date().toISOString(),
      packIdentity: {
        id: targetBattery.id,
        vehicleModel: targetBattery.vehicleModel,
        chemistry: targetBattery.chemistry,
        nominalCapacityKwh: targetBattery.nominalCapacityKwh,
        nominalVoltageV: targetBattery.nominalVoltageV,
        reportedSoH: targetBattery.reportedSoH,
        cycleCount: targetBattery.cycleCount,
      },
      automatedScreening: {
        suggestedPathway: targetAssessment.pathwayTitle,
        evidenceCoveragePercent: targetAssessment.evidenceCoverage,
        rulesTriggered: targetAssessment.ruleIds,
        ruleExplanations: targetAssessment.ruleExplanations,
        missingEvidence: targetAssessment.missingEvidence,
        recommendedNextTest: targetAssessment.nextRecommendedTest,
      },
      humanGovernanceSignOff: targetDecision
        ? {
            recordedPathway: targetDecision.pathwayTitle,
            reviewer: targetDecision.reviewer,
            rationale: targetDecision.justification,
            timestamp: targetDecision.timestamp,
            outstandingPhysicalGates: targetDecision.outstandingRequirements,
          }
        : 'Pending Formal Sign-off',
      evidenceDossier: targetBattery.evidence,
      reviewerOverrides: reviewRecords.filter((r) => r.batteryId === idToExport),
      reasoningObjections: reasoningFlags.filter((f) => f.batteryId === idToExport),
      auditTimeline: auditLog.filter((a) => a.batteryId === idToExport),
      disclaimer:
        'SIMULATED DATA SCREENING PROTOTYPE. Mandatory physical high-voltage bench testing required before deployment.',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BatteryLoop_Dossier_${targetBattery.id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {/* Modern Top Navigation Bar */}
      <ModernTopNav
        currentRoute={currentRoute}
        battery={activeBattery}
        allBatteries={allBatteries}
        onSelectBattery={selectBattery}
        onResetCase={() => resetCaseToSeed(selectedBatteryId)}
        onExportAudit={() => handleExportDossier()}
      />

      {/* Dynamic Route Screen Canvas — 100% full-width modern workspace */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
        }}
      >
          {currentRoute.type === 'workspace' && (
            <WorkspaceOverviewScreen
              batteryCases={batteryCases}
              humanDecisions={humanDecisions}
              onSelectBattery={selectBattery}
            />
          )}

          {currentRoute.type === 'batteries' && (
            <BatteryLibraryScreen
              batteryCases={batteryCases}
              humanDecisions={humanDecisions}
              selectedBatteryId={selectedBatteryId}
              onSelectBattery={selectBattery}
            />
          )}

          {currentRoute.type === 'battery-new' && (
            <NewBatteryAssessmentScreen
              existingCount={allBatteries.length}
              onRegisterBattery={registerBattery}
            />
          )}

          {currentRoute.type === 'battery-case' && (
            <BatteryCaseWorkspaceScreen
              battery={activeBattery}
              activeTab={currentRoute.tab}
              selectedModuleId={selectedModuleId}
              explode3DView={explode3DView}
              baseAssessment={baseAssessment}
              simulatedAssessment={simulatedAssessment}
              simulatedInputs={simulatedInputs}
              existingDecision={existingDecision}
              reviewRecords={reviewRecords}
              reasoningFlags={reasoningFlags}
              auditTimeline={auditLog.filter((a) => a.batteryId === selectedBatteryId)}
              onSelectModule={selectModule}
              onToggleExplode={toggleExplodeView}
              onImportEvidence={importEvidenceToCase}
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
              onUpdateSimulation={updateSimulationInput}
              onResetSimulation={resetSimulation}
              onApplySimulationToReview={() => applySimulationToReview(selectedBatteryId)}
              onRecordDecision={recordHumanDecision}
              onExportAudit={() => handleExportDossier()}
              onResetCase={() => resetCaseToSeed(selectedBatteryId)}
            />
          )}

          {currentRoute.type === 'dossiers' && (
            <DecisionDossiersScreen
              batteryCases={batteryCases}
              humanDecisions={humanDecisions}
              onSelectBattery={selectBattery}
              onExportAudit={handleExportDossier}
            />
          )}

          {currentRoute.type === 'history' && (
            <AuditHistoryScreen
              auditLog={auditLog}
              onSelectBattery={selectBattery}
            />
          )}

          {currentRoute.type === 'settings' && (
            <SettingsScreen
              onResetEntireDemo={resetEntireDemo}
              reviewRecordsCount={reviewRecords.length}
              auditEventsCount={auditLog.length}
            />
          )}
        </main>

      {/* 3. Non-Obstructive Docked Contextual Loop Guide */}
      <LoopGuide
        currentRoute={currentRoute}
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
