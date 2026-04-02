'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

const REGIONS = [
  { name: 'Radio', λ: '> 1 m', f: '< 300 MHz', E: 'lowest', example: 'Radio telescopes, cell signals', color: '#6366f1', x: 0 },
  { name: 'Microwave', λ: '1mm – 1m', f: '300 MHz – 300 GHz', E: 'very low', example: 'CMB observations, radar', color: '#8b5cf6', x: 1 },
  { name: 'Infrared', λ: '700nm – 1mm', f: '300 GHz – 430 THz', E: 'low', example: 'Heat signatures, Spitzer telescope', color: '#f97316', x: 2 },
  { name: 'Visible', λ: '380–700 nm', f: '430–750 THz', E: 'medium', example: 'Human eyes, optical telescopes', color: 'rainbow', x: 3 },
  { name: 'Ultraviolet', λ: '10–380 nm', f: '750 THz – 30 PHz', E: 'high', example: 'Hot star emission, ionization', color: '#a855f7', x: 4 },
  { name: 'X-ray', λ: '0.01–10 nm', f: '30 PHz – 30 EHz', E: 'very high', example: 'Black holes, neutron stars, Chandra', color: '#06b6d4', x: 5 },
  { name: 'Gamma', λ: '< 0.01 nm', f: '> 30 EHz', E: 'highest', example: 'Nuclear reactions, supernovae', color: '#10b981', x: 6 },
];

const VISIBLE = [
  { color: '#ff0000', name: 'Red', λ: '700 nm' },
  { color: '#ff7700', name: 'Orange', λ: '610 nm' },
  { color: '#ffff00', name: 'Yellow', λ: '570 nm' },
  { color: '#00ff00', name: 'Green', λ: '530 nm' },
  { color: '#0000ff', name: 'Blue', λ: '470 nm' },
  { color: '#8800ff', name: 'Violet', λ: '420 nm' },
];

export default function EMSpectrumExplorer(_: InteractiveProps) {
  const [active, setActive] = useState<typeof REGIONS[0] | null>(null);
  const [showAbsorption, setShowAbsorption] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Electromagnetic Spectrum Explorer
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Click any region to explore. Higher frequency = shorter wavelength = more energy (E = hf = hc/λ).
        </p>
      </div>

      {/* Main spectrum bar */}
      <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden',
        height: '80px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {REGIONS.map(r => (
          <button
            key={r.name}
            onClick={() => setActive(active?.name === r.name ? null : r)}
            style={{
              flex: 1, border: 'none', cursor: 'pointer', position: 'relative',
              background: r.color === 'rainbow'
                ? 'linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8800ff)'
                : r.color,
              opacity: active && active.name !== r.name ? 0.5 : 1,
              transition: 'all 0.2s',
              outline: active?.name === r.name ? '3px solid white' : 'none',
            }}
          >
            <span style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '11px', fontWeight: 700,
              color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              flexDirection: 'column', gap: '2px',
            }}>
              {r.name}
            </span>
          </button>
        ))}
      </div>

      {/* Energy arrow */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px',
        fontSize: '12px', color: '#64748b' }}>
        <span>← lower energy / longer wavelength / lower frequency</span>
        <span>higher energy / shorter wavelength / higher frequency →</span>
      </div>

      {/* Active region info */}
      {active && (
        <div style={{ padding: '20px', borderRadius: '12px', marginBottom: '16px',
          background: `${active.color === 'rainbow' ? '#fbbf24' : active.color}18`,
          border: `1px solid ${active.color === 'rainbow' ? '#fbbf24' : active.color}40` }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px',
            color: active.color === 'rainbow' ? '#fbbf24' : active.color }}>
            {active.name} Radiation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Wavelength', value: active.λ },
              { label: 'Frequency', value: active.f },
              { label: 'Energy', value: active.E },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '12px', borderRadius: '8px',
                background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </div>
                <div style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px',
            background: 'rgba(13,13,43,0.5)' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Astronomical example: </span>
            <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{active.example}</span>
          </div>
        </div>
      )}

      {/* Visible light breakdown */}
      <div style={{ padding: '16px', borderRadius: '12px',
        background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
        <h4 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, margin: '0 0 12px' }}>
          🌈 Visible Light Colors (ROYGBV)
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {VISIBLE.map(v => (
            <div key={v.name} style={{ padding: '8px 12px', borderRadius: '8px',
              background: v.color + '22', border: `1px solid ${v.color}60`,
              textAlign: 'center', minWidth: '80px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%',
                background: v.color, margin: '0 auto 4px',
                boxShadow: `0 0 8px ${v.color}` }} />
              <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{v.λ}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#64748b', fontSize: '12px', margin: '12px 0 0' }}>
          Red = longest wavelength, lowest energy visible. Violet = shortest, highest energy.
          Wien's law: hotter stars peak at shorter wavelengths → appear bluer.
        </p>
      </div>

      {/* Emission/Absorption toggle */}
      <div style={{ marginTop: '14px', padding: '16px', borderRadius: '12px',
        background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '12px' }}>
          <h4 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, margin: 0 }}>
            Spectra Types
          </h4>
          <button onClick={() => setShowAbsorption(s => !s)} style={{
            padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: '12px',
            cursor: 'pointer', fontWeight: 600 }}>
            Toggle {showAbsorption ? 'Emission' : 'Absorption'}
          </button>
        </div>
        {showAbsorption ? (
          <div>
            <div style={{ height: '40px', background: 'linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8800ff)',
              borderRadius: '6px', position: 'relative', marginBottom: '8px' }}>
              {[15, 30, 50, 70, 85].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', top: 0, bottom: 0,
                  left: `${pos}%`, width: '3px', background: 'black' }} />
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
              Absorption spectrum: cool gas in front of a hot source absorbs specific wavelengths
              (dark lines = element fingerprints)
            </p>
          </div>
        ) : (
          <div>
            <div style={{ height: '40px', background: '#1a1a2e', borderRadius: '6px',
              position: 'relative', marginBottom: '8px' }}>
              {[
                { pos: 15, c: '#ff4444' }, { pos: 30, c: '#ffaa00' },
                { pos: 50, c: '#44ff44' }, { pos: 70, c: '#4444ff' }, { pos: 85, c: '#aa44ff' }
              ].map(({ pos, c }, i) => (
                <div key={i} style={{ position: 'absolute', top: 0, bottom: 0,
                  left: `${pos}%`, width: '3px', background: c,
                  boxShadow: `0 0 4px ${c}` }} />
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
              Emission spectrum: hot gas emits light at specific wavelengths only
              (bright lines = element fingerprints — each element has a unique pattern)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
