'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lecture, QuizQuestion } from '@/types';
import { useProgressStore } from '@/store/progressStore';

function QuestionCard({
  q, qIndex, total, onAnswer,
}: { q: QuizQuestion; qIndex: number; total: number; onAnswer: (correct: boolean, q: QuizQuestion) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const choices = q.choices ?? ['True', 'False'];
  const correct = typeof q.correctAnswer === 'string' ? q.correctAnswer : q.correctAnswer[0];

  function handleSelect(choice: string) {
    if (selected) return;
    setSelected(choice);
    setTimeout(() => onAnswer(choice === correct, q), 1200);
  }

  const diffColor = q.difficulty === 1 ? '#10b981' : q.difficulty === 2 ? '#f59e0b' : '#ef4444';
  const diffLabel = q.difficulty === 1 ? 'Easy' : q.difficulty === 2 ? 'Medium' : 'Hard';

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Question {qIndex + 1} of {total}
        </span>
        <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '11px',
          fontWeight: 700, background: `${diffColor}20`, color: diffColor,
          border: `1px solid ${diffColor}40` }}>
          {diffLabel}
        </span>
      </div>

      {/* Question */}
      <div style={{ padding: '24px', borderRadius: '14px', marginBottom: '20px',
        background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(124,58,237,0.25)' }}>
        <p style={{ fontSize: '18px', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
          {q.prompt}
        </p>
      </div>

      {/* Choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {choices.map(choice => {
          const isSelected = selected === choice;
          const isCorrect = choice === correct;
          let bg = 'rgba(13,13,43,0.7)';
          let border = 'rgba(148,163,184,0.2)';
          let color = '#cbd5e1';
          if (selected) {
            if (isCorrect) { bg = 'rgba(16,185,129,0.15)'; border = '#10b981'; color = '#6ee7b7'; }
            else if (isSelected) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color = '#fca5a5'; }
          } else if (isSelected) { bg = 'rgba(124,58,237,0.15)'; border = '#7c3aed'; color = '#c4b5fd'; }

          return (
            <motion.button
              key={choice}
              onClick={() => handleSelect(choice)}
              whileHover={!selected ? { scale: 1.01 } : {}}
              whileTap={!selected ? { scale: 0.99 } : {}}
              style={{
                padding: '14px 20px', borderRadius: '10px', border: `1px solid ${border}`,
                background: bg, color, fontSize: '15px', textAlign: 'left',
                cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}
            >
              {selected && isCorrect && <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>}
              {selected && isSelected && !isCorrect && <span style={{ color: '#ef4444', fontWeight: 700 }}>✗</span>}
              {!selected && <span style={{ color: '#475569', fontSize: '13px' }}>○</span>}
              {choice}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginTop: '16px' }}
          >
            <div style={{ padding: '16px 20px', borderRadius: '10px',
              background: selected === correct ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${selected === correct ? '#10b981' : '#ef4444'}40` }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6',
                color: selected === correct ? '#6ee7b7' : '#fca5a5' }}>
                <strong>{selected === correct ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
                {q.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuizPanel({ lecture }: { lecture: Lecture }) {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongQs, setWrongQs] = useState<QuizQuestion[]>([]);
  const { recordQuizScore, updateWeakTopics } = useProgressStore();

  function handleAnswer(correct: boolean, q: QuizQuestion) {
    if (correct) setScore(s => s + 1);
    else setWrongQs(prev => [...prev, q]);

    if (qIndex + 1 >= lecture.quiz.length) {
      const finalScore = (correct ? score + 1 : score) / lecture.quiz.length;
      recordQuizScore(lecture.id, finalScore);
      if (!correct) updateWeakTopics([q]);
      setDone(true);
    } else {
      setQIndex(i => i + 1);
    }
  }

  function restart() {
    setQIndex(0); setScore(0); setDone(false); setWrongQs([]);
  }

  if (done) {
    const pct = Math.round((score / lecture.quiz.length) * 100);
    const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ padding: '40px', borderRadius: '20px',
          background: 'rgba(13,13,43,0.9)', border: `1px solid ${color}40` }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {pct >= 80 ? '🌟' : pct >= 60 ? '📚' : '💪'}
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color, margin: '0 0 8px' }}>
            {pct}%
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 24px' }}>
            {score} / {lecture.quiz.length} correct
          </p>
          {wrongQs.length > 0 && (
            <div style={{ textAlign: 'left', marginBottom: '24px', padding: '16px',
              borderRadius: '10px', background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ color: '#f87171', fontSize: '13px', fontWeight: 700,
                margin: '0 0 10px' }}>Review these topics:</p>
              {wrongQs.map(q => (
                <p key={q.id} style={{ color: '#fca5a5', fontSize: '13px',
                  margin: '0 0 4px' }}>• {q.tags.join(', ')}</p>
              ))}
            </div>
          )}
          <button onClick={restart} style={{ padding: '12px 32px', borderRadius: '10px',
            background: `${color}20`, border: `1px solid ${color}`,
            color, fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }}
        >
          <QuestionCard
            q={lecture.quiz[qIndex]}
            qIndex={qIndex}
            total={lecture.quiz.length}
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
