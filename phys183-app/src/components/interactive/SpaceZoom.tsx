'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InteractiveProps } from '@/types';

const LEVELS = [
  {
    label: 'Earth',
    scale: '~12,742 km diameter',
    color: '#3b82f6',
    description: 'Home. One planet orbiting an ordinary star. Third from the Sun.',
    bg: 'radial-gradient(circle at 40% 60%, #1e40af, #0c1445)',
    icon: '🌍',
  },
  {
    label: 'Solar System',
    scale: '~100,000 AU across (to Oort Cloud)',
    color: '#f59e0b',
    description: '8 planets, countless moons, asteroids, comets. Light takes ~1.5 years to cross it.',
    bg: 'radial-gradient(circle at 50% 50%, #1a1a0a, #03030a)',
    icon: '☀️',
  },
  {
    label: 'Local Neighborhood',
    scale: '~100 light-years',
    color: '#a78bfa',
    description: 'Hundreds of nearby stars. Our nearest neighbor: Proxima Centauri at 4.2 light-years.',
    bg: 'radial-gradient(ellipse at 50% 50%, #0d0d2b, #03030a)',
    icon: '✨',
  },
  {
    label: 'Milky Way',
    scale: '~100,000 light-years diameter',
    color: '#fbbf24',
    description: 'Our galaxy. A barred spiral containing 100–400 billion stars. Our Solar System sits ~26,000 ly from the center.',
    bg: 'radial-gradient(ellipse at 50% 50%, #1a1a05, #03030a)',
    icon: '🌌',
  },
  {
    label: 'Local Group',
    scale: '~10 million light-years',
    color: '#06b6d4',
    description: '~50 galaxies including the Milky Way and Andromeda (M31). Andromeda is 2.5 million ly away.',
    bg: 'radial-gradient(ellipse at 30% 40%, #031a2b, #03030a)',
    icon: '🔭',
  },
  {
    label: 'Observable Universe',
    scale: '~93 billion light-years',
    color: '#ec4899',
    description: 'Everything we can see. Contains hundreds of billions of galaxies. At the very largest scales: a cosmic web of filaments and voids.',
    bg: 'radial-gradient(circle at 50% 50%, #0d0305, #03030a)',
    icon: '♾️',
  },
];

export default function SpaceZoom(_: InteractiveProps) {
  const [level, setLevel] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(n: number) {
    setDirection(n > level ? 1 : -1);
    setLevel(n);
  }

  const cur = LEVELS[level];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#06b6d4', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Cosmic Scale Zoom
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Journey from Earth to the edge of the observable universe.
        </p>
      </div>

      {/* Zoom steps */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => go(i)} style={{
            flex: 1, padding: '8px 4px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '11px', fontWeight: i === level ? 700 : 400,
            color: i === level ? l.color : '#475569',
            background: i === level ? `${l.color}20` : 'rgba(13,13,43,0.5)',
            border: `1px solid ${i === level ? l.color + '50' : 'transparent'}`,
            transition: 'all 0.2s', textAlign: 'center',
          }}>
            {l.icon}<br />{l.label}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={level}
          custom={direction}
          initial={{ opacity: 0, scale: direction > 0 ? 0.4 : 1.8, y: direction * 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: direction > 0 ? 1.8 : 0.4, y: -direction * 20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ borderRadius: '16px', overflow: 'hidden', height: '280px', position: 'relative',
            background: cur.bg, border: `1px solid ${cur.color}30` }}
        >
          {/* Stars background dots */}
          {Array.from({ length: 60 + level * 20 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${((i * 137.5) % 100)}%`,
              top: `${((i * 97.3) % 100)}%`,
              width: `${0.5 + (i * 0.07) % (level * 0.4 + 0.8)}px`,
              height: `${0.5 + (i * 0.07) % (level * 0.4 + 0.8)}px`,
              borderRadius: '50%',
              background: `rgba(255,255,255,${0.2 + (i * 0.04) % 0.6})`,
            }} />
          ))}

          {/* Milky Way spiral for level 3 */}
          {level === 3 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '200px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0.1) 40%, transparent 70%)',
                transform: 'rotate(-25deg)' }} />
            </div>
          )}

          {/* Center icon + scale */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ fontSize: level < 2 ? '72px' : '64px' }}>
              {cur.icon}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center', padding: '0 24px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: cur.color,
                marginBottom: '6px' }}>{cur.label}</div>
              <div style={{ fontSize: '14px', color: '#94a3b8', fontFamily: 'monospace',
                marginBottom: '8px' }}>{cur.scale}</div>
              <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5',
                maxWidth: '480px' }}>{cur.description}</div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <button onClick={() => go(Math.max(0, level - 1))} disabled={level === 0} style={{
          padding: '10px 24px', borderRadius: '10px', border: `1px solid ${LEVELS[Math.max(0, level - 1)].color}50`,
          background: `${LEVELS[Math.max(0, level - 1)].color}15`,
          color: level === 0 ? '#475569' : LEVELS[level - 1].color,
          fontSize: '14px', cursor: level === 0 ? 'not-allowed' : 'pointer', fontWeight: 600,
        }}>
          ← Zoom In
        </button>
        <span style={{ color: '#475569', fontSize: '13px', alignSelf: 'center' }}>
          Level {level + 1} / {LEVELS.length}
        </span>
        <button onClick={() => go(Math.min(LEVELS.length - 1, level + 1))}
          disabled={level === LEVELS.length - 1} style={{
          padding: '10px 24px', borderRadius: '10px',
          border: `1px solid ${LEVELS[Math.min(LEVELS.length - 1, level + 1)].color}50`,
          background: `${LEVELS[Math.min(LEVELS.length - 1, level + 1)].color}15`,
          color: level === LEVELS.length - 1 ? '#475569' : LEVELS[level + 1]?.color,
          fontSize: '14px', cursor: level === LEVELS.length - 1 ? 'not-allowed' : 'pointer',
          fontWeight: 600,
        }}>
          Zoom Out →
        </button>
      </div>
    </div>
  );
}
