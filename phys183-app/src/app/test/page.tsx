'use client';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_LECTURES } from '@/data';
import { useProgressStore } from '@/store/progressStore';
import type { QuizQuestion, LectureId } from '@/types';

type QuestionWithMeta = QuizQuestion & { lectureTitle: string };
type TestConfig = { count: number; lectureIds: number[]; mode: 'practice' | 'exam' };
type Answer = { questionId: string; selected: string; correct: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TestPage() {
  const { recordQuizScore, updateWeakTopics } = useProgressStore();

  const [phase, setPhase] = useState<'config' | 'test' | 'result'>('config');
  const [config, setConfig] = useState<TestConfig>({ count: 20, lectureIds: [], mode: 'practice' });
  const [questions, setQuestions] = useState<QuestionWithMeta[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const allQuestions: QuestionWithMeta[] = useMemo(() =>
    ALL_LECTURES.flatMap(lec =>
      lec.quiz.map(q => ({ ...q, lectureTitle: lec.title }))
    ), []);

  const startTest = useCallback(() => {
    const pool = config.lectureIds.length > 0
      ? allQuestions.filter(q => config.lectureIds.includes(q.lectureId))
      : allQuestions;
    const qs = shuffle(pool).slice(0, Math.min(config.count, pool.length));
    setQuestions(qs);
    setAnswers([]);
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setPhase('test');
  }, [config, allQuestions]);

  const current = questions[currentIdx];

  const handleSelect = (choice: string) => {
    if (revealed) return;
    setSelected(choice);
    if (config.mode === 'exam') {
      const correct = choice === current.correctAnswer;
      const newAnswers = [...answers, { questionId: current.id, selected: choice, correct }];
      setAnswers(newAnswers);
      if (currentIdx + 1 >= questions.length) {
        finishTest(newAnswers);
      } else {
        setTimeout(() => {
          setCurrentIdx(i => i + 1);
          setSelected(null);
        }, 300);
      }
    } else {
      setRevealed(true);
    }
  };

  const handleNext = () => {
    if (!revealed || selected === null) return;
    const correct = selected === current.correctAnswer;
    const newAnswers = [...answers, { questionId: current.id, selected, correct }];
    setAnswers(newAnswers);
    if (currentIdx + 1 >= questions.length) {
      finishTest(newAnswers);
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const finishTest = (finalAnswers: Answer[]) => {
    const score = Math.round((finalAnswers.filter(a => a.correct).length / finalAnswers.length) * 100);
    const wrongQs = finalAnswers.filter(a => !a.correct).map(a =>
      questions.find(q => q.id === a.questionId)
    ).filter((q): q is QuestionWithMeta => q !== undefined);

    // Record per-lecture scores
    const lectureScores = new Map<LectureId, { correct: number; total: number }>();
    finalAnswers.forEach(a => {
      const q = questions.find(q => q.id === a.questionId);
      if (!q) return;
      const lid = q.lectureId;
      if (!lectureScores.has(lid)) lectureScores.set(lid, { correct: 0, total: 0 });
      const s = lectureScores.get(lid)!;
      s.total++;
      if (a.correct) s.correct++;
    });
    lectureScores.forEach((s, lid) => {
      recordQuizScore(lid, Math.round((s.correct / s.total) * 100));
    });

    if (wrongQs.length > 0) updateWeakTopics(wrongQs);
    setPhase('result');
  };

  const score = answers.filter(a => a.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ---- CONFIG SCREEN ----
  if (phase === 'config') return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
      <Link href="/" style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
        ← Galaxy Map
      </Link>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px' }}>
        Test Mode
      </h1>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 28px' }}>
        Configure your test. Wrong answers update your weak topics.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Mode */}
        <div style={{ padding: '20px', borderRadius: '12px',
          background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(71,85,105,0.2)' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700, marginBottom: '12px' }}>MODE</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {([['practice', '📚', 'Practice', 'See answers immediately'] as const,
               ['exam', '🎓', 'Exam', 'No feedback until end'] as const]).map(([id, icon, label, desc]) => (
              <button key={id} onClick={() => setConfig(c => ({ ...c, mode: id }))} style={{
                flex: 1, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: config.mode === id ? 'rgba(99,102,241,0.15)' : 'rgba(3,3,10,0.6)',
                borderWidth: '1px', borderStyle: 'solid',
                borderColor: config.mode === id ? 'rgba(99,102,241,0.4)' : 'rgba(71,85,105,0.15)',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700,
                  color: config.mode === id ? '#818cf8' : '#94a3b8' }}>{label}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div style={{ padding: '20px', borderRadius: '12px',
          background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(71,85,105,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>QUESTIONS</div>
            <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: 700 }}>{config.count}</span>
          </div>
          <input type="range" min="5" max={Math.min(60, allQuestions.length)} step="5"
            value={config.count} onChange={e => setConfig(c => ({ ...c, count: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: '#6366f1' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px',
            color: '#334155', marginTop: '4px' }}>
            <span>5</span><span>{Math.min(60, allQuestions.length)} max</span>
          </div>
        </div>

        {/* Lectures */}
        <div style={{ padding: '20px', borderRadius: '12px',
          background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(71,85,105,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>LECTURES</div>
            <button onClick={() => setConfig(c => ({ ...c, lectureIds: [] }))}
              style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              All
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {ALL_LECTURES.map(lec => {
              const active = config.lectureIds.includes(lec.id);
              return (
                <button key={lec.id} onClick={() => setConfig(c => ({
                  ...c,
                  lectureIds: active ? c.lectureIds.filter(id => id !== lec.id) : [...c.lectureIds, lec.id]
                }))} style={{
                  padding: '8px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 700,
                  background: active ? 'rgba(99,102,241,0.2)' : 'rgba(3,3,10,0.6)',
                  color: active ? '#818cf8' : '#475569',
                  borderWidth: '1px', borderStyle: 'solid',
                  borderColor: active ? 'rgba(99,102,241,0.4)' : 'rgba(71,85,105,0.1)',
                }}>
                  L{lec.id}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>
            {config.lectureIds.length === 0 ? 'All lectures' : `${config.lectureIds.length} lectures selected`}
          </div>
        </div>

        <button onClick={startTest} style={{
          padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
          color: 'white', fontSize: '16px', fontWeight: 700 }}>
          Start Test →
        </button>
      </div>
    </main>
  );

  // ---- TEST SCREEN ----
  if (phase === 'test' && current) return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{currentIdx + 1} / {questions.length}</span>
          <span style={{ fontSize: '12px', color: '#6366f1' }}>{current.lectureTitle}</span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(71,85,105,0.3)' }}>
          <motion.div style={{ height: '100%', borderRadius: '2px', background: '#6366f1' }}
            animate={{ width: `${(currentIdx / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

          <div style={{ padding: '24px', borderRadius: '14px', marginBottom: '16px',
            background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              {current.type === 'true-false' ? 'True / False' : 'Multiple Choice'}
            </div>
            <p style={{ margin: 0, color: '#e2e8f0', fontSize: '17px', lineHeight: '1.6', fontWeight: 500 }}>
              {current.prompt}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {(current.choices ?? []).map((choice, i) => {
              const isCorrect = choice === current.correctAnswer;
              const isSelected = selected === choice;

              let bg = 'rgba(13,13,43,0.7)';
              let border = 'rgba(71,85,105,0.2)';
              let color = '#cbd5e1';

              if (revealed) {
                if (isCorrect) { bg = 'rgba(16,185,129,0.1)'; border = 'rgba(16,185,129,0.4)'; color = '#10b981'; }
                else if (isSelected) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.4)'; color = '#ef4444'; }
              } else if (isSelected) {
                bg = 'rgba(99,102,241,0.12)'; border = 'rgba(99,102,241,0.5)'; color = '#818cf8';
              }

              return (
                <button key={i} onClick={() => handleSelect(choice)} style={{
                  padding: '14px 16px', borderRadius: '10px', border: `1px solid ${border}`,
                  background: bg, color, cursor: revealed ? 'default' : 'pointer',
                  fontSize: '14px', textAlign: 'left', transition: 'all 0.2s', lineHeight: '1.4',
                }}>
                  <span style={{ fontWeight: 700, marginRight: '10px', opacity: 0.6 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {choice}
                  {revealed && isCorrect && ' ✓'}
                  {revealed && isSelected && !isCorrect && ' ✗'}
                </button>
              );
            })}
          </div>

          {revealed && config.mode === 'practice' && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '16px', borderRadius: '10px', marginBottom: '14px',
                  background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>
                  Explanation
                </div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  {current.explanation}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {config.mode === 'practice' && (
            <button onClick={handleNext} disabled={!revealed}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                cursor: revealed ? 'pointer' : 'not-allowed',
                background: revealed ? 'rgba(99,102,241,0.15)' : 'rgba(13,13,43,0.5)',
                color: revealed ? '#818cf8' : '#334155', fontSize: '15px', fontWeight: 700,
              }}>
              {currentIdx + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );

  // ---- RESULT SCREEN ----
  if (phase === 'result') return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', borderRadius: '20px',
          background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '📚' : '🔄'}
          </div>
          <div style={{ fontSize: '52px', fontWeight: 800,
            color: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444', marginBottom: '8px' }}>
            {pct}%
          </div>
          <div style={{ color: '#94a3b8', fontSize: '16px' }}>{score} / {questions.length} correct</div>
          <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
            {pct >= 90 ? 'Excellent! You know this material.' :
              pct >= 70 ? 'Good work! Review weak topics to push higher.' :
              pct >= 50 ? 'Keep studying — review wrong answers.' :
              'Time to revisit the lectures.'}
          </div>
        </div>

        {/* Wrong answers */}
        {config.mode === 'practice' && answers.some(a => !a.correct) && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#ef4444', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              Review These
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {answers.filter(a => !a.correct).map(a => {
                const q = questions.find(q => q.id === a.questionId);
                if (!q) return null;
                return (
                  <div key={a.questionId} style={{ padding: '14px', borderRadius: '10px',
                    background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div style={{ fontSize: '11px', color: '#6366f1', marginBottom: '4px' }}>{q.lectureTitle}</div>
                    <p style={{ margin: '0 0 8px', color: '#cbd5e1', fontSize: '13px' }}>{q.prompt}</p>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Your answer: <span style={{ color: '#ef4444' }}>{a.selected}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Correct: <span style={{ color: '#10b981' }}>{q.correctAnswer as string}</span>
                    </div>
                    {q.explanation && (
                      <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setPhase('config')} style={{
            flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.08)', color: '#818cf8', cursor: 'pointer',
            fontSize: '14px', fontWeight: 700 }}>
            New Test
          </button>
          <button onClick={startTest} style={{
            flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: 'white', fontSize: '14px', fontWeight: 700 }}>
            Retry →
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link href="/review" style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none' }}>
            → Go to Review Center
          </Link>
        </div>
      </motion.div>
    </main>
  );

  return null;
}
