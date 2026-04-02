'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Lecture, TabKey } from '@/types';
import { useProgressStore } from '@/store/progressStore';
import BigPicture from './tabs/BigPicture';
import InteractiveContent from './tabs/InteractiveContent';
import FlashCardDeck from './tabs/FlashCardDeck';
import QuizPanel from './tabs/QuizPanel';
import SummaryView from './tabs/SummaryView';
import ConnectionsMap from './tabs/ConnectionsMap';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'bigPicture',  label: 'Big Picture',   icon: '🌌' },
  { key: 'content',     label: 'Interactive',   icon: '⚡' },
  { key: 'flashCards',  label: 'Flashcards',    icon: '🃏' },
  { key: 'quiz',        label: 'Quiz',          icon: '🎯' },
  { key: 'summary',     label: 'Summary',       icon: '📋' },
  { key: 'connections', label: 'Connections',   icon: '🔗' },
];

export default function LectureShell({ lecture }: { lecture: Lecture }) {
  const [activeTab, setActiveTab] = useState<TabKey>('bigPicture');
  const { markTabComplete, getLectureCompletion } = useProgressStore();
  const completion = getLectureCompletion(lecture.id);

  useEffect(() => {
    markTabComplete(lecture.id, activeTab);
  }, [activeTab, lecture.id]);

  const tabContent: Record<TabKey, React.ReactNode> = {
    bigPicture:  <BigPicture lecture={lecture} />,
    content:     <InteractiveContent lecture={lecture} />,
    flashCards:  <FlashCardDeck lecture={lecture} />,
    quiz:        <QuizPanel lecture={lecture} />,
    summary:     <SummaryView lecture={lecture} />,
    connections: <ConnectionsMap lecture={lecture} />,
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Back + Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link href="/" style={{
          padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#94a3b8',
          border: '1px solid rgba(148,163,184,0.2)', textDecoration: 'none',
          background: 'rgba(148,163,184,0.05)',
        }}>
          ← Galaxy Map
        </Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
              background: `${lecture.planetStyle.color}20`,
              border: `1px solid ${lecture.planetStyle.color}40`,
              color: lecture.planetStyle.color, letterSpacing: '0.05em',
            }}>
              LECTURE {lecture.id}
            </span>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
              {lecture.title}
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            {lecture.subtitle}
          </p>
        </div>
        {/* Progress ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="42" height="42" viewBox="0 0 42 42">
            <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="3" />
            <circle cx="21" cy="21" r="17" fill="none"
              stroke={lecture.planetStyle.color} strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 17 * completion} ${2 * Math.PI * 17}`}
              strokeLinecap="round" transform="rotate(-90 21 21)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            <text x="21" y="21" textAnchor="middle" dominantBaseline="central"
              fill="#e2e8f0" fontSize="8" fontWeight="bold">
              {Math.round(completion * 100)}%
            </text>
          </svg>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: '4px', padding: '6px',
        background: 'rgba(13,13,43,0.8)', borderRadius: '14px',
        border: '1px solid rgba(124,58,237,0.2)', marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? lecture.planetStyle.color : '#64748b',
              background: activeTab === tab.key
                ? `${lecture.planetStyle.color}18`
                : 'transparent',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
              position: 'relative',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
