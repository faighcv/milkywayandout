'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { InteractiveProps } from '@/types';

export default function ParallaxDemo(_: InteractiveProps) {
  const [dist, setDist] = useState(10); // in parsecs

  const parallax = 1 / dist; // in arcseconds

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#f472b6', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Stellar Parallax — Measuring Star Distances
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          As Earth orbits the Sun, nearby stars appear to shift against distant background stars.
          The smaller the shift, the farther the star.
        </p>
      </div>

      {/* Animated diagram */}
      <div style={{ borderRadius: '14px', background: '#03030a',
        border: '1px solid rgba(244,114,182,0.2)', padding: '20px', position: 'relative',
        height: '260px', overflow: 'hidden' }}>

        {/* Distant background stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ position: 'absolute',
            left: `${5 + ((i * 137.5) % 90)}%`,
            top: `${10 + ((i * 97.3) % 30)}%`,
            width: '2px', height: '2px', borderRadius: '50%',
            background: `rgba(148,163,184,${0.3 + (i * 0.03) % 0.4})` }} />
        ))}

        {/* Sun at center */}
        <div style={{ position: 'absolute', left: '50%', bottom: '30px',
          transform: 'translateX(-50%)' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%',
            background: '#fbbf24', boxShadow: '0 0 16px #fbbf24',
            marginBottom: '4px' }} />
          <div style={{ fontSize: '10px', color: '#fbbf24', textAlign: 'center' }}>Sun</div>
        </div>

        {/* Earth orbit (simplified) */}
        <div style={{ position: 'absolute', left: '50%', bottom: '38px',
          transform: 'translateX(-50%)',
          width: '160px', height: '20px', borderRadius: '50%',
          border: '1px solid rgba(59,130,246,0.2)' }} />

        {/* Earth Jan position */}
        <motion.div
          animate={{ x: [0, 0] }}
          style={{ position: 'absolute', left: 'calc(50% - 80px)', bottom: '34px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%',
            background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          <div style={{ fontSize: '9px', color: '#3b82f6', marginTop: '2px', whiteSpace: 'nowrap' }}>Jan</div>
        </motion.div>

        {/* Earth Jul position */}
        <div style={{ position: 'absolute', left: 'calc(50% + 70px)', bottom: '34px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%',
            background: '#60a5fa', boxShadow: '0 0 6px #60a5fa' }} />
          <div style={{ fontSize: '9px', color: '#60a5fa', marginTop: '2px', whiteSpace: 'nowrap' }}>Jul</div>
        </div>

        {/* Nearby star with parallax shift */}
        <div style={{ position: 'absolute', left: `calc(50% + ${(parallax * 40).toFixed(0)}px)`,
          top: '40%', transition: 'left 0.4s ease' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%',
            background: '#f472b6', boxShadow: '0 0 10px #f472b6',
            position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', left: '50%',
              transform: 'translateX(-50%)', fontSize: '9px', color: '#f472b6',
              whiteSpace: 'nowrap' }}>
              Nearby star ({dist} pc)
            </div>
          </div>
        </div>

        {/* Parallax angle label */}
        <div style={{ position: 'absolute', left: '50%', top: '60%',
          transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
            p = {parallax.toFixed(3)}″
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            parallax angle
          </div>
        </div>

        {/* Dashed lines from Earth positions to star */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none' }} viewBox="0 0 600 260">
          <line x1="220" y1="228" x2={300 + parallax * 40} y2="104"
            stroke="rgba(244,114,182,0.3)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1="370" y1="228" x2={300 + parallax * 40} y2="104"
            stroke="rgba(244,114,182,0.3)" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* Distance slider */}
      <div style={{ marginTop: '14px', padding: '16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(244,114,182,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px' }}>
            Star distance: <strong style={{ color: '#f472b6' }}>{dist} parsecs</strong>
          </label>
          <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700 }}>
            p = {parallax.toFixed(4)} arcseconds
          </span>
        </div>
        <input type="range" min="1" max="100" value={dist}
          onChange={e => setDist(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#f472b6' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px',
          color: '#475569', marginTop: '4px' }}>
          <span>1 pc (very nearby)</span>
          <span>Proxima Centauri: 1.30 pc</span>
          <span>100 pc (farther)</span>
        </div>
      </div>

      {/* Formula */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
        <div style={{ padding: '14px', borderRadius: '10px',
          background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f472b6', marginBottom: '8px' }}>
            Parallax Formula
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '16px', color: '#fde68a', marginBottom: '8px' }}>
            d (pc) = 1 / p (arcsec)
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            1 parsec = distance at which parallax = 1 arcsecond = 3.26 light-years
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: '10px',
          background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
            Limits of Parallax
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
            Ground-based: works to ~100 pc.<br />
            Hipparcos satellite: ~1000 pc.<br />
            Gaia satellite: ~10,000 pc.<br />
            For greater distances: need standard candles (Cepheids, Type Ia supernovae).
          </div>
        </div>
      </div>
    </div>
  );
}
