'use client';
import { useRef, useEffect, useState } from 'react';
import type { InteractiveProps } from '@/types';

function tempToRGB(T: number): string {
  if (T > 25000) return '#9bb4ff';
  if (T > 15000) return '#aabfff';
  if (T > 10000) return '#cad7ff';
  if (T > 7500)  return '#e4e9ff';
  if (T > 6000)  return '#fff9f0';
  if (T > 5000)  return '#ffd2a1';
  if (T > 4000)  return '#ffb56c';
  return '#ff8040';
}

export default function BlackbodySlider(_: InteractiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [T, setT] = useState(5778);
  const W = 600, H = 220;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#03030a'; ctx.fillRect(0, 0, W, H);

    const PAD = { l: 60, r: 20, t: 20, b: 40 };
    const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
    const λMin = 100, λMax = 2500;

    // Grid
    ctx.strokeStyle = 'rgba(148,163,184,0.1)'; ctx.lineWidth = 0.5;
    [500, 1000, 1500, 2000].forEach(λ => {
      const x = PAD.l + ((λ - λMin) / (λMax - λMin)) * pw;
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, H - PAD.b); ctx.stroke();
    });

    // Planck function (proportional, not exact)
    function planck(λnm: number, Tk: number) {
      const λm = λnm * 1e-9;
      const h = 6.626e-34, c = 3e8, k = 1.381e-23;
      return (2 * h * c * c) / (λm ** 5 * (Math.exp((h * c) / (λm * k * Tk)) - 1));
    }

    const values: { x: number; y: number; λ: number }[] = [];
    for (let λ = λMin; λ <= λMax; λ += 5) {
      const I = planck(λ, T);
      values.push({ x: PAD.l + ((λ - λMin) / (λMax - λMin)) * pw, y: I, λ });
    }
    const maxI = Math.max(...values.map(v => v.y));

    // Fill under curve with gradient matching wavelength color
    ctx.beginPath();
    values.forEach((v, i) => {
      const y = H - PAD.b - (v.y / maxI) * ph;
      i === 0 ? ctx.moveTo(v.x, H - PAD.b) : null;
      ctx.lineTo(v.x, y);
    });
    ctx.lineTo(values[values.length - 1].x, H - PAD.b);
    ctx.closePath();

    const grad = ctx.createLinearGradient(PAD.l, 0, W - PAD.r, 0);
    grad.addColorStop(0, 'rgba(120,120,255,0.6)');
    grad.addColorStop(0.3, 'rgba(255,255,200,0.4)');
    grad.addColorStop(0.6, 'rgba(255,180,80,0.4)');
    grad.addColorStop(1, 'rgba(255,60,20,0.3)');
    ctx.fillStyle = grad; ctx.fill();

    // Curve line
    ctx.strokeStyle = tempToRGB(T); ctx.lineWidth = 2.5;
    ctx.beginPath();
    values.forEach((v, i) => {
      const y = H - PAD.b - (v.y / maxI) * ph;
      i === 0 ? ctx.moveTo(v.x, y) : ctx.lineTo(v.x, y);
    });
    ctx.stroke();

    // Wien's law peak
    const λPeak = 2.898e6 / T; // nm
    const xPeak = PAD.l + ((λPeak - λMin) / (λMax - λMin)) * pw;
    if (xPeak > PAD.l && xPeak < W - PAD.r) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(xPeak, PAD.t); ctx.lineTo(xPeak, H - PAD.b); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`λ_peak = ${Math.round(λPeak)} nm`, xPeak, PAD.t - 6);
    }

    // Visible light range
    const xVis1 = PAD.l + ((380 - λMin) / (λMax - λMin)) * pw;
    const xVis2 = PAD.l + ((700 - λMin) / (λMax - λMin)) * pw;
    ctx.fillStyle = 'rgba(150,255,150,0.08)';
    ctx.fillRect(xVis1, PAD.t, xVis2 - xVis1, ph);
    ctx.fillStyle = '#86efac'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Visible', (xVis1 + xVis2) / 2, H - PAD.b - 4);

    // Axes
    ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, H - PAD.b);
    ctx.lineTo(W - PAD.r, H - PAD.b); ctx.stroke();

    ctx.fillStyle = '#64748b'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
    [500, 1000, 1500, 2000].forEach(λ => {
      const x = PAD.l + ((λ - λMin) / (λMax - λMin)) * pw;
      ctx.fillText(`${λ} nm`, x, H - PAD.b + 14);
    });
    ctx.fillText('Wavelength (nm)', PAD.l + pw / 2, H - 4);

    ctx.save(); ctx.translate(12, H / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Intensity', 0, 0); ctx.restore();

  }, [T]);

  const starType = T > 20000 ? 'O-type (blue)' : T > 10000 ? 'B-type (blue-white)' :
    T > 7500 ? 'A-type (white)' : T > 6000 ? 'F-type (yellow-white)' :
    T > 5200 ? 'G-type (yellow) like Sun' : T > 3700 ? 'K-type (orange)' : 'M-type (red)';

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Blackbody Radiation & Wien's Law
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Drag the temperature slider. Wien's Law: λ_peak = 2.898 × 10⁶ nm·K / T
        </p>
      </div>

      <canvas ref={canvasRef} width={W} height={H}
        style={{ width: '100%', borderRadius: '12px',
          border: '1px solid rgba(245,158,11,0.2)', display: 'block' }} />

      <div style={{ marginTop: '14px', padding: '16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%',
              background: tempToRGB(T),
              boxShadow: `0 0 12px ${tempToRGB(T)}` }} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: tempToRGB(T) }}>
                T = {T.toLocaleString()} K
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{starType}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#e2e8f0' }}>
              λ_peak = {Math.round(2898000 / T)} nm
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Wien's Law</div>
          </div>
        </div>
        <input type="range" min="1000" max="40000" step="100" value={T}
          onChange={e => setT(Number(e.target.value))}
          style={{ width: '100%', accentColor: tempToRGB(T) }} />
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: '11px', color: '#475569', marginTop: '4px' }}>
          <span>1,000 K (cool/red)</span>
          <span>Sun: 5,778 K</span>
          <span>40,000 K (hot/blue)</span>
        </div>
      </div>

      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '10px' }}>
        <div style={{ padding: '12px', borderRadius: '8px',
          background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>
            Wien's Law
          </div>
          <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'monospace' }}>
            λ_peak · T = 2.898 × 10⁶ nm·K
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Hotter star → peak shifts to shorter λ → appears bluer
          </div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px',
          background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 700 }}>
            Stefan-Boltzmann
          </div>
          <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'monospace' }}>
            L ∝ R² · T⁴
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            Luminosity scales very steeply with temperature — T doubles → L × 16
          </div>
        </div>
      </div>
    </div>
  );
}
