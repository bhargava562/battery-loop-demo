import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { ModuleData } from '../assessment/assessment.types';

interface BatteryModuleProps {
  module: ModuleData;
  isSelected: boolean;
  isExploded: boolean;
  row: number; // 0 to 3
  col: number; // 0 to 5
  onClick: (moduleId: string) => void;
}

export const BatteryModule: React.FC<BatteryModuleProps> = ({
  module,
  isSelected,
  isExploded,
  row,
  col,
  onClick,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Pack layout dimensions (center around origin)
  // 6 columns along X, 4 rows along Z
  const moduleWidth = 0.82;
  const moduleLength = 1.05;
  const moduleHeight = 0.65;
  const gapX = 0.12;
  const gapZ = 0.14;

  const baseX = (col - 2.5) * (moduleWidth + gapX);
  const baseZ = (row - 1.5) * (moduleLength + gapZ);
  const baseY = moduleHeight / 2 + 0.08;

  // Exploded offsets
  const explodeFactorX = (col - 2.5) * 0.45;
  const explodeFactorZ = (row - 1.5) * 0.55;
  const explodeFactorY = 0.25;

  const targetX = isExploded ? baseX + explodeFactorX : baseX;
  const targetZ = isExploded ? baseZ + explodeFactorZ : baseZ;
  const targetY = isExploded ? baseY + explodeFactorY : baseY + (hovered ? 0.08 : 0);

  // Smooth position interpolation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.damp(
        meshRef.current.position.x,
        targetX,
        10,
        delta
      );
      meshRef.current.position.y = THREE.MathUtils.damp(
        meshRef.current.position.y,
        targetY,
        12,
        delta
      );
      meshRef.current.position.z = THREE.MathUtils.damp(
        meshRef.current.position.z,
        targetZ,
        10,
        delta
      );
    }
  });

  // Material colors based on status & selection
  let baseColor = '#6A7D7B'; // nominal brushed alloy
  let emissiveColor = '#000000';
  let emissiveIntensity = 0.0;

  if (isSelected) {
    baseColor = '#007F73'; // Teal with lime highlight
    emissiveColor = '#D8F36A'; // Accent lime glow
    emissiveIntensity = 0.6;
  } else if (module.hasConflict || (module.status === 'flagged' && module.voltageDeviationMv >= 120)) {
    baseColor = '#FF725E'; // Review coral
    emissiveColor = '#FF725E';
    emissiveIntensity = hovered ? 0.65 : 0.4;
  } else if (module.status === 'critical') {
    baseColor = '#C63F46'; // Risk red
    emissiveColor = '#C63F46';
    emissiveIntensity = 0.55;
  } else if (module.status === 'flagged') {
    baseColor = '#E4AD46'; // Signal amber
    emissiveColor = '#E4AD46';
    emissiveIntensity = 0.3;
  } else if (hovered) {
    baseColor = '#8A9F9D';
    emissiveColor = '#007F73';
    emissiveIntensity = 0.25;
  }

  return (
    <group
      ref={meshRef}
      position={[baseX, baseY, baseZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(module.moduleId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Module Enclosure Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[moduleWidth, moduleHeight, moduleLength]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.35}
          metalness={0.65}
        />
      </mesh>

      {/* Top Cover Accent / Seam Plate */}
      <mesh position={[0, moduleHeight / 2 + 0.015, 0]}>
        <boxGeometry args={[moduleWidth * 0.92, 0.02, moduleLength * 0.92]} />
        <meshStandardMaterial
          color={isSelected ? '#0D5F57' : '#3B4D4B'}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Positive Terminal Post (Brass/Gold) */}
      <mesh position={[moduleWidth * 0.25, moduleHeight / 2 + 0.04, moduleLength * 0.3]}>
        <cylinderGeometry args={[0.045, 0.045, 0.05, 12]} />
        <meshStandardMaterial color="#D4A343" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Negative Terminal Post (Silver/Aluminium) */}
      <mesh position={[-moduleWidth * 0.25, moduleHeight / 2 + 0.04, moduleLength * 0.3]}>
        <cylinderGeometry args={[0.045, 0.045, 0.05, 12]} />
        <meshStandardMaterial color="#B0C2C0" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Monitoring Ribbon Connector / BMS Tap */}
      <mesh position={[0, moduleHeight / 2 + 0.03, -moduleLength * 0.35]}>
        <boxGeometry args={[moduleWidth * 0.4, 0.03, 0.08]} />
        <meshStandardMaterial
          color={module.hasConflict ? '#E76F51' : isSelected ? '#117C72' : '#2A3C3A'}
          emissive={module.hasConflict ? '#E76F51' : isSelected ? '#117C72' : '#000000'}
          emissiveIntensity={module.hasConflict ? 0.6 : 0.1}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};
