'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Lecture } from '@/types';
import { LECTURE_MAP } from '@/data';

export default function ConnectionsMap({ lecture }: { lecture: Lecture }) {
  const prereqs = lecture.prerequisites.map(id => LECTURE_MAP[id]).filter(Boolean);
  const nexts = lecture.connects.map(id => LECTURE_MAP[id]).filter(Boolean);
  const c = lecture.planetStyle.color;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '14px' }}>
        Understanding how lectures connect helps you build a complete mental model of the course.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Prerequisites */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px',
            textAlign: 'center' }}>
            ← Prerequisites
          </h3>
          {prereqs.length === 0 ? (
            <div style={{ padding: '20px', borderRadius: '10px', textAlign: 'center',
              background: 'rgba(13,13,43,0.5)', border: '1px solid rgba(148,163,184,0.1)',
              color: '#475569', fontSize: '13px' }}>
              This is a starting module
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prereqs.map((lec, i) => (
                <motion.div
                  key={lec.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/lecture/${lec.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: `${lec.planetStyle.color}10`,
                      border: `1px solid ${lec.planetStyle.color}30`, transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%',
                          background: lec.planetStyle.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '11px', color: lec.planetStyle.color,
                            fontWeight: 700 }}>L{lec.id}</div>
                          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{lec.title}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Current */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '16px 20px', borderRadius: '14px', textAlign: 'center',
            background: `${c}20`, border: `2px solid ${c}60`,
            boxShadow: `0 0 24px ${c}30`, minWidth: '120px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: c }}>L{lecture.id}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {lecture.title.length > 14 ? lecture.title.slice(0, 12) + '…' : lecture.title}
            </div>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
              ← You are here →
            </div>
          </div>
        </div>

        {/* Forward connections */}
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px',
            textAlign: 'center' }}>
            Leads to →
          </h3>
          {nexts.length === 0 ? (
            <div style={{ padding: '20px', borderRadius: '10px', textAlign: 'center',
              background: 'rgba(13,13,43,0.5)', border: '1px solid rgba(148,163,184,0.1)',
              color: '#475569', fontSize: '13px' }}>
              Course finale!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {nexts.map((lec, i) => (
                <motion.div
                  key={lec.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/lecture/${lec.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: `${lec.planetStyle.color}10`,
                      border: `1px solid ${lec.planetStyle.color}30`, transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%',
                          background: lec.planetStyle.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '11px', color: lec.planetStyle.color,
                            fontWeight: 700 }}>L{lec.id}</div>
                          <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{lec.title}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Big picture connection note */}
      <div style={{ padding: '16px 20px', borderRadius: '12px', marginTop: '8px',
        background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#a78bfa', lineHeight: '1.6' }}>
          <strong>💡 Course Arc:</strong> PHYS183 builds from observation methods (L1-4) → solar system
          formation (L5-9) → other planetary systems (L10-12) → stars from birth to death (L13-18).
          Each module reinforces the others.
        </p>
      </div>
    </div>
  );
}
