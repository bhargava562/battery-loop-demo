import React from 'react';
import type { BatteryCase } from '../assessment/assessment.types';

interface BatteryFallback2DProps {
  battery: BatteryCase;
  selectedModuleId: string | null;
  onSelectModule: (moduleId: string) => void;
}

export const BatteryFallback2D: React.FC<BatteryFallback2DProps> = ({
  battery,
  selectedModuleId,
  onSelectModule,
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1E4440 0%, #112826 100%)',
      borderRadius: '8px',
      color: '#F4F1E8',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
    }}>
      <div style={{
        marginBottom: '16px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span className="badge badge-teal">Schematic Pack Blueprint</span>
        <span style={{ fontSize: '12px', color: '#B5C4C2' }}>
          24 Addressable Modules (4 Rows × 6 Columns)
        </span>
      </div>

      {/* Schematic Grid Container */}
      <div style={{
        background: '#163330',
        border: '2px solid #2B5752',
        borderRadius: '10px',
        padding: '16px',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
        }}>
          {battery.modules.map((mod) => {
            const isSelected = mod.moduleId === selectedModuleId;
            const hasConflict = mod.hasConflict || (mod.status === 'flagged' && mod.voltageDeviationMv >= 120);

            let bgColor = '#254440';
            let borderColor = '#3D6963';
            let textColor = '#F4F1E8';

            if (isSelected) {
              bgColor = '#117C72';
              borderColor = '#29B3A5';
              textColor = '#FFFFFF';
            } else if (hasConflict) {
              bgColor = '#752A1C';
              borderColor = '#E76F51';
              textColor = '#FFEBE6';
            } else if (mod.status === 'critical') {
              bgColor = '#661818';
              borderColor = '#BE3D3D';
              textColor = '#FFECEC';
            } else if (mod.status === 'flagged') {
              bgColor = '#5C4410';
              borderColor = '#D9A441';
              textColor = '#FFF6DE';
            }

            return (
              <button
                key={mod.moduleId}
                onClick={() => onSelectModule(mod.moduleId)}
                aria-label={`Select ${mod.label}, ${mod.voltageDeviationMv} millivolts deviation`}
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '6px',
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  position: 'relative',
                  color: textColor,
                  transition: 'transform 0.1s, border-color 0.15s',
                  transform: isSelected ? 'scale(1.05)' : 'none',
                  boxShadow: isSelected ? '0 0 12px rgba(17, 124, 114, 0.6)' : 'none',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}>
                  {mod.moduleId}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  opacity: 0.85,
                }}>
                  {mod.voltageDeviationMv} mV
                </span>
                {hasConflict && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#E76F51',
                    color: '#FFF',
                    borderRadius: '50%',
                    width: '14px',
                    height: '14px',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}>
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Busbar schematic indication */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          background: '#0F2624',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#8CA3A0',
        }}>
          <span>HV BUSWAY · COPPER INTERCONNECT</span>
          <span style={{ color: '#E76F51' }}>● MANUAL DISCONNECT READY</span>
        </div>
      </div>
    </div>
  );
};
