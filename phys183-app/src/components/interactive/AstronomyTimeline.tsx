'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InteractiveProps } from '@/types';

const EVENTS = [
  { year: 1543, name: 'Copernicus', icon: '🌍', color: '#a78bfa',
    title: 'Heliocentric Model',
    short: 'Published "De revolutionibus" — proposed the Sun, not Earth, is at the center.',
    detail: 'Nicolaus Copernicus proposed that the Earth and other planets orbit the Sun. This was controversial because it contradicted the Church-endorsed geocentric (Earth-centered) view of the cosmos. His model still used circles, but placed the Sun at the center — a revolutionary conceptual shift.',
    contribution: 'Theory', keyIdea: 'Heliocentrism' },
  { year: 1572, name: 'Tycho Brahe', icon: '🔭', color: '#06b6d4',
    title: 'Precision Observations',
    short: 'Made the most accurate naked-eye astronomical measurements ever recorded.',
    detail: 'Tycho Brahe spent decades making incredibly precise observations of planetary positions — all without a telescope. His meticulous data was better than anything before. He proposed a hybrid model (Tychonic system) but his data would prove decisive for Kepler.',
    contribution: 'Observation', keyIdea: 'Precision data' },
  { year: 1609, name: 'Kepler', icon: '📐', color: '#f59e0b',
    title: "Kepler's Laws",
    short: 'Used Tycho\'s data to discover 3 laws of planetary motion.',
    detail: 'Johannes Kepler used Tycho Brahe\'s precise data to discover: (1) Planets orbit in ellipses with the Sun at one focus. (2) A planet sweeps equal areas in equal times (moves faster when closer to the Sun). (3) P² ∝ a³ — the square of orbital period equals the cube of the semi-major axis. He had the "what" — Newton would later explain the "why."',
    contribution: 'Theory from Data', keyIdea: 'Elliptical orbits, P²∝a³' },
  { year: 1610, name: 'Galileo', icon: '🌕', color: '#10b981',
    title: 'Telescope Observations',
    short: 'First to use a telescope astronomically — saw moons of Jupiter, phases of Venus.',
    detail: 'Galileo Galilei improved the telescope and turned it skyward. Key discoveries: moons orbiting Jupiter (proof that not everything orbits Earth), phases of Venus (only possible in a heliocentric model), mountains on the Moon (disproving the "perfect heavenly spheres" idea), and many more stars than visible to the naked eye. His observations provided strong evidence for heliocentrism.',
    contribution: 'Observation', keyIdea: 'Evidence for heliocentrism' },
  { year: 1687, name: 'Newton', icon: '🍎', color: '#ef4444',
    title: 'Universal Gravitation',
    short: 'Explained WHY Kepler\'s laws work with universal gravity and motion laws.',
    detail: 'Isaac Newton published "Principia Mathematica" containing his 3 laws of motion and the Law of Universal Gravitation: F = GMm/r². This single equation explained why Kepler\'s laws work — planets follow ellipses because of gravitational attraction obeying an inverse-square law. Newton unified terrestrial and celestial physics.',
    contribution: 'Theory', keyIdea: 'F = GMm/r², unified physics' },
];

export default function AstronomyTimeline(_: InteractiveProps) {
  const [selected, setSelected] = useState<typeof EVENTS[0] | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const shown = filterType === 'All' ? EVENTS : EVENTS.filter(e => e.contribution.includes(filterType));

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ color: '#a78bfa', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
            History of Astronomy as a Science
          </h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Click any astronomer to learn their contribution. Key insight: science = observation + theory + revision.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Theory', 'Observation'].map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{
              padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '12px', fontWeight: filterType === t ? 700 : 400,
              background: filterType === t ? 'rgba(167,139,250,0.2)' : 'rgba(13,13,43,0.5)',
              color: filterType === t ? '#a78bfa' : '#64748b',
              border: `1px solid ${filterType === t ? 'rgba(167,139,250,0.4)' : 'transparent'}`,
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingBottom: '8px' }}>
        {/* Line */}
        <div style={{ position: 'absolute', top: '40px', left: '20px', right: '20px',
          height: '2px', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', zIndex: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between',
          gap: '8px', position: 'relative', zIndex: 1 }}>
          {shown.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <button
                onClick={() => setSelected(selected?.name === e.name ? null : e)}
                style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  cursor: 'pointer', fontSize: '28px',
                  background: selected?.name === e.name ? `${e.color}30` : 'rgba(13,13,43,0.9)',
                  border: `2px solid ${selected?.name === e.name ? e.color : e.color + '50'}`,
                  boxShadow: selected?.name === e.name ? `0 0 20px ${e.color}60` : 'none',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                }}
              >{e.icon}</button>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: e.color }}>{e.name}</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{e.year}</div>
                <div style={{ fontSize: '10px', marginTop: '2px',
                  padding: '2px 6px', borderRadius: '4px',
                  background: e.contribution === 'Theory' ? 'rgba(167,139,250,0.15)' : 'rgba(6,182,212,0.15)',
                  color: e.contribution === 'Theory' ? '#a78bfa' : '#06b6d4' }}>
                  {e.contribution}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '20px' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '24px', borderRadius: '14px',
              background: `${selected.color}0f`, border: `1px solid ${selected.color}30` }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '40px' }}>{selected.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px',
                    marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: selected.color }}>
                      {selected.name}
                    </h3>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>{selected.year}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px',
                      background: `${selected.color}20`, color: selected.color, fontWeight: 700 }}>
                      Key idea: {selected.keyIdea}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                    {selected.detail}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Occam's Razor callout */}
      <div style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '10px',
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#fde68a', lineHeight: '1.6' }}>
          <strong style={{ color: '#fbbf24' }}>⚔️ Occam's Razor:</strong> When two hypotheses explain
          the same observations equally well, prefer the simpler one. Copernicus's heliocentric model
          was simpler than Ptolemy's geocentric system (which needed complex epicycles) — a major reason
          it eventually won.
        </p>
      </div>
    </div>
  );
}
