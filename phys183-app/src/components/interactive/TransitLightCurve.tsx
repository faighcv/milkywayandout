'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { InteractiveProps } from '@/types';

export default function TransitLightCurve(_: InteractiveProps) {
  const topRef = useRef<HTMLCanvasElement>(null);
  const plotRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [planetSize, setPlanetSize] = useState(0.12);  // fraction of star radius
  const [speed, setSpeed] = useState(0.4);
  const [isEdgeOn, setIsEdgeOn] = useState(true);
  const tRef = useRef(0);
  const W = 600, H1 = 200, H2 = 160;

  const HISTORY_LEN = 300;
  const histRef = useRef<number[]>(Array(HISTORY_LEN).fill(1));

  const draw = useCallback(() => {
    const c1 = topRef.current?.getContext('2d');
    const c2 = plotRef.current?.getContext('2d');
    if (!c1 || !c2) return;

    tRef.current = (tRef.current + speed * 0.003) % 1;
    const t = tRef.current;

    // ---- TOP CANVAS: star + planet ----
    c1.clearRect(0, 0, W, H1);
    const bg1 = c1.createLinearGradient(0, 0, 0, H1);
    bg1.addColorStop(0, '#03030a'); bg1.addColorStop(1, '#060614');
    c1.fillStyle = bg1; c1.fillRect(0, 0, W, H1);

    const starX = W / 2, starY = H1 / 2, starR = 60;
    const planetR = starR * planetSize;
    const orbitA = 200, orbitB = isEdgeOn ? 14 : 60;
    const pX = starX + Math.cos(t * 2 * Math.PI) * orbitA;
    const pY = starY + Math.sin(t * 2 * Math.PI) * orbitB;

    // Star glow
    const grd = c1.createRadialGradient(starX, starY, 0, starX, starY, starR + 20);
    grd.addColorStop(0, '#fff8e1'); grd.addColorStop(0.6, '#fbbf24aa');
    grd.addColorStop(1, 'transparent');
    c1.fillStyle = grd; c1.beginPath();
    c1.arc(starX, starY, starR + 20, 0, Math.PI * 2); c1.fill();

    // Star body
    c1.fillStyle = '#fbbf24';
    c1.beginPath(); c1.arc(starX, starY, starR, 0, Math.PI * 2); c1.fill();

    // Behind-star depth: draw orbit dashes
    c1.strokeStyle = 'rgba(148,163,184,0.12)';
    c1.lineWidth = 1; c1.setLineDash([4, 4]);
    c1.beginPath();
    c1.ellipse(starX, starY, orbitA, orbitB, 0, 0, Math.PI * 2);
    c1.stroke(); c1.setLineDash([]);

    // Compute overlap (transit dip)
    const dx = pX - starX, dy = pY - starY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let brightness = 1;
    const isBehind = Math.sin(t * 2 * Math.PI) > 0;
    if (!isBehind && dist < starR + planetR) {
      const overlap = Math.max(0, Math.min(1, (starR + planetR - dist) / (2 * planetR)));
      const area = Math.PI * planetR * planetR;
      const starArea = Math.PI * starR * starR;
      brightness = 1 - overlap * (area / starArea);
    }

    // Draw planet (in front when sin < 0)
    if (!isBehind) {
      c1.fillStyle = '#1e293b';
      c1.beginPath(); c1.arc(pX, pY, planetR, 0, Math.PI * 2); c1.fill();
      c1.strokeStyle = '#475569'; c1.lineWidth = 1; c1.stroke();
    }

    // Star dim overlay during transit
    if (brightness < 1) {
      c1.fillStyle = `rgba(3,3,10,${(1 - brightness) * 0.3})`;
      c1.beginPath(); c1.arc(starX, starY, starR, 0, Math.PI * 2); c1.fill();
    }

    // Draw planet behind star
    if (isBehind) {
      c1.fillStyle = '#1e293b88';
      c1.beginPath(); c1.arc(pX, pY, planetR, 0, Math.PI * 2); c1.fill();
    }

    // Brightness display
    c1.fillStyle = '#e2e8f0';
    c1.font = '12px system-ui';
    c1.fillText(`Relative brightness: ${brightness.toFixed(4)}`, 16, 24);
    if (!isEdgeOn) {
      c1.fillStyle = '#f59e0b';
      c1.fillText('⚠ Not edge-on: no transit visible', 16, 42);
    }

    // ---- BOTTOM CANVAS: light curve ----
    histRef.current.push(brightness);
    if (histRef.current.length > HISTORY_LEN) histRef.current.shift();

    c2.clearRect(0, 0, W, H2);
    const bg2 = c2.createLinearGradient(0, 0, 0, H2);
    bg2.addColorStop(0, '#03030a'); bg2.addColorStop(1, '#060614');
    c2.fillStyle = bg2; c2.fillRect(0, 0, W, H2);

    const pad = { l: 50, r: 20, t: 20, b: 30 };
    const pw = W - pad.l - pad.r, ph = H2 - pad.t - pad.b;

    c2.strokeStyle = 'rgba(148,163,184,0.15)'; c2.lineWidth = 0.5;
    [0.96, 0.97, 0.98, 0.99, 1.0].forEach(v => {
      const y = pad.t + ph * (1 - (v - 0.94) / 0.07);
      c2.beginPath(); c2.moveTo(pad.l, y); c2.lineTo(W - pad.r, y); c2.stroke();
      c2.fillStyle = '#475569'; c2.font = '9px system-ui';
      c2.fillText(v.toFixed(2), pad.l - 28, y + 3);
    });

    // Light curve line
    c2.strokeStyle = '#fbbf24'; c2.lineWidth = 2;
    c2.beginPath();
    histRef.current.forEach((b, i) => {
      const x = pad.l + (i / HISTORY_LEN) * pw;
      const y = pad.t + ph * (1 - Math.max(0, (b - 0.94) / 0.07));
      i === 0 ? c2.moveTo(x, y) : c2.lineTo(x, y);
    });
    c2.stroke();

    // Labels
    c2.fillStyle = '#94a3b8'; c2.font = '11px system-ui';
    c2.fillText('Relative Brightness', pad.l - 45, pad.t + ph / 2);
    c2.fillText('← Time →', pad.l + pw / 2 - 20, H2 - 6);
    c2.fillStyle = '#64748b'; c2.font = '10px system-ui';
    c2.fillText('Light Curve', W - pad.r - 60, pad.t + 10);

    rafRef.current = requestAnimationFrame(draw);
  }, [planetSize, speed, isEdgeOn]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Transit Light Curve Simulator
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Watch how a planet crossing in front of its star creates a detectable brightness dip.
        </p>
      </div>

      <canvas ref={topRef} width={W} height={H1}
        style={{ width: '100%', borderRadius: '12px 12px 0 0',
          border: '1px solid rgba(96,165,250,0.2)', display: 'block' }} />
      <canvas ref={plotRef} width={W} height={H2}
        style={{ width: '100%', borderRadius: '0 0 12px 12px',
          border: '1px solid rgba(96,165,250,0.2)', borderTop: 'none', display: 'block' }} />

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        marginTop: '14px', padding: '16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(96,165,250,0.2)' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Planet size: {(planetSize * 100).toFixed(0)}% of star radius
            {planetSize > 0.1 && <span style={{ color: '#f59e0b' }}> (detectable!)</span>}
          </label>
          <input type="range" min="0.02" max="0.25" step="0.01"
            value={planetSize} onChange={e => setPlanetSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#60a5fa' }} />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Orbital speed: {speed.toFixed(1)}×
          </label>
          <input type="range" min="0.1" max="2" step="0.1"
            value={speed} onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#60a5fa' }} />
        </div>
        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer', color: '#94a3b8', fontSize: '13px' }}>
            <input type="checkbox" checked={isEdgeOn}
              onChange={e => setIsEdgeOn(e.target.checked)}
              style={{ accentColor: '#60a5fa', width: '16px', height: '16px' }} />
            Edge-on geometry (required for transits)
          </label>
          <span style={{ fontSize: '12px', color: '#475569', marginLeft: 'auto' }}>
            Transit depth ≈ (R_planet/R_star)²
          </span>
        </div>
      </div>
    </div>
  );
}
