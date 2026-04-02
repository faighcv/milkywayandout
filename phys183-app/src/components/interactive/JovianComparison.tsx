'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

const PLANETS = [
  { name: 'Jupiter', color: '#f97316', r: 90,
    mass: '318 Earth', radius: '11.2 Earth', density: '1.33 g/cm³',
    moons: '95+', composition: 'H/He (metallic hydrogen interior)',
    special: 'Great Red Spot: a storm larger than Earth, active for centuries',
    galilean: 'Io (volcanic), Europa (subsurface ocean), Ganymede (largest moon in solar system), Callisto' },
  { name: 'Saturn', color: '#fde68a', r: 75, rings: true,
    mass: '95 Earth', radius: '9.5 Earth', density: '0.69 g/cm³',
    moons: '146+', composition: 'H/He (less metallic hydrogen than Jupiter)',
    special: 'Would float in a large enough ocean! Density < water. Most spectacular ring system.' },
  { name: 'Uranus', color: '#67e8f9', r: 45,
    mass: '14.5 Earth', radius: '4.0 Earth', density: '1.27 g/cm³',
    moons: '28', composition: 'Ice giant: water, methane, ammonia ices + H/He envelope',
    special: 'Tilted 98° — rotates nearly on its side. Methane absorbs red light → appears cyan.' },
  { name: 'Neptune', color: '#60a5fa', r: 43,
    mass: '17 Earth', radius: '3.9 Earth', density: '1.64 g/cm³',
    moons: '16', composition: 'Ice giant: similar to Uranus',
    special: 'Fastest winds in the solar system (~2100 km/h). Methane → blue color.' },
];

export default function JovianComparison(_: InteractiveProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#f97316', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Jovian Planet Comparison
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Gas/ice giants: large, low-density, no solid surface. Click to compare. All formed beyond the frost line.
        </p>
      </div>

      {/* Visual comparison */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        padding: '30px 20px 20px', borderRadius: '14px',
        background: 'radial-gradient(ellipse at 50% 80%, #0d0d2b, #03030a)',
        border: '1px solid rgba(249,115,22,0.15)', marginBottom: '16px',
        minHeight: '200px', position: 'relative' }}>

        {/* Frost line indicator */}
        <div style={{ position: 'absolute', top: '10px', left: '50%',
          transform: 'translateX(-50%)', fontSize: '11px', color: '#60a5fa',
          padding: '3px 10px', borderRadius: '6px',
          background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)' }}>
          ❄️ All formed beyond the frost line (~3 AU from Sun)
        </div>

        {PLANETS.map((p, i) => (
          <div key={p.name} style={{ display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setActive(i)}>
            {/* Planet circle */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: `${p.r * (active === i ? 1.1 : 1)}px`,
                height: `${p.r * (active === i ? 1.1 : 1)}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.color}88)`,
                border: active === i ? `3px solid ${p.color}` : `1px solid ${p.color}60`,
                boxShadow: active === i ? `0 0 24px ${p.color}60` : 'none',
                transition: 'all 0.3s',
              }} />
              {/* Saturn rings */}
              {p.rings && (
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${p.r * 2.2}px`, height: `${p.r * 0.5}px`,
                  border: `3px solid ${p.color}80`,
                  borderRadius: '50%', pointerEvents: 'none' }} />
              )}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: active === i ? p.color : '#94a3b8',
              transition: 'color 0.2s' }}>
              {p.name}
            </div>
            <div style={{ fontSize: '10px', color: '#475569' }}>
              ρ = {p.density}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ padding: '20px', borderRadius: '12px',
        background: `${PLANETS[active].color}0f`,
        border: `1px solid ${PLANETS[active].color}30` }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 700,
          color: PLANETS[active].color }}>
          {PLANETS[active].name}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
          marginBottom: '14px' }}>
          {[
            { label: 'Mass', value: PLANETS[active].mass },
            { label: 'Radius', value: PLANETS[active].radius },
            { label: 'Density', value: PLANETS[active].density },
            { label: 'Moons', value: PLANETS[active].moons },
            { label: 'Composition', value: PLANETS[active].composition },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '10px', borderRadius: '8px',
              background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(148,163,184,0.08)' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
                {label}
              </div>
              <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px', borderRadius: '8px',
          background: `${PLANETS[active].color}15` }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
            ⭐ <strong style={{ color: PLANETS[active].color }}>Notable:</strong>{' '}
            {PLANETS[active].special}
          </p>
        </div>
        {active === 0 && (
          <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px',
            background: 'rgba(249,115,22,0.08)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#fdba74', lineHeight: '1.6' }}>
              <strong>Galilean Moons:</strong> {PLANETS[active].galilean}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px',
        background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
          <strong style={{ color: '#94a3b8' }}>Key distinction:</strong> Uranus and Neptune are
          "ice giants" (significant water, methane, ammonia content) while Jupiter and Saturn are
          "gas giants" (mainly H/He with metallic hydrogen).
          Saturn's density (0.69 g/cm³) is less than water (1.0 g/cm³) — it would float!
        </p>
      </div>
    </div>
  );
}
