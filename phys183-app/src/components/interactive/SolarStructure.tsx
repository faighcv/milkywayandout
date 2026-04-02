'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

const LAYERS = [
  { name: 'Core', r: 50, color: '#ef4444', desc: 'T ~ 15 million K. Nuclear fusion occurs here: 4 protons → 1 helium nucleus + energy (E = mc²). Proton-proton chain is the dominant fusion mechanism in the Sun.' },
  { name: 'Radiative Zone', r: 88, color: '#f97316', desc: 'Energy moves outward by radiation — photons are constantly absorbed and re-emitted. A single photon\'s "random walk" out takes ~100,000 years!' },
  { name: 'Convective Zone', r: 118, color: '#fbbf24', desc: 'Hot plasma rises, cools at surface, sinks back — like boiling water. Convection cells visible as "granulation" on the photosphere.' },
  { name: 'Photosphere', r: 130, color: '#fde68a', desc: 'The visible surface. T ~ 5,778 K. Sunspots form here — dark, cooler regions (~3,800 K) caused by strong magnetic fields inhibiting convection.' },
  { name: 'Chromosphere', r: 140, color: '#fb923c', desc: 'T increases outward (paradoxically). Site of solar flares and prominences. Visible during eclipses as a red rim.' },
  { name: 'Corona', r: 160, color: '#fcd34d', desc: 'T > 1 million K — much hotter than photosphere. Extends millions of km. Source of the solar wind. Visible during total solar eclipses.' },
];

export default function SolarStructure(_: InteractiveProps) {
  const [active, setActive] = useState<typeof LAYERS[0] | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#fbbf24', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Solar Interior & Structure
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Click any layer of the Sun to learn about it. Hydrostatic equilibrium keeps it stable.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* SVG Sun cross-section */}
        <svg width="280" height="280" viewBox="-10 -10 300 300">
          <defs>
            <radialGradient id="sunbg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#0d0d2b" />
            </radialGradient>
          </defs>
          <circle cx="140" cy="140" r="165" fill="#03030a" />
          {[...LAYERS].reverse().map(l => (
            <circle key={l.name} cx="140" cy="140" r={l.r}
              fill={`${l.color}${active?.name === l.name ? '55' : '22'}`}
              stroke={l.color}
              strokeWidth={active?.name === l.name ? 2 : 0.8}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setActive(active?.name === l.name ? null : l)} />
          ))}
          {/* Cut line */}
          <line x1="140" y1="0" x2="140" y2="280" stroke="rgba(148,163,184,0.25)"
            strokeWidth="1" strokeDasharray="4 4" />
          <rect x="140" y="0" width="150" height="280" fill="#03030a" opacity="0.6" />
          {/* Labels */}
          {LAYERS.map(l => (
            <g key={l.name} style={{ cursor: 'pointer' }}
              onClick={() => setActive(active?.name === l.name ? null : l)}>
              <line x1={140 - l.r + 4} y1="140" x2={140 - l.r - 16} y2="140"
                stroke={l.color} strokeWidth="0.7" />
              <text x={140 - l.r - 20} y="144"
                textAnchor="end" fill={l.color} fontSize="8" fontWeight="bold">
                {l.name}
              </text>
            </g>
          ))}
          <text x="142" y="10" fill="#64748b" fontSize="8">Cross-section</text>
        </svg>

        {/* Info panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {active ? (
            <div style={{ padding: '16px', borderRadius: '12px',
              background: `${active.color}15`, border: `1px solid ${active.color}40` }}>
              <h4 style={{ margin: '0 0 8px', color: active.color, fontSize: '16px' }}>
                {active.name}
              </h4>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
                {active.desc}
              </p>
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '12px',
              background: 'rgba(13,13,43,0.5)', border: '1px dashed rgba(148,163,184,0.2)',
              color: '#475569', fontSize: '14px', textAlign: 'center' }}>
              ← Click a layer to explore
            </div>
          )}

          <div style={{ padding: '12px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#fca5a5', lineHeight: '1.6' }}>
              <strong style={{ color: '#f87171' }}>Hydrostatic Equilibrium:</strong> The Sun doesn't
              collapse because outward pressure (from fusion energy) exactly balances inward gravity.
              If fusion stops → collapses. If too much pressure → expands. A feedback loop maintains
              stability over billions of years.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px',
            background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#fde68a', lineHeight: '1.6' }}>
              <strong style={{ color: '#fbbf24' }}>Solar Neutrino Problem (solved!):</strong> Theory
              predicted far more neutrinos from the Sun than detected. Solution: neutrino oscillation —
              electron neutrinos transform into other flavors (muon, tau) which were not detected.
              Now confirmed by SNO experiment.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px',
            background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#c4b5fd', lineHeight: '1.6' }}>
              <strong style={{ color: '#a78bfa' }}>Differential Rotation:</strong> The equator rotates
              faster than the poles (~25 days vs ~35 days). This winds up and tangles the magnetic field,
              creating sunspots, flares, and coronal mass ejections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
