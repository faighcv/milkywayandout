'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { InteractiveProps } from '@/types';

export default function TelescopeRayTrace(_: InteractiveProps) {
  const [mode, setMode] = useState<'refract' | 'reflect'>('refract');
  const [aperture, setAperture] = useState(80);

  const resolutionArcSec = (1.22 * 550e-9 / (aperture * 1e-3)) * (180 / Math.PI) * 3600;

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#10b981', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Telescope Ray Tracing
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          Refracting telescopes use lenses; reflecting telescopes use mirrors. Modern large telescopes are all reflectors.
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['refract', 'reflect'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '10px 24px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: mode === m ? 700 : 400, fontSize: '14px',
            background: mode === m ? 'rgba(16,185,129,0.2)' : 'rgba(13,13,43,0.6)',
            color: mode === m ? '#10b981' : '#64748b',
            border: `1px solid ${mode === m ? 'rgba(16,185,129,0.4)' : 'transparent'}`,
          }}>
            {m === 'refract' ? '🔵 Refracting' : '🔴 Reflecting'}
          </button>
        ))}
      </div>

      {/* SVG diagram */}
      <div style={{ borderRadius: '14px', overflow: 'hidden',
        background: '#03030a', border: '1px solid rgba(16,185,129,0.2)', padding: '20px' }}>
        <svg viewBox="0 0 600 200" style={{ width: '100%' }}>
          {mode === 'refract' ? (
            <>
              {/* Incoming parallel rays */}
              {[-50, -25, 0, 25, 50].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  x1="0" y1={100 + offset} x2="180" y2={100 + offset}
                  stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
              ))}
              {/* Objective lens */}
              <ellipse cx="190" cy="100" rx="8" ry="60" fill="rgba(6,182,212,0.15)"
                stroke="#06b6d4" strokeWidth="2" />
              <text x="190" y="172" textAnchor="middle" fill="#06b6d4" fontSize="10">Objective lens</text>
              {/* Converging rays */}
              {[-50, -25, 0, 25, 50].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
                  x1="198" y1={100 + offset} x2="420" y2="100"
                  stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
              ))}
              {/* Focal point */}
              <circle cx="420" cy="100" r="5" fill="#ef4444" />
              <text x="420" y="90" textAnchor="middle" fill="#ef4444" fontSize="10">Focal point</text>
              {/* Eyepiece */}
              <ellipse cx="450" cy="100" rx="5" ry="30" fill="rgba(6,182,212,0.15)"
                stroke="#06b6d4" strokeWidth="1.5" />
              <text x="450" y="140" textAnchor="middle" fill="#06b6d4" fontSize="10">Eyepiece</text>
              {/* Diverging to eye */}
              {[-20, 0, 20].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
                  x1="455" y1="100" x2="580" y2={100 + offset * 1.5}
                  stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
              ))}
              <text x="575" y="95" textAnchor="middle" fill="#94a3b8" fontSize="11">👁</text>
            </>
          ) : (
            <>
              {/* Incoming parallel rays */}
              {[-50, -25, 0, 25, 50].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  x1="0" y1={100 + offset} x2="150" y2={100 + offset}
                  stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
              ))}
              {/* Primary mirror (parabolic, simplified) */}
              <path d="M 170 40 Q 200 100 170 160" fill="rgba(96,165,250,0.1)"
                stroke="#60a5fa" strokeWidth="3" />
              <text x="148" y="180" fill="#60a5fa" fontSize="10" textAnchor="middle">Primary mirror</text>
              {/* Reflected rays converging */}
              {[-50, -25, 0, 25, 50].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
                  x1="168" y1={100 + offset} x2="330" y2="60"
                  stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
              ))}
              {/* Secondary mirror */}
              <rect x="322" y="50" width="20" height="20" rx="2"
                fill="rgba(96,165,250,0.15)" stroke="#60a5fa" strokeWidth="2"
                transform="rotate(-45 332 60)" />
              <text x="360" y="50" fill="#60a5fa" fontSize="10">Secondary</text>
              {/* Rays to eyepiece at side */}
              {[-10, 0, 10].map((offset, i) => (
                <motion.line key={i}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
                  x1="332" y1="60" x2={460 + offset * 2} y2={40 + offset}
                  stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
              ))}
              <text x="480" y="38" textAnchor="middle" fill="#94a3b8" fontSize="11">👁</text>
              {/* Benefits callout */}
              <text x="300" y="155" fill="#a78bfa" fontSize="10" textAnchor="middle">No chromatic aberration · Easier to make large · All modern large telescopes are reflectors</text>
            </>
          )}
        </svg>
      </div>

      {/* Aperture slider */}
      <div style={{ marginTop: '14px', padding: '16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>
            Aperture (diameter): {aperture} mm
          </label>
          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 700 }}>
            Angular resolution: {resolutionArcSec.toFixed(2)}″
          </span>
        </div>
        <input type="range" min="50" max="10000" step="50" value={aperture}
          onChange={e => setAperture(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#10b981' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: '11px', color: '#475569', marginTop: '4px' }}>
          <span>50mm (binoculars)</span>
          <span>Human eye: ~1mm</span>
          <span>10m (large telescope)</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '12px', margin: '10px 0 0', lineHeight: '1.6' }}>
          Angular resolution ≈ 1.22 λ/D radians. Larger aperture → finer detail.
          The Hubble Space Telescope (2.4m) avoids atmospheric blurring entirely.
        </p>
      </div>

      {/* Why reflecting wins */}
      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { title: 'Why Refractors Lost', items: ['Chromatic aberration (colors focus differently)', 'Glass must be perfect all the way through', 'Large lenses sag under their own weight', 'Maximum useful size: ~1 meter'] },
          { title: 'Why Reflectors Win', items: ['Mirrors only need one polished surface', 'No chromatic aberration', 'Can be supported from behind (less sag)', 'Modern telescopes: 8–40 meters!', 'Adaptive optics corrects atmosphere in real time'] },
        ].map(({ title, items }) => (
          <div key={title} style={{ padding: '14px', borderRadius: '10px',
            background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
              {title}
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ fontSize: '12px', color: '#94a3b8',
                marginBottom: '4px', display: 'flex', gap: '6px' }}>
                <span>•</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
