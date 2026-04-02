'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LectureId, LectureProgress, TabKey, WeakTopic, TestSession, QuizQuestion } from '@/types';

interface ProgressStore {
  lectures: Partial<Record<LectureId, LectureProgress>>;
  weakTopics: WeakTopic[];
  testHistory: TestSession[];
  markTabComplete: (lectureId: LectureId, tab: TabKey) => void;
  markCardMastered: (lectureId: LectureId, cardId: string) => void;
  recordQuizScore: (lectureId: LectureId, score: number) => void;
  recordTestSession: (session: TestSession) => void;
  updateWeakTopics: (wrongQuestions: QuizQuestion[]) => void;
  getLectureCompletion: (lectureId: LectureId) => number;
  getOverallCompletion: () => number;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      lectures: {},
      weakTopics: [],
      testHistory: [],
      markTabComplete: (lectureId, tab) =>
        set(state => {
          const existing = state.lectures[lectureId] ?? {
            lectureId, visited: true, tabsCompleted: [],
            flashCardsMastered: [], quizBestScore: 0, lastVisited: Date.now()
          };
          return {
            lectures: {
              ...state.lectures,
              [lectureId]: {
                ...existing,
                visited: true,
                lastVisited: Date.now(),
                tabsCompleted: existing.tabsCompleted.includes(tab)
                  ? existing.tabsCompleted
                  : [...existing.tabsCompleted, tab]
              }
            }
          };
        }),
      markCardMastered: (lectureId, cardId) =>
        set(state => {
          const existing = state.lectures[lectureId] ?? {
            lectureId, visited: true, tabsCompleted: [],
            flashCardsMastered: [], quizBestScore: 0, lastVisited: Date.now()
          };
          return {
            lectures: {
              ...state.lectures,
              [lectureId]: {
                ...existing,
                flashCardsMastered: existing.flashCardsMastered.includes(cardId)
                  ? existing.flashCardsMastered
                  : [...existing.flashCardsMastered, cardId]
              }
            }
          };
        }),
      recordQuizScore: (lectureId, score) =>
        set(state => {
          const existing = state.lectures[lectureId] ?? {
            lectureId, visited: true, tabsCompleted: [],
            flashCardsMastered: [], quizBestScore: 0, lastVisited: Date.now()
          };
          return {
            lectures: {
              ...state.lectures,
              [lectureId]: {
                ...existing,
                quizBestScore: Math.max(existing.quizBestScore, score)
              }
            }
          };
        }),
      recordTestSession: (session) =>
        set(state => ({ testHistory: [session, ...state.testHistory].slice(0, 20) })),
      updateWeakTopics: (wrongQuestions) =>
        set(state => {
          const updated = [...state.weakTopics];
          wrongQuestions.forEach(q => {
            q.tags.forEach(tag => {
              const idx = updated.findIndex(w => w.tag === tag);
              if (idx >= 0) {
                updated[idx] = {
                  ...updated[idx],
                  incorrectCount: updated[idx].incorrectCount + 1,
                  totalAttempts: updated[idx].totalAttempts + 1
                };
              } else {
                updated.push({ tag, lectureIds: [q.lectureId], incorrectCount: 1, totalAttempts: 1 });
              }
            });
          });
          return { weakTopics: updated };
        }),
      getLectureCompletion: (lectureId) => {
        const lp = get().lectures[lectureId];
        if (!lp) return 0;
        const tabs: TabKey[] = ['bigPicture','content','flashCards','quiz','summary','connections'];
        return lp.tabsCompleted.filter(t => tabs.includes(t)).length / tabs.length;
      },
      getOverallCompletion: () => {
        const total = 18;
        let sum = 0;
        for (let i = 1; i <= 18; i++) sum += get().getLectureCompletion(i as LectureId);
        return sum / total;
      },
    }),
    { name: 'phys183-progress', version: 1 }
  )
);
