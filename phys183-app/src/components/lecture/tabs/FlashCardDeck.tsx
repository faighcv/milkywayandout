'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lecture } from '@/types';
import { useProgressStore } from '@/store/progressStore';

function FlashCard({
  front, back, mastered, onMastered, onReview,
}: { front: string; back: string; mastered: boolean; onMastered: () => void; onReview: () => void }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ perspective: '1200px', width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <motion.div
        onClick={() => setFlipped(f => !f)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'relative', transformStyle: 'preserve-3d',
          cursor: 'pointer', height: '220px',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: '16px', padding: '32px',
          background: 'linear-gradient(135deg, rgba(13,13,43,0.95), rgba(19,19,77,0.95))',
          border: '1px solid rgba(124,58,237,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase' }}>Click to flip ↓</span>
          <p style={{ fontSize: '18px', color: '#e2e8f0', textAlign: 'center',
            lineHeight: '1.6', margin: 0, fontWeight: 500 }}>
            {front}
          </p>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '16px', padding: '28px',
          background: 'linear-gradient(135deg, rgba(7,89,133,0.3), rgba(13,13,43,0.95))',
          border: '1px solid rgba(6,182,212,0.4)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <p style={{ fontSize: '16px', color: '#e2e8f0', textAlign: 'center',
            lineHeight: '1.7', margin: 0 }}>
            {back}
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}
          >
            <button onClick={e => { e.stopPropagation(); onMastered(); setFlipped(false); }} style={{
              padding: '10px 28px', borderRadius: '10px',
              background: '#10b98120', border: '1px solid #10b981',
              color: '#10b981', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}>
              ✓ Got it!
            </button>
            <button onClick={e => { e.stopPropagation(); onReview(); setFlipped(false); }} style={{
              padding: '10px 28px', borderRadius: '10px', border: '1px solid #ef4444',
              background: '#ef444420', color: '#f87171', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer',
            }}>
              ↺ Review again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlashCardDeck({ lecture }: { lecture: Lecture }) {
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState(lecture.flashCards);
  const { markCardMastered, lectures } = useProgressStore();
  const mastered = lectures[lecture.id]?.flashCardsMastered ?? [];

  function shuffle() {
    setCards(c => [...c].sort(() => Math.random() - 0.5));
    setIndex(0);
    setShuffled(true);
  }

  const card = cards[index];
  const isMastered = mastered.includes(card.id);

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px', padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(13,13,43,0.7)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>
          Card {index + 1} / {cards.length}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
            ✓ {mastered.length} / {cards.length} mastered
          </span>
          <div style={{ width: '100px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
            <div style={{ width: `${(mastered.length / cards.length) * 100}%`,
              height: '100%', background: '#10b981', borderRadius: '3px', transition: 'width 0.4s' }} />
          </div>
        </div>
        <button onClick={shuffle} style={{ padding: '6px 14px', borderRadius: '8px',
          background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
          color: '#a78bfa', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          🔀 Shuffle
        </button>
      </div>

      {/* Mastered badge */}
      {isMastered && (
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
            background: '#10b98120', border: '1px solid #10b981', color: '#10b981' }}>
            ✓ Mastered
          </span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${card.id}-${shuffled}`}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.2 }}
        >
          <FlashCard
            front={card.front} back={card.back} mastered={isMastered}
            onMastered={() => markCardMastered(lecture.id, card.id)}
            onReview={() => {}}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '16px', marginTop: '28px' }}>
        <button
          onClick={() => setIndex(i => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.2)',
            background: 'rgba(148,163,184,0.05)', color: index === 0 ? '#475569' : '#94a3b8',
            fontSize: '14px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}
        >
          ← Previous
        </button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {cards.slice(Math.max(0, index - 3), index + 4).map((c, i) => {
            const realIdx = Math.max(0, index - 3) + i;
            return (
              <button key={c.id} onClick={() => setIndex(realIdx)} style={{
                width: realIdx === index ? '24px' : '8px', height: '8px',
                borderRadius: '4px', border: 'none', cursor: 'pointer',
                background: realIdx === index ? lecture.planetStyle.color
                  : mastered.includes(c.id) ? '#10b981' : 'rgba(148,163,184,0.3)',
                transition: 'all 0.3s',
              }} />
            );
          })}
        </div>

        <button
          onClick={() => setIndex(i => Math.min(cards.length - 1, i + 1))}
          disabled={index === cards.length - 1}
          style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.2)',
            background: 'rgba(148,163,184,0.05)',
            color: index === cards.length - 1 ? '#475569' : '#94a3b8',
            fontSize: '14px', cursor: index === cards.length - 1 ? 'not-allowed' : 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
