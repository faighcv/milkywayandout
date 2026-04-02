'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InteractiveProps } from '@/types';

const STEPS = [
  { title: '1. Interstellar Gas Cloud', desc: 'A vast, cold cloud of gas (mostly H and He) and dust slowly rotates in space. Heavier elements from previous stellar generations are mixed in. The cloud is in near equilibrium — gravity just barely balanced.', color: '#a78bfa', icon: '☁️',
    visual: 'cloud' },
  { title: '2. Gravitational Collapse', desc: 'A disturbance (nearby supernova, density fluctuation) tips the balance. Gravity wins — the cloud begins to contract. As it collapses, it spins faster (conservation of angular momentum, like a figure skater pulling arms in).', color: '#7c3aed', icon: '🌀',
    visual: 'collapse' },
  { title: '3. Disk Formation', desc: 'The spinning cloud flattens into a rotating disk — the solar nebula. The central region concentrates most of the mass and heats up. This flat disk shape is why all planets orbit in the same plane!', color: '#06b6d4', icon: '💿',
    visual: 'disk' },
  { title: '4. Condensation by Temperature', desc: 'Temperature decreases with distance from the proto-Sun. Inner disk: too hot for ice, only metals and minerals condense (high melting points). Middle: lighter compounds. Outer disk (past frost line): water ice and other volatiles can condense, allowing much larger planetesimals to form.', color: '#f59e0b', icon: '🌡️',
    visual: 'condensation' },
  { title: '5. Planetesimal Accretion', desc: 'Condensed grains collide and stick together → pebbles → boulders → planetesimals (km-sized). Gravity takes over: planetesimals sweep up surrounding material. Inner zone: rocky terrestrial planets. Outer zone (past frost line): giant cores form quickly, capture gas → Jovian planets.', color: '#10b981', icon: '🪐',
    visual: 'accretion' },
  { title: '6. Solar System Formed!', desc: 'This model explains: same orbital direction, near-circular orbits, two planet types (terrestrial vs Jovian), asteroid belt (material Jupiter\'s gravity prevented from forming a planet), Kuiper belt, Oort cloud. And predicts: protoplanetary disks around other young stars — confirmed by observations!', color: '#fbbf24', icon: '✨',
    visual: 'final' },
];

function Visual({ step }: { step: number }) {
  const s = STEPS[step];
  return (
    <div style={{ width: '100%', height: '200px', borderRadius: '12px',
      background: 'radial-gradient(ellipse at 50% 50%, #0d0d2b, #03030a)',
      position: 'relative', overflow: 'hidden',
      border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {step === 0 && ( // Cloud
        <>
          {Array.from({ length: 60 }, (_, i) => (
            <motion.div key={i}
              animate={{ x: [0, (Math.random() - 0.5) * 20, 0], y: [0, (Math.random() - 0.5) * 20, 0] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
              style={{ position: 'absolute',
                left: `${20 + (((i * 137.5) % 60))}%`,
                top: `${20 + (((i * 97.3) % 60))}%`,
                width: `${2 + (i * 0.3) % 4}px`, height: `${2 + (i * 0.3) % 4}px`,
                borderRadius: '50%', background: `rgba(167,139,250,${0.3 + (i * 0.02) % 0.5})` }} />
          ))}
          <div style={{ position: 'absolute', width: '200px', height: '120px', borderRadius: '50%',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }} />
        </>
      )}

      {step === 1 && ( // Collapse spiral
        <motion.div
          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ width: '160px', height: '160px', position: 'relative' }}>
          {[140, 110, 80, 50, 25].map((r, i) => (
            <div key={i} style={{ position: 'absolute', top: '50%', left: '50%',
              width: `${r}px`, height: `${r}px`,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%', border: `1px solid rgba(124,58,237,${0.2 + i * 0.1})` }} />
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '50%',
            width: '12px', height: '12px', borderRadius: '50%', transform: 'translate(-50%,-50%)',
            background: '#fbbf24', boxShadow: '0 0 16px #fbbf24' }} />
        </motion.div>
      )}

      {step === 2 && ( // Disk
        <div style={{ position: 'relative' }}>
          <div style={{ width: '280px', height: '50px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.1) 60%, transparent 100%)',
            border: '1px solid rgba(6,182,212,0.3)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#fbbf24', boxShadow: '0 0 20px #fbbf24' }} />
        </div>
      )}

      {step === 3 && ( // Condensation zones
        <div style={{ position: 'relative', width: '360px', height: '60px' }}>
          {/* Disk gradient */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '30px',
            background: 'linear-gradient(90deg, #ef444420, #f59e0b20, #60a5fa20, #a78bfa20)' }} />
          {/* Labels */}
          {[
            { x: '12%', label: 'Metals/\nMinerals', color: '#ef4444', sub: '> 1000°C' },
            { x: '37%', label: 'Lighter\ncompounds', color: '#f59e0b', sub: '200-1000°C' },
            { x: '58%', label: 'Frost\nLine', color: '#60a5fa', sub: '0°C' },
            { x: '75%', label: 'Ices', color: '#a78bfa', sub: '< 0°C' },
          ].map(({ x, label, color, sub }) => (
            <div key={label} style={{ position: 'absolute', top: '-60px', left: x,
              textAlign: 'center', transform: 'translateX(-50%)' }}>
              <div style={{ fontSize: '11px', color, fontWeight: 700,
                whiteSpace: 'pre-line', lineHeight: '1.3' }}>{label}</div>
              <div style={{ width: '1px', height: '30px', background: `${color}60`,
                margin: '4px auto' }} />
              <div style={{ fontSize: '10px', color: '#64748b' }}>{sub}</div>
            </div>
          ))}
          <div style={{ position: 'absolute', top: '50%', left: '0',
            transform: 'translateY(-50%)',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#fbbf24', boxShadow: '0 0 12px #fbbf24' }} />
        </div>
      )}

      {(step === 4 || step === 5) && ( // Final solar system
        <div style={{ position: 'relative', width: '340px', height: '180px',
          display: 'flex', alignItems: 'center' }}>
          {/* Sun */}
          <div style={{ width: '24px', height: '24px', borderRadius: '50%',
            background: '#fbbf24', boxShadow: '0 0 20px #fbbf24', flexShrink: 0 }} />
          {/* Orbits */}
          {[40, 65, 90, 120, 160, 200, 240, 280].map((r, i) => {
            const colors = ['#94a3b8','#fbbf24','#3b82f6','#ef4444','#f97316','#fde68a','#67e8f9','#60a5fa'];
            const sizes = [3,5,5.5,4,11,9,7,6.5];
            const names = ['Me','V','E','Ma','J','Sa','U','N'];
            const angle = (i * 0.8 + 0.3) * Math.PI * 2;
            const px = 12 + Math.cos(angle) * (r * 0.45);
            const py = 90 + Math.sin(angle) * (r * 0.12);
            return (
              <div key={i}>
                <div style={{ position: 'absolute', borderRadius: '50%',
                  border: `1px solid rgba(148,163,184,0.1)`,
                  left: `${12 - r * 0.45}px`, top: `${90 - r * 0.12}px`,
                  width: `${r * 0.9}px`, height: `${r * 0.24}px` }} />
                <div title={names[i]} style={{ position: 'absolute',
                  left: `${px - sizes[i] / 2}px`, top: `${py - sizes[i] / 2}px`,
                  width: `${sizes[i]}px`, height: `${sizes[i]}px`, borderRadius: '50%',
                  background: colors[i] }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Label */}
      <div style={{ position: 'absolute', bottom: '8px', right: '12px',
        fontSize: '11px', color: s.color, fontWeight: 700 }}>
        {s.icon} {s.title.split('.')[0]}
      </div>
    </div>
  );
}

export default function NebularCondensation(_: InteractiveProps) {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#e879f9', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Solar Nebula Theory — Step by Step
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Walk through how our solar system formed from a collapsing gas cloud.
        </p>
      </div>

      {/* Step buttons */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: '1', padding: '8px 6px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '11px', fontWeight: step === i ? 700 : 400,
            background: step === i ? `${s.color}20` : 'rgba(13,13,43,0.6)',
            color: step === i ? s.color : '#475569',
            border: `1px solid ${step === i ? s.color + '50' : 'transparent'}`,
            minWidth: '40px',
          }}>{i + 1}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <Visual step={step} />
          <div style={{ marginTop: '16px', padding: '20px', borderRadius: '12px',
            background: `${STEPS[step].color}0f`, border: `1px solid ${STEPS[step].color}30` }}>
            <h4 style={{ margin: '0 0 10px', color: STEPS[step].color, fontSize: '16px', fontWeight: 700 }}>
              {STEPS[step].icon} {STEPS[step].title}
            </h4>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
              {STEPS[step].desc}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
          flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.2)',
          background: 'rgba(148,163,184,0.05)', color: step === 0 ? '#475569' : '#94a3b8',
          cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
          ← Previous
        </button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1} style={{
          flex: 1, padding: '10px', borderRadius: '10px',
          border: `1px solid ${STEPS[step].color}50`,
          background: `${STEPS[step].color}15`,
          color: step === STEPS.length - 1 ? '#475569' : STEPS[step].color,
          cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}>
          {step === STEPS.length - 1 ? '✓ Complete!' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
