'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/store/progressStore';
import { ALL_LECTURES } from '@/data';
import type { LectureId } from '@/types';

const COLORS: Record<number, { main: string; glow: string }> = {
  1:  { main: '#06b6d4', glow: 'rgba(6,182,212,0.5)' },
  2:  { main: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
  3:  { main: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  4:  { main: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  5:  { main: '#fb923c', glow: 'rgba(251,146,60,0.5)' },
  6:  { main: '#e879f9', glow: 'rgba(232,121,249,0.5)' },
  7:  { main: '#a16207', glow: 'rgba(161,98,7,0.5)' },
  8:  { main: '#22d3ee', glow: 'rgba(34,211,238,0.5)' },
  9:  { main: '#f97316', glow: 'rgba(249,115,22,0.5)' },
  10: { main: '#60a5fa', glow: 'rgba(96,165,250,0.5)' },
  11: { main: '#34d399', glow: 'rgba(52,211,153,0.5)' },
  12: { main: '#818cf8', glow: 'rgba(129,140,248,0.5)' },
  13: { main: '#fbbf24', glow: 'rgba(251,191,36,0.6)' },
  14: { main: '#f472b6', glow: 'rgba(244,114,182,0.5)' },
  15: { main: '#c084fc', glow: 'rgba(192,132,252,0.5)' },
  16: { main: '#4ade80', glow: 'rgba(74,222,128,0.5)' },
  17: { main: '#fb7185', glow: 'rgba(251,113,133,0.5)' },
  18: { main: '#e2e8f0', glow: 'rgba(226,232,240,0.5)' },
};

const POSITIONS = [
  { x: 12, y: 52 }, { x: 22, y: 28 }, { x: 33, y: 58 }, { x: 20, y: 75 },
  { x: 44, y: 38 }, { x: 54, y: 62 }, { x: 62, y: 33 }, { x: 72, y: 55 },
  { x: 47, y: 77 }, { x: 64, y: 78 }, { x: 76, y: 28 }, { x: 82, y: 50 },
  { x: 88, y: 68 }, { x: 36, y: 18 }, { x: 52, y: 20 }, { x: 70, y: 16 },
  { x: 85, y: 18 }, { x: 92, y: 38 },
];

const CONNECTIONS: [number, number][] = [
  [1,2],[1,3],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[5,9],
  [9,10],[10,11],[11,12],[3,13],[13,14],[14,15],[15,16],[16,17],[17,18],[13,15],
];

function ProgressArc({ pct, color, r }: { pct: number; color: string; r: number }) {
  const circ = 2 * Math.PI * r;
  return (
    <circle
      cx="0" cy="0" r={r}
      fill="none" stroke={color} strokeWidth="2.5"
      strokeDasharray={`${circ * pct} ${circ}`}
      strokeLinecap="round"
      transform="rotate(-90)"
      style={{ transition: 'stroke-dasharray 0.8s ease' }}
    />
  );
}

export default function GalaxyMap() {
  const getLectureCompletion = useProgressStore(s => s.getLectureCompletion);
  const getOverallCompletion = useProgressStore(s => s.getOverallCompletion);
  const overall = getOverallCompletion();

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '24px', position: 'relative' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.08em',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #f59e0b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}
        >
          PHYS183 — GALAXY MAP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}
        >
          Prof. Tracy Webb · McGill University · Click any module to begin studying
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px',
            marginTop: '10px', padding: '6px 16px', borderRadius: '20px',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>COURSE PROGRESS</span>
          <div style={{ width: '120px', height: '6px', background: 'rgba(124,58,237,0.2)', borderRadius: '3px' }}>
            <div style={{ width: `${overall * 100}%`, height: '100%',
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              borderRadius: '3px', transition: 'width 0.8s ease' }} />
          </div>
          <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 700 }}>{Math.round(overall * 100)}%</span>
        </motion.div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        {[
          { href: '/review', label: '📚 Review Center', color: '#10b981' },
          { href: '/test', label: '🎯 Test Mode', color: '#f59e0b' },
          { href: '/glossary', label: '📖 Glossary', color: '#a78bfa' },
        ].map(({ href, label, color }) => (
          <Link key={href} href={href} style={{
            padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            color, border: `1px solid ${color}40`, background: `${color}15`,
            textDecoration: 'none', transition: 'all 0.2s',
          }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Galaxy SVG Map */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        <svg
          viewBox="0 0 100 90"
          style={{ width: '100%', height: 'auto', minHeight: '480px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Nebula glow background */}
          <radialGradient id="nebula1" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <ellipse cx="50" cy="45" rx="48" ry="38" fill="url(#nebula1)" />

          {/* Connection lines */}
          {CONNECTIONS.map(([a, b]) => {
            const pa = POSITIONS[a - 1];
            const pb = POSITIONS[b - 1];
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                stroke="rgba(124,58,237,0.18)" strokeWidth="0.25"
                strokeDasharray="0.8 0.8"
              />
            );
          })}

          {/* Planet nodes */}
          {ALL_LECTURES.map((lecture, i) => {
            const pos = POSITIONS[i];
            const color = COLORS[lecture.id];
            const completion = getLectureCompletion(lecture.id as LectureId);
            const nodeR = lecture.id === 13 ? 4.2 : lecture.id <= 3 ? 3.5 : 3;

            return (
              <motion.g
                key={lecture.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
              >
                <Link href={`/lecture/${lecture.id}`}>
                  <g style={{ cursor: 'pointer' }}>
                    {/* Glow ring */}
                    <circle cx={pos.x} cy={pos.y} r={nodeR + 2.5}
                      fill="none" stroke={color.glow} strokeWidth="1.5" opacity="0.4" />
                    {/* Progress arc */}
                    <g transform={`translate(${pos.x},${pos.y})`}>
                      <circle r={nodeR + 1.2} fill="none"
                        stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                      <ProgressArc pct={completion} color={color.main} r={nodeR + 1.2} />
                    </g>
                    {/* Planet body */}
                    <circle cx={pos.x} cy={pos.y} r={nodeR}
                      fill={`${color.main}25`} stroke={color.main} strokeWidth="0.8" />
                    {/* Saturn rings for L9 */}
                    {lecture.id === 9 && (
                      <ellipse cx={pos.x} cy={pos.y} rx={nodeR + 1.8} ry="0.9"
                        fill="none" stroke={color.main} strokeWidth="0.5" opacity="0.6" />
                    )}
                    {/* Label */}
                    <text x={pos.x} y={pos.y - nodeR - 2.2}
                      textAnchor="middle" fill={color.main}
                      fontSize="1.8" fontWeight="700" letterSpacing="0.02em">
                      L{lecture.id}
                    </text>
                    <text x={pos.x} y={pos.y + nodeR + 3}
                      textAnchor="middle" fill="#94a3b8" fontSize="1.5">
                      {lecture.title.length > 16 ? lecture.title.slice(0, 14) + '…' : lecture.title}
                    </text>
                    {/* Completion dot */}
                    {completion >= 1 && (
                      <circle cx={pos.x + nodeR - 0.5} cy={pos.y - nodeR + 0.5}
                        r="1" fill="#10b981" />
                    )}
                  </g>
                </Link>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px',
          flexWrap: 'wrap' }}
      >
        {[
          { color: '#7c3aed', label: 'Not started' },
          { color: '#06b6d4', label: 'In progress' },
          { color: '#10b981', label: 'Completed ✓' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
