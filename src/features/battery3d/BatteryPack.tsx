import type { BatteryCase } from '../assessment/assessment.types';
import { BatteryModule } from './BatteryModule';

interface BatteryPackProps {
  battery: BatteryCase;
  selectedModuleId: string | null;
  isExploded: boolean;
  onSelectModule: (moduleId: string) => void;
}

export const BatteryPack: React.FC<BatteryPackProps> = ({
  battery,
  selectedModuleId,
  isExploded,
  onSelectModule,
}) => {
  // 6 columns (X) x 4 rows (Z) = 24 modules
  const trayWidth = 6.0;
  const trayLength = 5.2;
  const trayHeight = 0.8;
  const wallThickness = 0.08;

  return (
    <group position={[0, -0.2, 0]}>
      {/* 24 Modules */}
      {battery.modules.map((mod, index) => {
        const row = Math.floor(index / 6); // 0, 1, 2, 3
        const col = index % 6; // 0, 1, 2, 3, 4, 5
        const isSelected = mod.moduleId === selectedModuleId;

        return (
          <BatteryModule
            key={mod.moduleId}
            module={mod}
            isSelected={isSelected}
            isExploded={isExploded}
            row={row}
            col={col}
            onClick={onSelectModule}
          />
        );
      })}

      {/* ALUMINUM PACK STRUCTURAL TRAY */}
      {/* Tray Floor Base Plate */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[trayWidth, 0.08, trayLength]} />
        <meshStandardMaterial
          color="#3A4D4B"
          metalness={0.75}
          roughness={0.4}
        />
      </mesh>

      {/* Front & Back Enclosure Tray Walls */}
      <mesh position={[0, trayHeight / 2, trayLength / 2 + wallThickness / 2]}>
        <boxGeometry args={[trayWidth + wallThickness * 2, trayHeight, wallThickness]} />
        <meshStandardMaterial color="#2B3E3C" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, trayHeight / 2, -trayLength / 2 - wallThickness / 2]}>
        <boxGeometry args={[trayWidth + wallThickness * 2, trayHeight, wallThickness]} />
        <meshStandardMaterial color="#2B3E3C" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Left & Right Enclosure Tray Walls */}
      <mesh position={[-trayWidth / 2 - wallThickness / 2, trayHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, trayHeight, trayLength]} />
        <meshStandardMaterial color="#2B3E3C" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[trayWidth / 2 + wallThickness / 2, trayHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, trayHeight, trayLength]} />
        <meshStandardMaterial color="#2B3E3C" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Longitudinal Center Divider Spine */}
      <mesh position={[0, (trayHeight * 0.7) / 2, 0]}>
        <boxGeometry args={[0.06, trayHeight * 0.7, trayLength]} />
        <meshStandardMaterial color="#223331" metalness={0.8} roughness={0.5} />
      </mesh>

      {/* Lateral Cross-Beam Partition Rails */}
      {[-1.2, 0, 1.2].map((zPos, i) => (
        <mesh key={`cross_${i}`} position={[0, 0.15, zPos]}>
          <boxGeometry args={[trayWidth, 0.22, 0.05]} />
          <meshStandardMaterial color="#223331" metalness={0.75} roughness={0.5} />
        </mesh>
      ))}

      {/* High-Voltage Copper Busbar Connections Between Rows */}
      {[-1.8, -0.6, 0.6, 1.8].map((zPos, i) => (
        <mesh key={`busbar_${i}`} position={[0, 0.72, zPos]}>
          <boxGeometry args={[5.2, 0.02, 0.04]} />
          <meshStandardMaterial
            color="#C77D34" // polished copper
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      ))}

      {/* Service Disconnect Plug & BMS Master Gateway Unit */}
      <group position={[trayWidth / 2 + 0.15, 0.35, -trayLength * 0.3]}>
        <mesh>
          <boxGeometry args={[0.22, 0.35, 0.65]} />
          <meshStandardMaterial color="#E76F51" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Disconnect lever */}
        <mesh position={[0.12, 0.05, 0]}>
          <boxGeometry args={[0.08, 0.15, 0.08]} />
          <meshStandardMaterial color="#D9A441" roughness={0.3} />
        </mesh>
      </group>

      {/* Ground Shadow Plane */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
    </group>
  );
};
