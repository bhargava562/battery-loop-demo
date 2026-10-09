import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { BatteryCase } from '../assessment/assessment.types';
import { BatteryPack } from './BatteryPack';
import { BatteryFallback2D } from './BatteryFallback2D';
import { RotateCcw, Layers, Eye, Maximize2, ShieldAlert } from 'lucide-react';

interface BatterySceneProps {
  battery: BatteryCase;
  selectedModuleId: string | null;
  onSelectModule: (moduleId: string) => void;
  isExploded?: boolean;
  onToggleExplode?: () => void;
}

export const BatteryScene: React.FC<BatterySceneProps> = ({
  battery,
  selectedModuleId,
  onSelectModule,
  isExploded = false,
  onToggleExplode,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [use2DMode, setUse2DMode] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(6.5, 6.0, 7.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const setTopView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 10.5, 0.01);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const selectedModule = battery.modules.find((m) => m.moduleId === selectedModuleId);

  if (!webglSupported || use2DMode) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
        <BatteryFallback2D
          battery={battery}
          selectedModuleId={selectedModuleId}
          onSelectModule={onSelectModule}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <button
            onClick={() => setUse2DMode(false)}
            style={{
              background: '#163C38',
              color: '#F4F1E8',
              border: '1px solid #2B5752',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            Switch to 3D View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '400px',
      background: 'radial-gradient(circle at 50% 40%, #1A3935 0%, #102624 85%, #0B1C1A 100%)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--border-dark)',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
    }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [6.5, 6.0, 7.5], fov: 42 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        
        {/* Key Studio Light */}
        <directionalLight
          position={[7, 12, 8]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Soft Cool Rim Light */}
        <directionalLight position={[-8, 6, -6]} intensity={0.5} color="#B5E4DC" />

        {/* Subtle Warm Fill */}
        <pointLight position={[0, -2, 6]} intensity={0.4} color="#F5D0A9" />

        <BatteryPack
          battery={battery}
          selectedModuleId={selectedModuleId}
          isExploded={isExploded}
          onSelectModule={onSelectModule}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={3.5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.05} // Prevent camera going under floor
        />
      </Canvas>

      {/* Top Controls Overlay Toolbar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        {/* Selected Module Chip */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(16, 38, 36, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(213, 221, 214, 0.2)',
          borderRadius: '6px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#F4F1E8',
          }}>
            {selectedModuleId ? `Module ${selectedModuleId}` : 'No Module Selected'}
          </span>
          {selectedModule && (
            <span
              className={
                selectedModule.hasConflict
                  ? 'badge badge-coral'
                  : selectedModule.status === 'flagged'
                  ? 'badge badge-amber'
                  : 'badge badge-teal'
              }
            >
              {selectedModule.voltageDeviationMv} mV Δ
            </span>
          )}
          {selectedModule?.hasConflict && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#E76F51' }}>
              <ShieldAlert size={13} />
              Conflict
            </span>
          )}
        </div>

        {/* View Action Buttons */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {onToggleExplode && (
            <button
              onClick={onToggleExplode}
              style={{
                background: isExploded ? 'var(--accent-instrument-teal)' : 'rgba(16, 38, 36, 0.85)',
                color: '#F4F1E8',
                border: '1px solid rgba(213, 221, 214, 0.2)',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}
              title="Explode module groups for internal inspection"
            >
              <Layers size={13} />
              {isExploded ? 'Pack Normal' : 'Explode View'}
            </button>
          )}

          <button
            onClick={resetCamera}
            style={{
              background: 'rgba(16, 38, 36, 0.85)',
              color: '#F4F1E8',
              border: '1px solid rgba(213, 221, 214, 0.2)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
            title="Reset to default isometric camera"
          >
            <RotateCcw size={13} />
            Reset View
          </button>

          <button
            onClick={setTopView}
            style={{
              background: 'rgba(16, 38, 36, 0.85)',
              color: '#F4F1E8',
              border: '1px solid rgba(213, 221, 214, 0.2)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
            title="Plan Top-Down View"
          >
            <Eye size={13} />
            Top View
          </button>

          <button
            onClick={() => setUse2DMode(true)}
            style={{
              background: 'rgba(16, 38, 36, 0.85)',
              color: '#F4F1E8',
              border: '1px solid rgba(213, 221, 214, 0.2)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
            title="Switch to 2D Schematic blueprint mode"
          >
            <Maximize2 size={13} />
            2D
          </button>
        </div>
      </div>

      {/* Bottom Legend Bar */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(16, 38, 36, 0.8)',
          backdropFilter: 'blur(6px)',
          borderRadius: '4px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#A8BCBA',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-instrument-teal)' }}></span>
            Selected
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-oxide-coral)' }}></span>
            Conflict / Anomaly
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6A7D7B' }}></span>
            Nominal
          </span>
        </div>

        {/* Keyboard Quick Selector */}
        <div style={{ pointerEvents: 'auto' }}>
          <select
            value={selectedModuleId || ''}
            onChange={(e) => onSelectModule(e.target.value)}
            aria-label="Direct module selector"
            style={{
              background: 'rgba(16, 38, 36, 0.9)',
              color: '#F4F1E8',
              border: '1px solid rgba(213, 221, 214, 0.25)',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            {battery.modules.map((m) => (
              <option key={m.moduleId} value={m.moduleId}>
                {m.moduleId} ({m.voltageDeviationMv} mV{m.hasConflict ? ' · CONFLICT' : ''})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
