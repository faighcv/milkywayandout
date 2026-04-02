'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

const OBJECTS = [
  {
    id: 'wd',
    name: 'White Dwarf',
    icon: '⚪',
    color: '#818cf8',
    mass: '≤ 1.4 M☉',
    radius: '~Earth (6,000 km)',
    density: '~10⁶ g/cm³',
    pressure: 'Electron degeneracy',
    temp: '100,000 K → cools over ~10¹³ yr',
    progenitor: 'Low/medium mass stars (< 8 M☉)',
    limit: 'Chandrasekhar limit: 1.4 M☉ — above this, electron degeneracy fails → Type Ia SN',
    facts: [
      'Composed mainly of C and O (or O/Ne for heavier)',
      'No fusion — just slowly cooling, supported by electron degeneracy pressure',
      'A teaspoon weighs ~5 tons',
      'Will eventually become a cold, dark "black dwarf" (none yet exist — universe too young)',
      'Type Ia supernova: if WD accretes enough mass from companion to exceed 1.4 M☉',
    ],
    vizR: 22,
    glow: '#818cf8',
  },
  {
    id: 'ns',
    name: 'Neutron Star',
    icon: '🔵',
    color: '#60a5fa',
    mass: '1.4–3 M☉',
    radius: '~10 km',
    density: '~10¹⁴ g/cm³',
    pressure: 'Neutron degeneracy',
    temp: '~10⁶ K initially',
    progenitor: 'Massive stars (8–25 M☉), core-collapse SN',
    limit: 'Tolman-Oppenheimer-Volkoff limit: ~2–3 M☉ — above this, collapses to black hole',
    facts: [
      'Matter squeezed so dense that protons + electrons → neutrons',
      'A teaspoon weighs ~1 billion tons',
      'Pulsars: rotating NS emitting beams of radio waves — lighthouse effect',
      'Surface gravity ~2×10¹¹ g (vs. Earth\'s 1g)',
      'Magnetic field ~10¹² Tesla — strongest in universe',
    ],
    vizR: 6,
    glow: '#60a5fa',
  },
  {
    id: 'bh',
    name: 'Black Hole',
    icon: '⚫',
    color: '#7c3aed',
    mass: '> 3 M☉ (stellar)',
    radius: 'Schwarzschild radius: r = 2GM/c²',
    density: 'Infinite at singularity',
    pressure: 'None — gravity wins',
    temp: 'Hawking radiation (extremely weak)',
    progenitor: 'Most massive stars (> 25 M☉), core-collapse SN',
    limit: 'No upper limit for stellar BH — supermassive BH in galactic centers reach 10⁹ M☉',
    facts: [
      'Event horizon: boundary from which nothing escapes (even light)',
      'Schwarzschild radius for 10 M☉ BH ≈ 30 km',
      'Time dilation near BH — clocks slow down for outside observers',
      'Detected via X-ray binaries (companion star accretes material) and gravitational waves',
      'First image: M87* (2019), Sgr A* (2022) — Event Horizon Telescope',
    ],
    vizR: 3,
    glow: '#7c3aed',
  },
];

export default function CompactObjects(_: InteractiveProps) {
  const [active, setActive] = useState(0);
  const obj = OBJECTS[active];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#818cf8', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Compact Objects — Stellar Remnants
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          When a star dies, what remains depends on its mass. All three are supported (or overwhelmed)
          by different quantum mechanical effects.
        </p>
      </div>

      {/* Size comparison */}
      <div style={{ borderRadius: '14px', background: '#03030a',
        border: '1px solid rgba(129,140,248,0.15)', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        minHeight: '130px', marginBottom: '16px', position: 'relative' }}>

        <div style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '10px', color: '#475569' }}>
          Relative size (not to scale)
        </div>

        {OBJECTS.map((o, i) => (
          <div key={o.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '8px', cursor: 'pointer' }} onClick={() => setActive(i)}>
            <div style={{
              width: `${o.vizR * 2}px`, height: `${o.vizR * 2}px`, borderRadius: '50%',
              background: o.id === 'bh'
                ? 'radial-gradient(circle at 40% 40%, #1e1b4b, #000)'
                : `radial-gradient(circle at 35% 35%, ${o.color}, ${o.color}66)`,
              border: active === i ? `2px solid ${o.color}` : `1px solid ${o.color}50`,
              boxShadow: active === i ? `0 0 ${o.vizR}px ${o.glow}80` : 'none',
              transition: 'all 0.3s',
            }} />
            {o.id === 'bh' && (
              <div style={{ position: 'absolute', marginTop: '-4px',
                width: `${o.vizR * 2 + 10}px`, height: `${o.vizR * 2 + 10}px`,
                borderRadius: '50%', border: '1px solid rgba(124,58,237,0.4)',
                pointerEvents: 'none', marginLeft: '-5px' }} />
            )}
            <div style={{ fontSize: '12px', fontWeight: 700, color: active === i ? o.color : '#64748b',
              transition: 'color 0.2s' }}>
              {o.name}
            </div>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {OBJECTS.map((o, i) => (
          <button key={o.id} onClick={() => setActive(i)} style={{
            flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: active === i ? `${o.color}18` : 'rgba(13,13,43,0.5)',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: active === i ? `${o.color}50` : 'transparent',
            color: active === i ? o.color : '#64748b',
            fontSize: '13px', fontWeight: active === i ? 700 : 400,
            transition: 'all 0.2s',
          }}>
            {o.icon} {o.name}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ borderRadius: '12px', background: `${obj.color}0a`,
        border: `1px solid ${obj.color}30`, padding: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
          {[
            { label: 'Mass', value: obj.mass },
            { label: 'Radius', value: obj.radius },
            { label: 'Density', value: obj.density },
            { label: 'Support', value: obj.pressure },
            { label: 'Temperature', value: obj.temp },
            { label: 'Progenitor', value: obj.progenitor },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '10px', borderRadius: '8px',
              background: 'rgba(3,3,10,0.6)', border: '1px solid rgba(71,85,105,0.15)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                {label}
              </div>
              <div style={{ fontSize: '12px', color: '#e2e8f0' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '12px',
          background: `${obj.color}15`, border: `1px solid ${obj.color}30` }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: obj.color, marginBottom: '4px' }}>
            Critical Limit
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            {obj.limit}
          </p>
        </div>

        <div style={{ fontSize: '12px', fontWeight: 700, color: obj.color, marginBottom: '8px' }}>
          Key Facts
        </div>
        <ul style={{ margin: 0, paddingLeft: '18px' }}>
          {obj.facts.map((f, i) => (
            <li key={i} style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.7', marginBottom: '2px' }}>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Degeneracy pressure explainer */}
      <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
          <strong style={{ color: '#94a3b8' }}>Degeneracy Pressure</strong> — a quantum mechanical effect
          (Pauli exclusion principle): no two fermions (electrons or neutrons) can occupy the same quantum state.
          This creates pressure <em>independent of temperature</em>. Unlike thermal pressure, it doesn't
          disappear when you cool the star — this is why white dwarfs don't collapse even as they cool.
        </p>
      </div>
    </div>
  );
}
