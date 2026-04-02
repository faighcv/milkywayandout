'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

const LAYERS = [
  { name: 'Inner Core', r: 30, color: '#ef4444', desc: 'Solid iron-nickel ball, ~1200 km radius. Despite being hottest (>5000°C), pressure from above keeps it solid.' },
  { name: 'Outer Core', r: 55, color: '#f97316', desc: 'Liquid iron-nickel, ~2200 km thick. Convection here generates Earth\'s magnetic field.' },
  { name: 'Mantle', r: 115, color: '#a78bfa', desc: 'Hot silicate rock, ~2900 km thick. Behaves like a very slow fluid over millions of years. Drives plate tectonics.' },
  { name: 'Crust', r: 130, color: '#94a3b8', desc: 'Thin rocky outer shell, 5–70 km thick. Where we live! Oceanic crust: ~5 km. Continental crust: up to 70 km.' },
];

const PROCESSES = [
  { name: 'Impact Cratering', icon: '☄️', color: '#f59e0b', desc: 'Universal on all solid bodies. Older surfaces have more craters. Counting craters tells us the age of a surface. The Moon\'s surface is ancient and heavily cratered because it has no erosion.' },
  { name: 'Volcanism', icon: '🌋', color: '#ef4444', desc: 'Molten rock (magma) from the interior reaches the surface. Requires a hot interior. Smaller planets cool faster and lose volcanism sooner. Active on Earth, Io. Dead on the Moon and Mercury.' },
  { name: 'Tectonics', icon: '🏔️', color: '#3b82f6', desc: 'Movement of crustal plates driven by mantle convection. Builds mountains, creates ocean trenches. Only confirmed on Earth — requires a hot, active mantle. Mars has extinct volcanic structures but no plate tectonics.' },
  { name: 'Erosion', icon: '💧', color: '#06b6d4', desc: 'Wind and water wear down surface features. Requires an atmosphere. Earth and Titan have erosion. Mars had erosion in the past (ancient water). The Moon has none — so its craters are perfectly preserved.' },
];

export default function PlanetCutaway(_: InteractiveProps) {
  const [activeLayer, setActiveLayer] = useState<typeof LAYERS[0] | null>(null);
  const [activeProcess, setActiveProcess] = useState<typeof PROCESSES[0] | null>(null);

  const CX = 140, CY = 140;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#a16207', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Planetary Geology — Interior & Surface Processes
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Click layers to explore Earth's interior. Click processes to learn what shapes planetary surfaces.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* SVG cutaway */}
        <div>
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ width: '100%' }}>
            {/* Background */}
            <circle cx={CX} cy={CY} r="135" fill="#03030a" />
            {/* Layers (outer to inner, then clip right half) */}
            {[...LAYERS].reverse().map(l => (
              <circle key={l.name} cx={CX} cy={CY} r={l.r}
                fill={l.color + (activeLayer?.name === l.name ? 'cc' : '55')}
                stroke={l.color}
                strokeWidth={activeLayer?.name === l.name ? 2 : 0.5}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setActiveLayer(activeLayer?.name === l.name ? null : l)} />
            ))}
            {/* Clip right half to show cutaway */}
            <rect x={CX} y="0" width="140" height="280" fill="#03030a" opacity="0.7" />
            {/* Cut line */}
            <line x1={CX} y1="10" x2={CX} y2="270" stroke="rgba(148,163,184,0.4)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Layer labels on left side */}
            {LAYERS.map(l => (
              <g key={l.name} style={{ cursor: 'pointer' }} onClick={() => setActiveLayer(activeLayer?.name === l.name ? null : l)}>
                <line x1={CX - l.r + 5} y1={CY} x2={CX - l.r - 20} y2={CY} stroke={l.color} strokeWidth="0.8" />
                <text x={CX - l.r - 24} y={CY + 4}
                  textAnchor="end" fill={l.color} fontSize="9" fontWeight="bold">
                  {l.name}
                </text>
              </g>
            ))}

            <text x={CX + 4} y="20" fill="#64748b" fontSize="9">Cross-section</text>
          </svg>
        </div>

        {/* Layer info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeLayer ? (
            <div style={{ padding: '16px', borderRadius: '12px',
              background: `${activeLayer.color}15`,
              border: `1px solid ${activeLayer.color}40` }}>
              <h4 style={{ margin: '0 0 8px', color: activeLayer.color, fontSize: '16px' }}>
                {activeLayer.name}
              </h4>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
                {activeLayer.desc}
              </p>
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '12px',
              background: 'rgba(13,13,43,0.5)', border: '1px dashed rgba(148,163,184,0.2)',
              color: '#475569', fontSize: '14px', textAlign: 'center' }}>
              ← Click a layer to learn about it
            </div>
          )}

          <div style={{ padding: '12px', borderRadius: '10px',
            background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
              <strong style={{ color: '#e2e8f0' }}>Differentiation:</strong> When Earth was molten,
              heavier elements (iron, nickel) sank to the core; lighter silicates floated to form
              the crust and mantle. This is why Earth has a layered structure.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#fca5a5', lineHeight: '1.6' }}>
              <strong style={{ color: '#f87171' }}>Size matters:</strong> Smaller worlds (Moon, Mars)
              cool faster → less internal activity → geologically dead. Earth is large enough to still
              have plate tectonics after 4.5 billion years.
            </p>
          </div>
        </div>
      </div>

      {/* Surface processes */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, margin: '0 0 12px' }}>
          Surface Processes (click to explore)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {PROCESSES.map(p => (
            <button key={p.name} onClick={() => setActiveProcess(activeProcess?.name === p.name ? null : p)}
              style={{ padding: '14px 8px', borderRadius: '10px',
                cursor: 'pointer', textAlign: 'center',
                background: activeProcess?.name === p.name ? `${p.color}20` : 'rgba(13,13,43,0.7)',
                border: `1px solid ${activeProcess?.name === p.name ? p.color + '60' : 'rgba(148,163,184,0.1)'}`,
                transition: 'all 0.2s' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{p.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: activeProcess?.name === p.name ? p.color : '#94a3b8' }}>
                {p.name}
              </div>
            </button>
          ))}
        </div>
        {activeProcess && (
          <div style={{ marginTop: '10px', padding: '16px', borderRadius: '10px',
            background: `${activeProcess.color}10`,
            border: `1px solid ${activeProcess.color}30` }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: '1.7' }}>
              {activeProcess.desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
