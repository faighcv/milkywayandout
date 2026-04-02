'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_LECTURES } from '@/data';
import { useProgressStore } from '@/store/progressStore';
import type { FlashCard, LectureId } from '@/types';

type CardWithLecture = FlashCard & { lectureName: string };

export default function ReviewPage() {
  const { lectures, weakTopics, markCardMastered } = useProgressStore();
  const [filter, setFilter] = useState<'pending' | 'mastered'>('pending');
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const masteredIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(lectures).forEach(lp => {
      lp?.flashCardsMastered.forEach(id => ids.add(id));
    });
    return ids;
  }, [lectures]);

  const weakTags = useMemo(() => new Set(weakTopics.map(w => w.tag)), [weakTopics]);

  const allCards: CardWithLecture[] = useMemo(() => {
    return ALL_LECTURES.flatMap(lec =>
      lec.flashCards.map(card => ({ ...card, lectureName: lec.title }))
    );
  }, []);

  const filteredCards = useMemo(() => {
    let cards = allCards;
    if (selectedLecture !== null) cards = cards.filter(c => c.lectureId === selectedLecture);
    if (filter === 'mastered') {
      cards = cards.filter(c => masteredIds.has(c.id));
    } else {
      cards = cards.filter(c => !masteredIds.has(c.id));
    }
    return cards;
  }, [allCards, selectedLecture, filter, masteredIds]);

  const current = filteredCards[currentIdx];

  const handleMastered = () => {
    if (!current) return;
    markCardMastered(current.lectureId, current.id);
    setFlipped(false);
    if (currentIdx >= filteredCards.length - 1) setCurrentIdx(Math.max(0, currentIdx - 1));
  };

  const advance = (dir: 1 | -1) => {
    setFlipped(false);
    setTimeout(() => setCurrentIdx(i => Math.max(0, Math.min(filteredCards.length - 1, i + dir))), 150);
  };

  const totalMastered = masteredIds.size;
  const totalCards = allCards.length;

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link href="/" style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          ← Galaxy Map
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px' }}>
          Review Center
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          {totalCards} total flashcards · {totalMastered} mastered
          {weakTopics.length > 0 && (
            <span style={{ marginLeft: '12px', color: '#ef4444' }}>
              ⚠ {weakTopics.length} weak tag{weakTopics.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {([['pending', '📚 To Review'], ['mastered', '✅ Mastered']] as const).map(([f, label]) => (
          <button key={f} onClick={() => { setFilter(f); setCurrentIdx(0); setFlipped(false); }} style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
            background: filter === f ? (f === 'mastered' ? '#10b98120' : '#6366f120') : 'rgba(13,13,43,0.8)',
            color: filter === f ? (f === 'mastered' ? '#10b981' : '#818cf8') : '#64748b',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: filter === f ? (f === 'mastered' ? '#10b98140' : '#6366f140') : 'transparent',
          }}>
            {label}
          </button>
        ))}

        <select value={selectedLecture ?? ''} onChange={e => { setSelectedLecture(e.target.value ? Number(e.target.value) : null); setCurrentIdx(0); setFlipped(false); }}
          style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(13,13,43,0.9)',
            border: '1px solid rgba(148,163,184,0.15)', color: '#94a3b8', fontSize: '13px',
            cursor: 'pointer', flex: 1, minWidth: '160px' }}>
          <option value="">All Lectures</option>
          {ALL_LECTURES.map(lec => (
            <option key={lec.id} value={lec.id}>L{lec.id}: {lec.title}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'In Queue', value: filteredCards.length, color: '#6366f1' },
          { label: 'Mastered', value: totalMastered, color: '#10b981' },
          { label: 'Remaining', value: totalCards - totalMastered, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ padding: '14px', borderRadius: '10px',
            background: `${stat.color}0a`, border: `1px solid ${stat.color}25`, textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weak tags */}
      {weakTopics.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 700, marginBottom: '6px' }}>
            Weak topics — focus your review here:
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {weakTopics.slice(0, 12).map(w => (
              <span key={w.tag} style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '11px',
                background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)' }}>
                {w.tag} ({w.incorrectCount} wrong)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flashcard */}
      {filteredCards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '16px',
          background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(148,163,184,0.15)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {filter === 'mastered' ? '🏆' : '✨'}
          </div>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            {filter === 'mastered' ? 'No mastered cards yet — start reviewing!' :
              'All cards in this set are mastered!'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '12px', color: '#475569' }}>
            Card {currentIdx + 1} of {filteredCards.length} · {current?.lectureName}
          </div>

          {/* 3D flip card */}
          <div style={{ perspective: '1200px', marginBottom: '14px', height: '240px' }}
            onClick={() => setFlipped(f => !f)}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d', cursor: 'pointer' }}>

              {/* Front */}
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                borderRadius: '16px', background: 'rgba(13,13,43,0.9)',
                border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '28px', gap: '12px' }}>
                <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em' }}>Question</div>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '18px', fontWeight: 600,
                  textAlign: 'center', lineHeight: '1.5' }}>
                  {current?.front}
                </p>
                <div style={{ fontSize: '11px', color: '#334155', marginTop: '8px' }}>
                  Click to reveal answer
                </div>
              </div>

              {/* Back */}
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '16px', background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '28px', gap: '12px' }}>
                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em' }}>Answer</div>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '16px',
                  textAlign: 'center', lineHeight: '1.6' }}>
                  {current?.back}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => advance(-1)} disabled={currentIdx === 0} style={{
              padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.15)',
              background: 'rgba(148,163,184,0.05)', color: currentIdx === 0 ? '#334155' : '#94a3b8',
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              ← Prev
            </button>
            <AnimatePresence>
              {flipped && filter === 'pending' && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleMastered} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: '1px solid rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.12)',
                  color: '#10b981', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                  ✅ Got it
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {flipped && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => advance(1)} disabled={currentIdx >= filteredCards.length - 1} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
                  color: currentIdx >= filteredCards.length - 1 ? '#475569' : '#ef4444',
                  cursor: currentIdx >= filteredCards.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 600 }}>
                  🔄 Review again
                </motion.button>
              )}
            </AnimatePresence>
            <button onClick={() => advance(1)} disabled={currentIdx >= filteredCards.length - 1} style={{
              padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
              color: currentIdx >= filteredCards.length - 1 ? '#334155' : '#818cf8',
              cursor: currentIdx >= filteredCards.length - 1 ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
              Next →
            </button>
          </div>
        </>
      )}

      {/* Lecture progress grid */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
          Lecture Progress
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
          {ALL_LECTURES.map(lec => {
            const lp = lectures[lec.id as LectureId];
            const lecMastered = lp?.flashCardsMastered.length ?? 0;
            const pct = Math.round((lecMastered / lec.flashCards.length) * 100);
            const isWeak = weakTopics.some(w => lec.flashCards.some(c => c.tags.includes(w.tag)));
            return (
              <Link key={lec.id} href={`/lecture/${lec.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px', borderRadius: '10px', cursor: 'pointer',
                  background: 'rgba(13,13,43,0.7)',
                  border: `1px solid ${isWeak ? 'rgba(239,68,68,0.3)' : 'rgba(71,85,105,0.2)'}`,
                  transition: 'border-color 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700 }}>L{lec.id}</span>
                    <span style={{ fontSize: '11px', color: pct === 100 ? '#10b981' : '#64748b' }}>
                      {lecMastered}/{lec.flashCards.length}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.3', marginBottom: '8px' }}>
                    {lec.title}
                  </div>
                  <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(71,85,105,0.3)' }}>
                    <div style={{ height: '100%', borderRadius: '2px', width: `${pct}%`,
                      background: pct === 100 ? '#10b981' : '#6366f1', transition: 'width 0.5s' }} />
                  </div>
                  {isWeak && <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px' }}>⚠ weak topic</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
