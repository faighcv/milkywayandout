'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { InteractiveProps } from '@/types';

const PRESETS = [
  { name: 'Mars', co2: 5, temp: -60, atm: 0.006, color: '#ef4444',
    note: 'Thin CO₂ atmosphere, weak greenhouse effect, most heat escapes → very cold.' },
  { name: 'Earth', co2: 40, temp: 15, atm: 1.0, color: '#3b82f6',
    note: 'Just-right greenhouse effect. CO₂ and water vapor trap enough heat for liquid water.' },
  { name: 'Venus', co2: 100, temp: 465, atm: 92, color: '#f97316',
    note: 'Runaway greenhouse! Thick CO₂ atmosphere (92× Earth pressure) → 465°C surface. Hot enough to melt lead.' },
];

export default function GreenhouseEffect(_: InteractiveProps) {
  const [co2, setCo2] = useState(40);
  const [selected, setSelected] = useState(1); // Earth default

  const temp = -60 + (co2 / 100) * 525;
  const escapeRate = Math.max(5, 100 - co2);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#22d3ee', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Greenhouse Effect & Planetary Atmospheres
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Adjust CO₂ level to see how it affects surface temperature. Compare Earth, Mars, and Venus.
        </p>
      </div>

      {/* Planet presets */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        {PRESETS.map((p, i) => (
          <button key={p.name} onClick={() => { setSelected(i); setCo2(p.co2); }} style={{
            flex: 1, padding: '12px 8px', borderRadius: '10px',
            cursor: 'pointer', textAlign: 'center',
            background: selected === i ? `${p.color}20` : 'rgba(13,13,43,0.6)',
            border: `1px solid ${selected === i ? p.color + '50' : 'rgba(148,163,184,0.1)'}`,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: p.color }}>{p.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {p.temp}°C
            </div>
          </button>
        ))}
      </div>

      {/* Diagram */}
      <div style={{ borderRadius: '14px', overflow: 'hidden',
        background: 'linear-gradient(180deg, #0d0d2b 0%, #1a0505 100%)',
        border: '1px solid rgba(34,211,238,0.2)', padding: '20px', position: 'relative',
        height: '220px' }}>

        {/* Sun rays (visible light - enter atmosphere) */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div key={i}
            animate={{ y: [0, 150], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.35, ease: 'linear' }}
            style={{ position: 'absolute', top: '0',
              left: `${15 + i * 14}%`, width: '3px', height: '20px',
              background: '#fbbf24', borderRadius: '2px', opacity: 0 }} />
        ))}

        {/* Atmosphere layer */}
        <div style={{ position: 'absolute', top: '30px', left: '10px', right: '10px',
          height: `${Math.min(80, 20 + co2 * 0.6)}px`, borderRadius: '8px',
          background: `rgba(34,211,238,${0.05 + co2 * 0.003})`,
          border: `1px solid rgba(34,211,238,${0.1 + co2 * 0.002})` }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', fontSize: '11px', color: '#22d3ee',
            whiteSpace: 'nowrap', fontWeight: 700 }}>
            Atmosphere (CO₂: {co2}%)
          </div>
        </div>

        {/* Surface */}
        <div style={{ position: 'absolute', bottom: '20px', left: '10px', right: '10px',
          height: '30px', borderRadius: '6px',
          background: `linear-gradient(90deg, ${co2 > 80 ? '#7c2d12' : co2 > 30 ? '#15803d' : '#7f1d1d'}, transparent)`,
          border: '1px solid rgba(148,163,184,0.2)',
          display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
          <span style={{ fontSize: '11px', color: '#e2e8f0', fontWeight: 700 }}>
            Surface: {Math.round(temp)}°C
          </span>
        </div>

        {/* IR photons escaping vs trapped */}
        {Array.from({ length: 8 }, (_, i) => {
          const escapes = i < (escapeRate / 100) * 8;
          return (
            <motion.div key={`ir-${i}`}
              animate={escapes
                ? { y: [180, 0], opacity: [0, 1, 1, 0] }
                : { y: [180, 80, 180], opacity: [0, 0.8, 0] }}
              transition={{ duration: escapes ? 2.5 : 2, repeat: Infinity,
                delay: 1 + i * 0.25, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: '50px',
                left: `${20 + i * 10}%`, width: '4px', height: '4px',
                borderRadius: '50%',
                background: escapes ? '#f59e0b' : '#ef4444',
                boxShadow: `0 0 6px ${escapes ? '#f59e0b' : '#ef4444'}`,
                opacity: 0 }} />
          );
        })}

        {/* Legend */}
        <div style={{ position: 'absolute', bottom: '60px', right: '16px',
          display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#fbbf24' }}>
            <div style={{ width: '8px', height: '8px', background: '#fbbf24', borderRadius: '1px' }} />
            Sunlight (visible)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#f59e0b' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            IR escaping
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#ef4444' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            IR trapped → warms surface
          </div>
        </div>
      </div>

      {/* Slider */}
      <div style={{ marginTop: '14px', padding: '14px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(34,211,238,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
            CO₂ Level: {co2}%
          </label>
          <span style={{ fontSize: '13px', fontWeight: 700,
            color: co2 > 80 ? '#ef4444' : co2 > 50 ? '#f59e0b' : '#10b981' }}>
            Surface: {Math.round(temp)}°C
          </span>
        </div>
        <input type="range" min="1" max="100" value={co2}
          onChange={e => { setCo2(Number(e.target.value)); setSelected(-1); }}
          style={{ width: '100%', accentColor: '#22d3ee' }} />
      </div>

      {/* Planet comparison */}
      <div style={{ marginTop: '12px', padding: '14px', borderRadius: '10px',
        background: selected >= 0 ? `${PRESETS[selected].color}0a` : 'rgba(13,13,43,0.6)',
        border: `1px solid ${selected >= 0 ? PRESETS[selected].color + '30' : 'rgba(148,163,184,0.1)'}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {PRESETS.map((p, i) => (
            <div key={p.name} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: p.color }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Atm: {p.atm}× Earth</div>
              <div style={{ fontSize: '12px', color: p.temp > 100 ? '#ef4444' : p.temp < 0 ? '#60a5fa' : '#10b981',
                fontWeight: 700 }}>{p.temp}°C</div>
            </div>
          ))}
        </div>
        {selected >= 0 && (
          <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
            <strong style={{ color: PRESETS[selected].color }}>{PRESETS[selected].name}:</strong>{' '}
            {PRESETS[selected].note}
          </p>
        )}
      </div>
    </div>
  );
}
