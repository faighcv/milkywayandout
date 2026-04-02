'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lecture } from '@/types';

export default function SummaryView({ lecture }: { lecture: Lecture }) {
  const [open, setOpen] = useState<number[]>([0]);
  const c = lecture.planetStyle.color;

  function toggle(i: number) {
    setOpen(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Summary accordion */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0',
          letterSpacing: '0.05em', margin: '0 0 14px' }}>
          📋 Key Takeaways
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lecture.summary.map((section, i) => (
            <div key={i} style={{ borderRadius: '12px',
              background: 'rgba(13,13,43,0.8)', border: `1px solid ${open.includes(i) ? c + '40' : 'rgba(148,163,184,0.1)'}`,
              overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <button
                onClick={() => toggle(i)}
                style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', textAlign: 'left' }}
              >
                <span style={{ fontSize: '15px', fontWeight: 600,
                  color: open.includes(i) ? c : '#cbd5e1' }}>
                  {section.heading}
                </span>
                <motion.span
                  animate={{ rotate: open.includes(i) ? 180 : 0 }}
                  style={{ color: '#64748b', fontSize: '18px', display: 'block' }}
                >
                  ↓
                </motion.span>
              </button>
              <AnimatePresence>
                {open.includes(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <ul style={{ padding: '0 20px 16px 20px', margin: 0,
                      listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {section.bullets.map((b, j) => (
                        <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span style={{ color: c, fontWeight: 700, minWidth: '16px',
                            marginTop: '2px', fontSize: '14px' }}>→</span>
                          <span style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Glossary terms */}
      {lecture.glossaryTerms.length > 0 && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0',
            letterSpacing: '0.05em', margin: '0 0 14px' }}>
            🔤 Key Terms in This Lecture
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {lecture.glossaryTerms.map(term => (
              <a key={term} href={`/glossary?term=${encodeURIComponent(term)}`} style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                background: `${c}12`, border: `1px solid ${c}30`, color: c,
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                {term}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Exam recap */}
      <div style={{ padding: '20px', borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(13,13,43,0.9))',
        border: '1px solid rgba(16,185,129,0.3)' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#34d399',
          letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
          🎓 Exam-Style Recap
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lecture.examTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#34d399', fontWeight: 700, minWidth: '20px' }}>
                {i + 1}.
              </span>
              <span style={{ color: '#6ee7b7', fontSize: '14px', lineHeight: '1.5' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
