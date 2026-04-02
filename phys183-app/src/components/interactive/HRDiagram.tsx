'use client';
import { useRef, useEffect, useState } from 'react';
import type { InteractiveProps } from '@/types';

const STARS = [
  // Main Sequence
  { name: 'Rigel',        T: 12100, L: 120000, type: 'Supergiant' },
  { name: 'Spica',        T: 25300, L: 12000,  type: 'Main Seq' },
  { name: 'Sirius A',     T: 9940,  L: 25.4,   type: 'Main Seq' },
  { name: 'Vega',         T: 9602,  L: 40,     type: 'Main Seq' },
  { name: 'Procyon A',    T: 6530,  L: 6.9,    type: 'Main Seq' },
  { name: 'Sun',          T: 5778,  L: 1,      type: 'Main Seq' },
  { name: 'α Cen A',      T: 5790,  L: 1.52,   type: 'Main Seq' },
  { name: 'α Cen B',      T: 5260,  L: 0.5,    type: 'Main Seq' },
  { name: '61 Cyg A',     T: 4526,  L: 0.15,   type: 'Main Seq' },
  { name: 'Barnard\'s',   T: 3134,  L: 0.0035, type: 'Main Seq' },
  { name: 'Proxima Cen',  T: 3042,  L: 0.0017, type: 'Main Seq' },
  { name: 'β Centauri',   T: 25000, L: 41700,  type: 'Main Seq' },
  { name: 'Bellatrix',    T: 22000, L: 6400,   type: 'Main Seq' },
  { name: 'Achernar',     T: 15000, L: 3150,   type: 'Main Seq' },
  { name: 'Altair',       T: 7550,  L: 11,     type: 'Main Seq' },
  // Giants
  { name: 'Arcturus',     T: 4286,  L: 215,    type: 'Giant' },
  { name: 'Aldebaran',    T: 3910,  L: 439,    type: 'Giant' },
  { name: 'Pollux',       T: 4865,  L: 32,     type: 'Giant' },
  { name: 'Capella A',    T: 4940,  L: 79,     type: 'Giant' },
  // Supergiants
  { name: 'Betelgeuse',   T: 3500,  L: 126000, type: 'Supergiant' },
  { name: 'Antares',      T: 3400,  L: 57500,  type: 'Supergiant' },
  { name: 'Deneb',        T: 8525,  L: 196000, type: 'Supergiant' },
  { name: 'Canopus',      T: 7350,  L: 10700,  type: 'Supergiant' },
  { name: 'Polaris',      T: 6015,  L: 2200,   type: 'Supergiant' },
  // White Dwarfs
  { name: 'Sirius B',     T: 25200, L: 0.026,  type: 'White Dwarf' },
  { name: 'Procyon B',    T: 7740,  L: 0.00049,type: 'White Dwarf' },
];

function tempToColor(T: number) {
  if (T > 30000) return '#9bb4ff';
  if (T > 20000) return '#aabfff';
  if (T > 10000) return '#cad7ff';
  if (T > 7500)  return '#e4e9ff';
  if (T > 6000)  return '#fff4ea';
  if (T > 5000)  return '#ffd2a1';
  if (T > 4000)  return '#ffb56c';
  return '#ff8800';
}

const TYPE_COLOR: Record<string, string> = {
  'Main Seq': '#7c3aed',
  'Giant': '#f59e0b',
  'Supergiant': '#ef4444',
  'White Dwarf': '#06b6d4',
};

export default function HRDiagram(_: InteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<typeof STARS[0] | null>(null);
  const [showRegions, setShowRegions] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  const W = 680, H = 480;
  const PAD = { left: 70, right: 20, top: 30, bottom: 60 };

  // Map T → x (reversed: hot left, cool right), log10 scale
  function mapT(T: number) {
    const tMin = Math.log10(2500), tMax = Math.log10(40000);
    const t = Math.log10(T);
    return PAD.left + ((tMax - t) / (tMax - tMin)) * (W - PAD.left - PAD.right);
  }
  // Map L → y (log10), bright top
  function mapL(L: number) {
    const lMin = -5, lMax = 6;
    const l = Math.log10(L);
    return H - PAD.bottom - ((l - lMin) / (lMax - lMin)) * (H - PAD.top - PAD.bottom);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#03030a');
    bg.addColorStop(1, '#060614');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(148,163,184,0.1)';
    ctx.lineWidth = 0.5;
    const Ts = [3000, 4000, 5000, 6000, 7000, 10000, 15000, 20000, 30000];
    Ts.forEach(T => {
      const x = mapT(T);
      ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, H - PAD.bottom); ctx.stroke();
    });
    const Ls = [-4,-3,-2,-1,0,1,2,3,4,5];
    Ls.forEach(l => {
      const y = mapL(Math.pow(10, l));
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
    });

    // Regions
    if (showRegions) {
      // Main Sequence band
      ctx.save();
      ctx.beginPath();
      // diagonal band from upper-left to lower-right
      ctx.moveTo(mapT(35000), mapL(500000));
      ctx.lineTo(mapT(35000), mapL(100000));
      ctx.lineTo(mapT(2800), mapL(0.0002));
      ctx.lineTo(mapT(2800), mapL(0.001));
      ctx.closePath();
      ctx.fillStyle = 'rgba(124,58,237,0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(124,58,237,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#a78bfa';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText('MAIN SEQUENCE', mapT(15000) - 10, mapL(800) - 8);
      ctx.restore();

      // Giants region
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(mapT(4500), mapL(80), 60, 40, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,158,11,0.08)';
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('GIANTS', mapT(4500) - 22, mapL(80) + 60);
      ctx.restore();

      // Supergiants
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(mapT(6000), mapL(50000), 90, 35, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239,68,68,0.07)';
      ctx.fill();
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('SUPERGIANTS', mapT(8000) - 20, mapL(80000) - 12);
      ctx.restore();

      // White dwarfs
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(mapT(16000), mapL(0.01), 65, 25, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,0.08)';
      ctx.fill();
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 11px system-ui';
      ctx.fillText('WHITE DWARFS', mapT(20000) - 30, mapL(0.0005) + 20);
      ctx.restore();
    }

    // Stars
    const shown = filter === 'All' ? STARS : STARS.filter(s => s.type === filter);
    shown.forEach(star => {
      const x = mapT(star.T);
      const y = mapL(star.L);
      const r = star.name === 'Sun' ? 7 : star.type === 'Supergiant' ? 6 : star.type === 'Giant' ? 5 :
        star.type === 'White Dwarf' ? 4 : 4;
      const col = tempToColor(star.T);

      // Glow
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r + 6);
      grd.addColorStop(0, col + 'cc');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.fill();

      // Star dot
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

      // Sun special label
      if (star.name === 'Sun') {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('☀ Sun', x + 10, y + 4);
      }

      // Hovered label
      if (hovered?.name === star.name) {
        ctx.fillStyle = 'rgba(13,13,43,0.95)';
        ctx.beginPath();
        ctx.roundRect?.(x + 10, y - 22, 130, 42, 6);
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = col;
        ctx.font = 'bold 11px system-ui';
        ctx.fillText(star.name, x + 16, y - 6);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px system-ui';
        ctx.fillText(`${star.T.toLocaleString()} K  |  ${star.L >= 1 ? star.L.toLocaleString() : star.L.toFixed(4)} L☉`, x + 16, y + 10);
      }
    });

    // Axes
    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.left, PAD.top); ctx.lineTo(PAD.left, H - PAD.bottom);
    ctx.lineTo(W - PAD.right, H - PAD.bottom);
    ctx.stroke();

    // X-axis labels (temperature)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    [30000, 20000, 10000, 6000, 4000, 3000].forEach(T => {
      const x = mapT(T);
      ctx.fillText(T.toLocaleString() + 'K', x, H - PAD.bottom + 16);
    });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui';
    ctx.fillText('← increasing temperature   Surface Temperature (K)   decreasing temperature →', W / 2, H - 8);

    // Y-axis labels (luminosity)
    ctx.textAlign = 'right';
    [-4,-2,0,1,2,3,4,5].forEach(l => {
      const y = mapL(Math.pow(10, l));
      const label = l === 0 ? '1 L☉' : l > 0 ? `10${superscript(l)}` : `10${superscript(l)}`;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui';
      ctx.fillText(label, PAD.left - 4, y + 4);
    });

    // Spectral classes bar
    const specTypes = [
      { label: 'O', T: 35000, color: '#9bb4ff' },
      { label: 'B', T: 20000, color: '#aabfff' },
      { label: 'A', T: 9000,  color: '#cad7ff' },
      { label: 'F', T: 7000,  color: '#f0f0ff' },
      { label: 'G', T: 5500,  color: '#fff4ea' },
      { label: 'K', T: 4500,  color: '#ffd2a1' },
      { label: 'M', T: 3200,  color: '#ff8800' },
    ];
    specTypes.forEach(({ label, T, color }) => {
      const x = mapT(T);
      ctx.fillStyle = color;
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, H - PAD.bottom + 32);
    });

  }, [hovered, showRegions, filter]);

  function superscript(n: number) {
    const map: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²',
      '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return String(n).split('').map(c => map[c] ?? c).join('');
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    let closest: typeof STARS[0] | null = null;
    let minDist = 20;
    STARS.forEach(star => {
      const x = mapT(star.T);
      const y = mapL(star.L);
      const d = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
      if (d < minDist) { minDist = d; closest = star; }
    });
    setHovered(closest);
  }

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap',
        alignItems: 'center' }}>
        <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
          🌟 Hertzsprung-Russell Diagram
        </span>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px',
          color: '#a78bfa', fontSize: '13px', cursor: 'pointer' }}>
          <input type="checkbox" checked={showRegions}
            onChange={e => setShowRegions(e.target.checked)}
            style={{ accentColor: '#7c3aed' }} />
          Show regions
        </label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '12px',
            background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(124,58,237,0.3)',
            color: '#e2e8f0', cursor: 'pointer' }}
        >
          {['All', 'Main Seq', 'Giant', 'Supergiant', 'White Dwarf'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <span style={{ color: '#475569', fontSize: '12px' }}>
          Hover over stars for details
        </span>
      </div>

      <canvas
        ref={canvasRef} width={W} height={H}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        style={{ width: '100%', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.2)',
          cursor: 'crosshair', display: 'block' }}
      />

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px',
        padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(124,58,237,0.15)' }}>
        {Object.entries(TYPE_COLOR).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%',
              background: color, boxShadow: `0 0 4px ${color}` }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{type}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#475569' }}>
          X-axis: Hot → Cool (left→right) | Y-axis: Faint → Bright (bottom→top) | Log scale
        </div>
      </div>
    </div>
  );
}
