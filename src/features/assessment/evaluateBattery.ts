import type { Assessment, BatteryCase, RuleExplanation } from './assessment.types';
import { DEMO_THRESHOLDS, PATHWAY_CONFIG } from './demoRules';

export function calculateEvidenceCoverage(
  evidence: Record<string, any>
): { coverage: number; missingFields: string[] } {
  let totalWeight = 0;
  let earnedWeight = 0;
  const missingFields: string[] = [];

  for (const key of Object.keys(evidence)) {
    const item = evidence[key];
    const weight = typeof item.weight === 'number' ? item.weight : 10;
    totalWeight += weight;

    if (item.status === 'verified') {
      earnedWeight += weight;
    } else if (item.status === 'partial') {
      earnedWeight += weight * 0.5;
      missingFields.push(item.label || key);
    } else {
      missingFields.push(item.label || key);
    }
  }

  const coverage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  return { coverage, missingFields };
}

export function evaluateBattery(
  battery: BatteryCase,
  overrides?: Record<string, any>,
  isSimulated = false
): Assessment {
  // Merge overrides if present into effective battery view
  const effectiveBattery: BatteryCase = {
    ...battery,
    ...(overrides || {}),
    evidence: {
      ...battery.evidence,
      ...((overrides && overrides.evidence) ? overrides.evidence : {}),
    },
    modules: (overrides && overrides.modules) ? overrides.modules : battery.modules,
  };

  const { coverage, missingFields } = calculateEvidenceCoverage(effectiveBattery.evidence);
  const ruleExplanations: RuleExplanation[] = [];
  const reasonCodes: string[] = [];
  const ruleIds: string[] = [];

  // Check module extremes
  let maxVoltageDeviation = 0;
  let maxTempVariance = 0;
  let flaggedModuleCount = 0;
  let maxDeviationModuleId = 'None';

  for (const mod of effectiveBattery.modules) {
    if (mod.voltageDeviationMv > maxVoltageDeviation) {
      maxVoltageDeviation = mod.voltageDeviationMv;
      maxDeviationModuleId = mod.moduleId;
    }
    if (mod.tempVarianceC > maxTempVariance) {
      maxTempVariance = mod.tempVarianceC;
    }
    if (mod.voltageDeviationMv > DEMO_THRESHOLDS.NOMINAL_VOLTAGE_DEVIATION_MV) {
      flaggedModuleCount++;
    }
  }

  // 1. CRITICAL SAFETY EVIDENCE (RULE-SAFE-01)
  if (effectiveBattery.criticalSafetyFlag) {
    ruleIds.push('RULE-SAFE-01');
    reasonCodes.push('CRITICAL_SAFETY_FLAG_ACTIVE');
    ruleExplanations.push({
      ruleId: 'RULE-SAFE-01',
      title: 'Critical Safety Intervention Rule',
      category: 'safety',
      conditionMet: effectiveBattery.criticalSafetyReason || 'Pack reported critical safety incident or thermal runaway history.',
      impact: 'Mandatory halt on all second-life evaluation. Directs pack to controlled recycling.',
    });

    return {
      batteryId: effectiveBattery.id,
      pathway: 'recycling-assessment',
      pathwayTitle: PATHWAY_CONFIG['recycling-assessment'].title,
      evidenceCoverage: coverage,
      confidence: 'high',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: 'Safe controlled de-energization and containment protocols',
      deploymentBlocked: true,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 2. CONFLICTING EVIDENCE (RULE-CONF-02)
  // High reported SoH (>= 85%) contradicted by severe module voltage imbalance (>= 120 mV) or severe temp variance
  const isHighSoH = effectiveBattery.reportedSoH >= DEMO_THRESHOLDS.HIGH_REPORTED_SOH_PERCENT;
  const isSevereModuleImbalance = maxVoltageDeviation >= DEMO_THRESHOLDS.SEVERE_VOLTAGE_DEVIATION_MV;

  if (isHighSoH && isSevereModuleImbalance) {
    ruleIds.push('RULE-CONF-02');
    reasonCodes.push('SOH_MODULE_DIAGNOSTIC_CONTRADICTION');
    reasonCodes.push('HIGH_VOLTAGE_DEVIATION_DETECTED');

    ruleExplanations.push({
      ruleId: 'RULE-CONF-02',
      title: 'Telemetry Contradiction Detection Rule',
      category: 'conflict',
      conditionMet: `Reported SoH is high (${effectiveBattery.reportedSoH}%), but module ${maxDeviationModuleId} exhibits severe voltage deviation (${maxVoltageDeviation} mV >= ${DEMO_THRESHOLDS.SEVERE_VOLTAGE_DEVIATION_MV} mV demo threshold).`,
      impact: 'Blocks progression to second-life reuse; flags requirement for controlled laboratory testing.',
    });

    if (missingFields.length > 0) {
      ruleIds.push('RULE-INSUF-03B');
      reasonCodes.push('INCOMPLETE_OPERATIONAL_HISTORY');
      ruleExplanations.push({
        ruleId: 'RULE-INSUF-03B',
        title: 'Corroborating Telemetry Gap Rule',
        category: 'coverage',
        conditionMet: `Pack is missing key corroborating records: ${missingFields.slice(0, 2).join(', ')}.`,
        impact: 'Reduces decision confidence and emphasizes requirement for laboratory validation.',
      });
    }

    return {
      batteryId: effectiveBattery.id,
      pathway: 'further-controlled-testing',
      pathwayTitle: PATHWAY_CONFIG['further-controlled-testing'].title,
      evidenceCoverage: coverage,
      confidence: 'medium',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: `High-precision bench discharge test and AC impedance spectroscopy on Module ${maxDeviationModuleId}`,
      deploymentBlocked: true,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 3. INSUFFICIENT EVIDENCE (RULE-INSUF-03)
  if (coverage < 50 || missingFields.length >= 3) {
    ruleIds.push('RULE-INSUF-03');
    reasonCodes.push('INSUFFICIENT_EVIDENCE_COVERAGE');
    ruleExplanations.push({
      ruleId: 'RULE-INSUF-03',
      title: 'Minimum Evidence Gate Rule',
      category: 'coverage',
      conditionMet: `Evidence coverage is ${coverage}% (below minimum demo gate of 50%). Missing: ${missingFields.join(', ')}.`,
      impact: 'Cannot screen for second-life without baseline telemetry verification.',
    });

    return {
      batteryId: effectiveBattery.id,
      pathway: 'further-controlled-testing',
      pathwayTitle: PATHWAY_CONFIG['further-controlled-testing'].title,
      evidenceCoverage: coverage,
      confidence: 'low',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: 'Complete cycle diagnostic bench log & obtain verified vehicle service history',
      deploymentBlocked: true,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 4. MODULE REPAIR SUITABILITY (RULE-REPAIR-04)
  if (
    flaggedModuleCount > 0 &&
    flaggedModuleCount <= 3 &&
    maxVoltageDeviation >= DEMO_THRESHOLDS.NOMINAL_VOLTAGE_DEVIATION_MV &&
    maxVoltageDeviation < DEMO_THRESHOLDS.SEVERE_VOLTAGE_DEVIATION_MV &&
    effectiveBattery.reportedSoH >= 70
  ) {
    ruleIds.push('RULE-REPAIR-04');
    reasonCodes.push('ISOLATED_MODULE_VARIANCE');
    ruleExplanations.push({
      ruleId: 'RULE-REPAIR-04',
      title: 'Localized Repair Screening Rule',
      category: 'suitability',
      conditionMet: `${flaggedModuleCount} module(s) exhibit moderate variance (${maxVoltageDeviation} mV on ${maxDeviationModuleId}). Overall pack structure remains intact.`,
      impact: 'Pack is suitable for reconditioning or single-module replacement rather than disposal.',
    });

    return {
      batteryId: effectiveBattery.id,
      pathway: 'repair-assessment',
      pathwayTitle: PATHWAY_CONFIG['repair-assessment'].title,
      evidenceCoverage: coverage,
      confidence: 'high',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: `Module ${maxDeviationModuleId} balance cycle and busbar contact resistance inspection`,
      deploymentBlocked: false,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 5. SECOND-LIFE / REUSE SUITABILITY (RULE-SUIT-05)
  if (
    effectiveBattery.reportedSoH >= DEMO_THRESHOLDS.MIN_SECOND_LIFE_SOH_PERCENT &&
    maxVoltageDeviation <= DEMO_THRESHOLDS.NOMINAL_VOLTAGE_DEVIATION_MV &&
    coverage >= DEMO_THRESHOLDS.MIN_SECOND_LIFE_COVERAGE_PERCENT
  ) {
    // If exceptionally pristine (>92% SoH and >85% coverage), continue-use candidate
    if (effectiveBattery.reportedSoH >= 92 && coverage >= 85) {
      ruleIds.push('RULE-SUIT-05A');
      reasonCodes.push('HIGH_CAPACITY_RETENTION', 'BALANCED_CELL_UNIFORMITY');
      ruleExplanations.push({
        ruleId: 'RULE-SUIT-05A',
        title: 'Continued Mobile Operation Rule',
        category: 'suitability',
        conditionMet: `Reported SoH is ${effectiveBattery.reportedSoH}%, module voltage delta is only ${maxVoltageDeviation} mV (<= 50 mV), and coverage is ${coverage}%.`,
        impact: 'Meets requirements for continued mobile or primary fleet duty.',
      });

      return {
        batteryId: effectiveBattery.id,
        pathway: 'continue-use-candidate',
        pathwayTitle: PATHWAY_CONFIG['continue-use-candidate'].title,
        evidenceCoverage: coverage,
        confidence: 'high',
        reasonCodes,
        missingEvidence: missingFields,
        nextRecommendedTest: 'Annual fleet telemetry audit',
        deploymentBlocked: false,
        ruleIds,
        ruleExplanations,
        evaluatedAt: new Date().toISOString(),
        isSimulated,
      };
    }

    ruleIds.push('RULE-SUIT-05B');
    reasonCodes.push('STATIONARY_STORAGE_CANDIDATE', 'BALANCED_CELL_METRICS');
    ruleExplanations.push({
      ruleId: 'RULE-SUIT-05B',
      title: 'Second-Life Stationary Storage Candidate Rule',
      category: 'suitability',
      conditionMet: `Reported SoH is ${effectiveBattery.reportedSoH}% (>= 75%), cell delta is ${maxVoltageDeviation} mV (<= 50 mV), and verified evidence coverage is ${coverage}%.`,
      impact: 'Pack is prime candidate for secondary stationary BESS repurposing.',
    });

    return {
      batteryId: effectiveBattery.id,
      pathway: 'second-life-evaluation',
      pathwayTitle: PATHWAY_CONFIG['second-life-evaluation'].title,
      evidenceCoverage: coverage,
      confidence: 'high',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: 'Stationary C/2 discharge qualification protocol',
      deploymentBlocked: false,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 6. LOW SOH / SEVERE DEGRADATION (RULE-RECYC-06)
  if (effectiveBattery.reportedSoH < 70 || flaggedModuleCount > 6) {
    ruleIds.push('RULE-RECYC-06');
    reasonCodes.push('CAPACITY_EXHAUSTION', 'MULTIPLE_DEGRADED_MODULES');
    ruleExplanations.push({
      ruleId: 'RULE-RECYC-06',
      title: 'End-of-Life Material Recovery Rule',
      category: 'suitability',
      conditionMet: `Pack SoH (${effectiveBattery.reportedSoH}%) or widespread module imbalance (${flaggedModuleCount} modules) exceeds second-life commercial viability limits.`,
      impact: 'Directs pack to hydrometallurgical recycling for material recovery.',
    });

    return {
      batteryId: effectiveBattery.id,
      pathway: 'recycling-assessment',
      pathwayTitle: PATHWAY_CONFIG['recycling-assessment'].title,
      evidenceCoverage: coverage,
      confidence: 'high',
      reasonCodes,
      missingEvidence: missingFields,
      nextRecommendedTest: 'End-of-life residual charge neutralisation',
      deploymentBlocked: true,
      ruleIds,
      ruleExplanations,
      evaluatedAt: new Date().toISOString(),
      isSimulated,
    };
  }

  // 7. DEFAULT FALLBACK (RULE-DEF-07)
  ruleIds.push('RULE-DEF-07');
  reasonCodes.push('INDETERMINATE_METRICS_DEFAULT');
  ruleExplanations.push({
    ruleId: 'RULE-DEF-07',
    title: 'Indeterminate Metrics Conservative Gate Rule',
    category: 'suitability',
    conditionMet: 'Metrics do not satisfy unambiguous reuse or repair criteria.',
    impact: 'Defaults safely to further controlled evaluation before committing to path.',
  });

  return {
    batteryId: effectiveBattery.id,
    pathway: 'further-controlled-testing',
    pathwayTitle: PATHWAY_CONFIG['further-controlled-testing'].title,
    evidenceCoverage: coverage,
    confidence: 'medium',
    reasonCodes,
    missingEvidence: missingFields,
    nextRecommendedTest: 'Comprehensive pack cycle calibration',
    deploymentBlocked: true,
    ruleIds,
    ruleExplanations,
    evaluatedAt: new Date().toISOString(),
    isSimulated,
  };
}
