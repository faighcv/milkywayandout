'use client';
import { motion } from 'framer-motion';
import type { Lecture } from '@/types';

export default function BigPicture({ lecture }: { lecture: Lecture }) {
  const c = lecture.planetStyle.color;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hook paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '28px', borderRadius: '16px',
          background: `linear-gradient(135deg, ${c}12, rgba(13,13,43,0.9))`,
          border: `1px solid ${c}30`,
        }}
      >
        <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#e2e8f0',
          fontStyle: 'italic', margin: 0 }}>
          "{lecture.bigPicture}"
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Key Questions */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ padding: '20px', borderRadius: '12px',
            background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            🔭 Key Questions
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lecture.keyQuestions.map((q, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: c, fontWeight: 700, fontSize: '14px', minWidth: '18px' }}>
                  {i + 1}.
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>{q}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Common Confusions */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ padding: '20px', borderRadius: '12px',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f87171',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            ⚠️ Common Confusions
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lecture.commonConfusions.map((c, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#f87171', fontSize: '14px', minWidth: '18px' }}>✗</span>
                <span style={{ color: '#fca5a5', fontSize: '13px', lineHeight: '1.5' }}>{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Memory Tricks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: '20px', borderRadius: '12px',
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            💡 Memory Tricks
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lecture.memoryTricks.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px' }}>🧠</span>
                <span style={{ color: '#fde68a', fontSize: '13px', lineHeight: '1.5' }}>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Exam Tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ padding: '20px', borderRadius: '12px',
            background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}
        >
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#34d399',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 14px' }}>
            🎓 Exam Tips
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lecture.examTips.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '13px', minWidth: '18px' }}>
                  ★
                </span>
                <span style={{ color: '#6ee7b7', fontSize: '13px', lineHeight: '1.5' }}>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
