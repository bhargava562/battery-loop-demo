import React from 'react';
import { Download, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import type { BatteryCase, HumanDecisionRecord } from '../features/assessment/assessment.types';
import { navigate } from '../app/routes';

interface DecisionDossiersScreenProps {
  batteryCases: Record<string, BatteryCase>;
  humanDecisions: Record<string, HumanDecisionRecord>;
  onSelectBattery: (id: string) => void;
  onExportAudit: (batteryId: string) => void;
}

export const DecisionDossiersScreen: React.FC<DecisionDossiersScreenProps> = ({
  batteryCases,
  humanDecisions,
  onSelectBattery,
  onExportAudit,
}) => {
  const allCases = Object.values(batteryCases);

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
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-teal">DOSSIERS</span>
          <span className="text-caption">Governance Sign-Off</span>
        </div>
        <h1>Decision dossiers</h1>
      </div>

      {/* Dossier Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {allCases.map((c) => {
          const decision = humanDecisions[c.id];

          return (
            <div
              key={c.id}
              className="surface-card"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: decision ? '4px solid var(--accent-primary)' : '4px solid var(--signal-amber)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {c.id}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    · {c.vehicleModel}
                  </span>
                  {decision ? (
                    <span className="badge badge-teal">
                      <ShieldCheck size={12} />
                      Signed Off: {decision.pathwayTitle}
                    </span>
                  ) : (
                    <span className="badge badge-amber">
                      <Clock size={12} />
                      Decision Pending
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '650px', lineHeight: 1.4 }}>
                  {decision ? (
                    <>
                      <strong>Rationale:</strong> "{decision.justification}" — by {decision.reviewer} on {decision.timestamp.replace('T', ' ').slice(0, 16)}
                    </>
                  ) : (
                    <>
                      Case initial hint: {c.initialRecommendationHint || 'Under screening evaluation'}.
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => {
                    onSelectBattery(c.id);
                    onExportAudit(c.id);
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  <Download size={13} />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => {
                    onSelectBattery(c.id);
                    navigate(`#/batteries/${c.id}/decision`);
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  <span>{decision ? 'View Dossier' : 'Record Decision'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
