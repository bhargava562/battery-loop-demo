import React, { useEffect, useRef, useState } from 'react';

interface NodePoint {
  x: number;
  y: number;
  baseRadius: number;
  ring: number;
  angle: number;
  speed: number;
  opacity: number;
  isAccent?: boolean;
}

export const ScientificConstellationVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 480);
    let height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    // Generate concentric rings of dots inspired by the Nomic reference
    const rings = [35, 65, 95, 125, 155, 185];
    const nodes: NodePoint[] = [];

    rings.forEach((radius, ringIndex) => {
      const count = 8 + ringIndex * 9;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        nodes.push({
          x: 0,
          y: 0,
          baseRadius: radius,
          ring: ringIndex,
          angle: angle,
          speed: (0.0008 + ringIndex * 0.0003) * (ringIndex % 2 === 0 ? 1 : -1),
          opacity: 0.25 + (ringIndex / rings.length) * 0.55,
          isAccent: (i + ringIndex) % 7 === 0 || (ringIndex === 1 && i === 3),
        });
      }
    });

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Subtle soft gradient aura in the center
      const radial = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 210);
      radial.addColorStop(0, 'rgba(25, 185, 208, 0.12)');
      radial.addColorStop(0.5, 'rgba(22, 168, 144, 0.06)');
      radial.addColorStop(1, 'rgba(240, 245, 250, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 210, 0, Math.PI * 2);
      ctx.fill();

      // Draw faint concentric orbit guide circles
      rings.forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(203, 215, 229, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Update and compute node coordinates
      nodes.forEach((node) => {
        node.angle += node.speed;
        node.x = centerX + Math.cos(node.angle) * node.baseRadius;
        node.y = centerY + Math.sin(node.angle) * node.baseRadius;
      });

      // Draw subtle connective filaments between nearby nodes in adjacent rings
      ctx.lineWidth = 0.75;
      for (let i = 0; i < nodes.length; i += 3) {
        for (let j = i + 1; j < nodes.length; j += 4) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 46 && Math.abs(nodes[i].ring - nodes[j].ring) <= 1) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(25, 185, 208, ${0.18 * (1 - dist / 46)})`;
            ctx.stroke();
          }
        }
      }

      // Draw battery cell nodes with precision styling
      nodes.forEach((node) => {
        ctx.beginPath();
        const pulse = Math.sin(time * 0.03 + node.ring) * 0.5 + 0.5;
        const radius = node.isAccent ? 3.5 + pulse * 1.5 : 2.2;
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        if (node.isAccent) {
          ctx.fillStyle = node.ring === 1 ? '#10B981' : '#19B9D0';
          ctx.shadowColor = 'rgba(25, 185, 208, 0.4)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(18, 36, 58, ${node.opacity * 0.6})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Core Battery Pack Nucleus
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#102B46';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#19B9D0';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '480px',
        height: '480px',
        maxWidth: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        width={480}
        height={480}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Floating Scientific Telemetry Callouts around the Constellation */}
      <div
        onMouseEnter={() => setHoveredMetric('M03')}
        onMouseLeave={() => setHoveredMetric(null)}
        style={{
          position: 'absolute',
          top: '40px',
          right: '18px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-divider)',
          borderLeft: '3px solid var(--accent-review-coral)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          transform: hoveredMetric === 'M03' ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}>
            Module M03
          </span>
          <span className="badge badge-coral" style={{ fontSize: '10px', padding: '2px 6px' }}>
            Delta 180 mV
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Cycler Bench Imbalance
        </div>
      </div>

      <div
        onMouseEnter={() => setHoveredMetric('BMS')}
        onMouseLeave={() => setHoveredMetric(null)}
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-divider)',
          borderLeft: '3px solid var(--accent-cyan)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          transform: hoveredMetric === 'BMS' ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}>
            SoH: 99%
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '10px', padding: '2px 6px' }}>
            BMS Self-Report
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Contradicted by cycler telemetry
        </div>
      </div>

      <div
        onMouseEnter={() => setHoveredMetric('MAP')}
        onMouseLeave={() => setHoveredMetric(null)}
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-divider)',
          borderLeft: '3px solid var(--accent-teal)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '11px', color: 'var(--text-primary)' }}>
          24 Mapped Modules · NMC 811
        </div>
      </div>
    </div>
  );
};
