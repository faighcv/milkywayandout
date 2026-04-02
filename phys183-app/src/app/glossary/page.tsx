'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOSSARY } from '@/data/glossary';

// Derive categories from relatedTerms context by grouping on first lectureId
// Since GlossaryEntry has no category field, we group by first lecture range
function getLectureGroup(lectureIds: number[]): string {
  if (lectureIds.length === 0) return 'General';
  const min = Math.min(...lectureIds);
  if (min <= 3) return 'Foundations';
  if (min <= 6) return 'Solar System';
  if (min <= 9) return 'Stars';
  if (min <= 12) return 'Stellar Evolution';
  if (min <= 15) return 'Galaxies';
  return 'Cosmology';
}

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const GROUPS = useMemo(() => {
    const gs = new Set(GLOSSARY.map(g => getLectureGroup(g.lectureIds)));
    return ['All', ...Array.from(gs).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GLOSSARY.filter(g => {
      const matchGroup = group === 'All' || getLectureGroup(g.lectureIds) === group;
      const matchSearch = !q || g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        g.relatedTerms.some(r => r.toLowerCase().includes(q));
      return matchGroup && matchSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, group]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(g => {
      const letter = g.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(g);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link href="/" style={{ color: '#6366f1', fontSize: '13px', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          ← Galaxy Map
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0', margin: '0 0 8px' }}>
          Visual Glossary
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
          {GLOSSARY.length} terms from PHYS183 — Astronomy of Stars and Galaxies
        </p>
      </div>

      {/* Search + group filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: '#475569', fontSize: '14px' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms, definitions..."
            style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px',
              background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(71,85,105,0.3)',
              color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <select value={group} onChange={e => setGroup(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(13,13,43,0.9)',
            border: '1px solid rgba(71,85,105,0.2)', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
          {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {search && ` for "${search}"`}
        {group !== 'All' && ` in ${group}`}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '14px',
          background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(71,85,105,0.2)',
          color: '#475569', fontSize: '16px' }}>
          No terms found. Try a different search.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {grouped.map(([letter, terms]) => (
            <div key={letter}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#6366f1',
                marginBottom: '10px', paddingBottom: '6px',
                borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
                {letter}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '10px' }}>
                {terms.map(g => (
                  <motion.div key={g.term} layout
                    onClick={() => setExpanded(expanded === g.term ? null : g.term)}
                    style={{
                      padding: '14px', borderRadius: '12px', cursor: 'pointer',
                      background: expanded === g.term ? 'rgba(99,102,241,0.08)' : 'rgba(13,13,43,0.7)',
                      border: `1px solid ${expanded === g.term ? 'rgba(99,102,241,0.3)' : 'rgba(71,85,105,0.15)'}`,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', lineHeight: '1.3' }}>
                        {g.term}
                      </div>
                      {g.lectureIds.length > 0 && (
                        <div style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                          background: 'rgba(99,102,241,0.12)', color: '#818cf8',
                          whiteSpace: 'nowrap', flexShrink: 0 }}>
                          L{g.lectureIds[0]}
                        </div>
                      )}
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', lineHeight: '1.6' }}>
                      {expanded === g.term
                        ? g.definition
                        : g.definition.slice(0, 100) + (g.definition.length > 100 ? '…' : '')}
                    </p>

                    <AnimatePresence>
                      {expanded === g.term && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}>
                          {g.relatedTerms.length > 0 && (
                            <div style={{ marginTop: '10px', paddingTop: '10px',
                              borderTop: '1px solid rgba(71,85,105,0.15)' }}>
                              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 700,
                                marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Related
                              </div>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {g.relatedTerms.map(r => (
                                  <button key={r} onClick={e => { e.stopPropagation(); setSearch(r); setExpanded(null); }}
                                    style={{ padding: '3px 10px', borderRadius: '6px', border: 'none',
                                      background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                                      fontSize: '12px', cursor: 'pointer' }}>
                                    {r}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {g.lectureIds.length > 0 && (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {g.lectureIds.map(lid => (
                                <Link key={lid} href={`/lecture/${lid}`}
                                  onClick={e => e.stopPropagation()}
                                  style={{ fontSize: '11px', color: '#6366f1', textDecoration: 'none' }}>
                                  → Lecture {lid}
                                </Link>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group legend */}
      <div style={{ marginTop: '40px', padding: '16px', borderRadius: '12px',
        background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(71,85,105,0.15)' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', fontWeight: 700 }}>
          TOPIC GROUPS
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {GROUPS.filter(g => g !== 'All').map(g => (
            <button key={g} onClick={() => setGroup(g === group ? 'All' : g)} style={{
              padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: group === g ? 'rgba(99,102,241,0.2)' : 'rgba(71,85,105,0.1)',
              color: group === g ? '#818cf8' : '#64748b', fontSize: '12px' }}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
