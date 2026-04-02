'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { InteractiveProps } from '@/types';

const PLANETS = [
  { name: 'Mercury', a: 0.387, color: '#94a3b8', r: 3, period: 0.241 },
  { name: 'Venus',   a: 0.723, color: '#fbbf24', r: 5, period: 0.615, retrograde: true },
  { name: 'Earth',   a: 1.0,   color: '#3b82f6', r: 5.5, period: 1.0 },
  { name: 'Mars',    a: 1.524, color: '#ef4444', r: 4, period: 1.881 },
  { name: 'Jupiter', a: 2.8,   color: '#f97316', r: 11, period: 11.86 },
  { name: 'Saturn',  a: 3.6,   color: '#fde68a', r: 9, period: 29.46, rings: true },
  { name: 'Uranus',  a: 4.4,   color: '#67e8f9', r: 7, period: 84.01, tilt: true },
  { name: 'Neptune', a: 5.0,   color: '#60a5fa', r: 6.5, period: 164.8 },
];

export default function OrbitalAnimation(_: InteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [speed, setSpeed] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const tRef = useRef(0);
  const W = 640, H = 480;

  const CX = W / 2, CY = H / 2;
  const AU_PX = 80; // 1 AU = 80px

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    tRef.current += speed * 0.0003;
    const t = tRef.current;

    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, W / 2);
    bg.addColorStop(0, '#0d0d1a'); bg.addColorStop(1, '#03030a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Background stars
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 137.5 * 7.3) % W + W) % W;
      const sy = ((i * 97.3 * 5.1) % H + H) % H;
      const sr = 0.5 + (i * 0.13) % 1;
      ctx.fillStyle = `rgba(226,232,240,${0.2 + (i * 0.07) % 0.5})`;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    }

    // Sun
    const sunGrd = ctx.createRadialGradient(CX, CY, 0, CX, CY, 30);
    sunGrd.addColorStop(0, '#fff7c0'); sunGrd.addColorStop(0.5, '#fbbf24');
    sunGrd.addColorStop(1, '#f97316aa');
    ctx.fillStyle = sunGrd; ctx.beginPath();
    ctx.arc(CX, CY, 20, 0, Math.PI * 2); ctx.fill();

    PLANETS.forEach(p => {
      const orbitR = p.a * AU_PX;
      // Orbit ring
      ctx.strokeStyle = 'rgba(148,163,184,0.12)';
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(CX, CY, orbitR, 0, Math.PI * 2); ctx.stroke();

      // Kepler: angle = 2π * t / period; Venus goes retrograde
      const dir = p.retrograde ? -1 : 1;
      const angle = dir * (t / p.period) * 2 * Math.PI;
      const px = CX + Math.cos(angle) * orbitR;
      const py = CY + Math.sin(angle) * orbitR;

      // Glow
      const grd = ctx.createRadialGradient(px, py, 0, px, py, p.r + 6);
      grd.addColorStop(0, p.color + 'cc'); grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd; ctx.beginPath();
      ctx.arc(px, py, p.r + 6, 0, Math.PI * 2); ctx.fill();

      // Planet body
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();

      // Saturn rings
      if (p.rings) {
        ctx.strokeStyle = '#fde68a99'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(px, py, p.r + 8, p.r * 0.35, 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Uranus tilt indicator
      if (p.tilt) {
        ctx.strokeStyle = '#67e8f980'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px - p.r, py + p.r); ctx.lineTo(px + p.r, py - p.r);
        ctx.stroke();
      }

      // Label when hovered or for key planets
      const label = p.name === 'Earth' || p.name === 'Saturn' ||
        p.name === 'Jupiter' || hovered === p.name;
      if (label) {
        ctx.fillStyle = p.color;
        ctx.font = `${hovered === p.name ? 'bold ' : ''}11px system-ui`;
        ctx.fillText(p.name, px + p.r + 4, py - 4);
      }

      // Venus retrograde indicator
      if (p.retrograde) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '9px system-ui';
        ctx.fillText('↺', px - 4, py - p.r - 6);
      }
    });

    // Legend
    ctx.fillStyle = 'rgba(13,13,43,0.85)';
    ctx.beginPath(); ctx.roundRect?.(8, 8, 160, 72, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(124,58,237,0.3)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px system-ui';
    ctx.fillText('↺ Venus rotates backward', 14, 24);
    ctx.fillText('↗ Uranus tilt ≈ 98°', 14, 40);
    ctx.fillText(`Speed: ${speed.toFixed(1)}×`, 14, 56);
    ctx.fillText('Not to scale (distances)', 14, 70);

    rafRef.current = requestAnimationFrame(draw);
  }, [speed, hovered]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const t = tRef.current;
    let found: string | null = null;
    PLANETS.forEach(p => {
      const dir = p.retrograde ? -1 : 1;
      const angle = dir * (t / p.period) * 2 * Math.PI;
      const px = CX + Math.cos(angle) * p.a * AU_PX;
      const py = CY + Math.sin(angle) * p.a * AU_PX;
      const d = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (d < p.r + 8) found = p.name;
    });
    setHovered(found);
  }

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ color: '#fb923c', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Solar System Orbital Animation
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Kepler's 3rd law: P² ∝ a³ — outer planets orbit slower. Hover to identify planets.
        </p>
      </div>
      <canvas
        ref={canvasRef} width={W} height={H}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)}
        style={{ width: '100%', borderRadius: '14px',
          border: '1px solid rgba(251,146,60,0.2)', cursor: 'crosshair', display: 'block' }}
      />
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(251,146,60,0.2)' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
          Simulation speed: {speed.toFixed(1)}×
        </label>
        <input type="range" min="0.2" max="5" step="0.2" value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#fb923c' }} />
      </div>
    </div>
  );
}
