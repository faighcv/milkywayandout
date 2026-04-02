'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InteractiveProps } from '@/types';

const STEPS = [
  { title: 'Molecular Cloud', icon: '☁️', color: '#6366f1',
    desc: 'A cold (~10 K), dense region of the interstellar medium. Mainly H₂ and He, with dust. Gravity and thermal pressure are nearly balanced. Molecular cooling allows cloud to stay cold.',
    viz: 'cloud' },
  { title: 'Gravity Wins', icon: '⬇️', color: '#7c3aed',
    desc: 'A perturbation — nearby supernova, galaxy arm passage — tips the balance. Gravity > pressure. The cloud begins to collapse. Angular momentum causes it to spin faster as it contracts.',
    viz: 'collapse' },
  { title: 'Fragmentation', icon: '💎', color: '#a855f7',
    desc: 'Large clouds don\'t form one giant star — they fragment into dozens of smaller clumps. Each clump → one star. This is why stars form in clusters, not in isolation.',
    viz: 'fragment' },
  { title: 'Protostar Forms', icon: '🌟', color: '#f59e0b',
    desc: 'A clump collapses, heats up at center → protostar. It\'s surrounded by a disk of gas and dust. Still accreting material. Not yet fusing hydrogen. Located in upper-right of HR diagram (cool and luminous).',
    viz: 'protostar' },
  { title: 'T Tauri Phase', icon: '⚡', color: '#ef4444',
    desc: 'Strong stellar winds blow away remaining envelope. Bipolar jets emerge from poles. Disk around protostar may form planets. Higher-mass stars reach this phase and main sequence much faster.',
    viz: 'ttauri' },
  { title: 'Main Sequence!', icon: '☀️', color: '#10b981',
    desc: 'Core temperature reaches ~10 million K → hydrogen fusion ignites. Hydrostatic equilibrium established. Star settles onto main sequence. Its mass determines where exactly on the MS it sits.',
    viz: 'mainseq' },
];

export default function StarFormation(_: InteractiveProps) {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#4ade80', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Star Birth — From Cloud to Main Sequence
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Any theory of star formation must end with a star on the main sequence.
          Mass is everything — it determines the star's entire life story.
        </p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {STEPS.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: '8px 4px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '18px',
            background: step === i ? `${st.color}20` : 'rgba(13,13,43,0.5)',
            border: `1px solid ${step === i ? st.color + '50' : 'transparent'}`,
          }}>{st.icon}</button>
        ))}
      </div>

      {/* Visualization */}
      <div style={{ height: '200px', borderRadius: '14px', marginBottom: '16px',
        background: 'radial-gradient(ellipse at 50% 60%, #0d0d2b, #03030a)',
        border: `1px solid ${s.color}25`, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }} transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>

            {step === 0 && (
              <>
                {Array.from({ length: 40 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute',
                    left: `${20 + ((i * 137.5) % 60)}%`,
                    top: `${15 + ((i * 97.3) % 70)}%`,
                    width: `${2 + (i * 0.2) % 4}px`, height: `${2 + (i * 0.2) % 4}px`,
                    borderRadius: '50%',
                    background: `rgba(99,102,241,${0.3 + (i * 0.02) % 0.5})` }} />
                ))}
                <div style={{ width: '160px', height: '120px', borderRadius: '50%',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)' }} />
              </>
            )}

            {(step === 1 || step === 2) && (
              <motion.div
                animate={{ scale: [1, 0.6, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeIn' }}
                style={{ width: '140px', height: '100px', borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(124,58,237,0.4), rgba(99,102,241,0.1))',
                  border: '1px solid rgba(124,58,237,0.4)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                ⬇️
              </motion.div>
            )}

            {step === 3 && (
              <div style={{ position: 'relative' }}>
                <div style={{ width: '180px', height: '40px', borderRadius: '50%',
                  background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: '#f59e0b', boxShadow: '0 0 20px #f59e0b' }} />
              </div>
            )}

            {step === 4 && (
              <div style={{ position: 'relative' }}>
                <div style={{ width: '160px', height: '30px', borderRadius: '50%',
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: '#ef4444', boxShadow: '0 0 16px #ef4444' }} />
                {/* Jets */}
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -200%)',
                  width: '4px', height: '60px',
                  background: 'linear-gradient(0deg, #ef4444, transparent)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, 100%)',
                  width: '4px', height: '60px',
                  background: 'linear-gradient(180deg, #ef4444, transparent)' }} />
              </div>
            )}

            {step === 5 && (
              <motion.div
                animate={{ boxShadow: ['0 0 20px #10b981', '0 0 50px #10b981', '0 0 20px #10b981'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '50px', height: '50px', borderRadius: '50%',
                  background: '#10b981', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px' }}>
                ☀️
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ padding: '20px', borderRadius: '12px',
            background: `${s.color}0f`, border: `1px solid ${s.color}30` }}>
          <h4 style={{ margin: '0 0 10px', color: s.color, fontSize: '17px', fontWeight: 700 }}>
            {s.icon} Step {step + 1}: {s.title}
          </h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
            {s.desc}
          </p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{
          flex: 1, padding: '10px', borderRadius: '10px',
          border: '1px solid rgba(148,163,184,0.2)',
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
          cursor: step === STEPS.length - 1 ? 'not-allowed' : 'pointer',
          fontSize: '14px', fontWeight: 600 }}>
          {step === STEPS.length - 1 ? '🌟 Star born!' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
