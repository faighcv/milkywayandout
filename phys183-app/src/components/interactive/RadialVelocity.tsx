'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { InteractiveProps } from '@/types';

export default function RadialVelocity(_: InteractiveProps) {
  const topRef = useRef<HTMLCanvasElement>(null);
  const plotRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const [planetMass, setPlanetMass] = useState(1);
  const [speed, setSpeed] = useState(1);
  const W = 600, H1 = 200, H2 = 140;

  const draw = useCallback(() => {
    const c1 = topRef.current?.getContext('2d');
    const c2 = plotRef.current?.getContext('2d');
    if (!c1 || !c2) return;
    tRef.current = (tRef.current + speed * 0.004) % 1;
    const t = tRef.current;
    const angle = t * 2 * Math.PI;
    const mass = planetMass;

    // Amplitude of star wobble
    const A = 20 * mass;
    const starX = W / 2 + Math.cos(angle + Math.PI) * A;
    const starY = H1 / 2 + Math.sin(angle + Math.PI) * A * 0.3;
    const planetX = W / 2 + Math.cos(angle) * 180;
    const planetY = H1 / 2 + Math.sin(angle) * 50;
    const starVx = -Math.sin(angle) * A;

    // ---- TOP CANVAS ----
    c1.clearRect(0, 0, W, H1);
    c1.fillStyle = '#03030a'; c1.fillRect(0, 0, W, H1);

    // Orbit guides
    c1.strokeStyle = 'rgba(148,163,184,0.08)'; c1.lineWidth = 1;
    c1.beginPath(); c1.ellipse(W/2, H1/2, A, A*0.3, 0, 0, Math.PI*2); c1.stroke();
    c1.beginPath(); c1.ellipse(W/2, H1/2, 180, 50, 0, 0, Math.PI*2); c1.stroke();

    // Center of mass marker
    c1.fillStyle = '#475569';
    c1.beginPath(); c1.arc(W/2, H1/2, 3, 0, Math.PI*2); c1.fill();
    c1.fillStyle = '#475569'; c1.font = '10px system-ui';
    c1.fillText('COM', W/2 + 6, H1/2 + 4);

    // Star glow
    const sg = c1.createRadialGradient(starX, starY, 0, starX, starY, 22);
    sg.addColorStop(0, '#fff8e1'); sg.addColorStop(0.5, '#fbbf24aa'); sg.addColorStop(1, 'transparent');
    c1.fillStyle = sg; c1.beginPath(); c1.arc(starX, starY, 28, 0, Math.PI*2); c1.fill();
    c1.fillStyle = '#fbbf24'; c1.beginPath(); c1.arc(starX, starY, 16, 0, Math.PI*2); c1.fill();

    // Planet
    c1.fillStyle = '#60a5fa';
    c1.beginPath(); c1.arc(planetX, planetY, 8 + mass * 4, 0, Math.PI*2); c1.fill();

    // Doppler line indicator
    const dopplerColor = starVx < 0 ? '#ef4444' : '#60a5fa';
    c1.fillStyle = dopplerColor; c1.font = 'bold 12px system-ui';
    c1.fillText(starVx < -2 ? '← blueshifted (approaching us)' : starVx > 2 ? '→ redshifted (receding)' : 'minimal shift', 16, 24);

    // Spectral line
    const lineCenter = 300;
    const shift = starVx * 0.8;
    c1.fillStyle = '#1e1e3a'; c1.fillRect(16, 32, W - 32, 14);
    c1.fillStyle = dopplerColor;
    c1.fillRect(lineCenter + shift, 33, 3, 12);
    c1.strokeStyle = 'rgba(255,255,255,0.3)'; c1.lineWidth = 0.5;
    c1.beginPath(); c1.moveTo(lineCenter, 33); c1.lineTo(lineCenter, 45); c1.stroke();
    c1.fillStyle = '#64748b'; c1.font = '9px system-ui';
    c1.fillText('rest position', lineCenter - 20, 57);

    // ---- BOTTOM CANVAS: radial velocity curve ----
    c2.clearRect(0, 0, W, H2);
    c2.fillStyle = '#03030a'; c2.fillRect(0, 0, W, H2);
    const pad = { l: 50, r: 20, t: 15, b: 30 };
    const pw = W - pad.l - pad.r, ph = H2 - pad.t - pad.b;

    c2.strokeStyle = 'rgba(148,163,184,0.1)'; c2.lineWidth = 0.5;
    const maxV = A * 5;
    [-1, 0, 1].forEach(frac => {
      const y = pad.t + ph/2 - frac * ph/2;
      c2.beginPath(); c2.moveTo(pad.l, y); c2.lineTo(W - pad.r, y); c2.stroke();
      c2.fillStyle = '#475569'; c2.font = '9px system-ui'; c2.textAlign = 'right';
      c2.fillText(frac === 0 ? '0' : `${frac > 0 ? '+' : ''}${Math.round(frac * maxV)}`, pad.l - 4, y + 3);
    });

    c2.strokeStyle = '#fbbf24'; c2.lineWidth = 2;
    c2.beginPath();
    for (let i = 0; i <= HISTORY_LEN; i++) {
      const tt = (t - i/HISTORY_LEN + 1) % 1;
      const vx = -Math.sin(tt * 2 * Math.PI) * A * 5;
      const x = pad.l + ((HISTORY_LEN - i) / HISTORY_LEN) * pw;
      const y = pad.t + ph/2 - (vx / maxV) * ph/2;
      i === 0 ? c2.moveTo(x, y) : c2.lineTo(x, y);
    }
    c2.stroke();

    // Current position dot
    const cy = pad.t + ph/2 - (-Math.sin(angle) * A * 5 / maxV) * ph/2;
    c2.fillStyle = '#ef4444'; c2.beginPath();
    c2.arc(W - pad.r, cy, 5, 0, Math.PI*2); c2.fill();

    c2.fillStyle = '#94a3b8'; c2.font = '11px system-ui'; c2.textAlign = 'center';
    c2.fillText('Radial Velocity', pad.l + pw/2, H2 - 6);

    rafRef.current = requestAnimationFrame(draw);
  }, [planetMass, speed]);

  const HISTORY_LEN = 200;

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ color: '#818cf8', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Radial Velocity Method
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          A planet makes its star wobble. This shifts spectral lines — a Doppler shift we can measure.
          Measures planet mass. Compare to transit method (measures planet size).
        </p>
      </div>
      <canvas ref={topRef} width={W} height={H1}
        style={{ width: '100%', borderRadius: '12px 12px 0 0',
          border: '1px solid rgba(129,140,248,0.2)', display: 'block' }} />
      <canvas ref={plotRef} width={W} height={H2}
        style={{ width: '100%', borderRadius: '0 0 12px 12px',
          border: '1px solid rgba(129,140,248,0.2)', borderTop: 'none', display: 'block' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        marginTop: '12px', padding: '14px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(129,140,248,0.2)' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Planet mass: {planetMass.toFixed(1)}× Jupiter
          </label>
          <input type="range" min="0.2" max="3" step="0.1" value={planetMass}
            onChange={e => setPlanetMass(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#818cf8' }} />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
            Speed: {speed.toFixed(1)}×
          </label>
          <input type="range" min="0.2" max="3" step="0.1" value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#818cf8' }} />
        </div>
      </div>
      <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px',
        background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
          <strong style={{ color: '#818cf8' }}>Selection effect:</strong> Massive planets close to
          their star cause bigger, faster wobbles → easier to detect. This is why many early
          exoplanet discoveries were "hot Jupiters."
        </p>
      </div>
    </div>
  );
}
