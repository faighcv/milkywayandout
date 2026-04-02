import { lecture01 } from './lectures/lecture-01';
import { lecture02 } from './lectures/lecture-02';
import { lecture03 } from './lectures/lecture-03';
import { lecture04 } from './lectures/lecture-04';
import { lecture05 } from './lectures/lecture-05';
import { lecture06 } from './lectures/lecture-06';
import { lecture07 } from './lectures/lecture-07';
import { lecture08 } from './lectures/lecture-08';
import { lecture09 } from './lectures/lecture-09';
import { lecture10 } from './lectures/lecture-10';
import { lecture11 } from './lectures/lecture-11';
import { lecture12 } from './lectures/lecture-12';
import { lecture13 } from './lectures/lecture-13';
import { lecture14 } from './lectures/lecture-14';
import { lecture15 } from './lectures/lecture-15';
import { lecture16 } from './lectures/lecture-16';
import { lecture17 } from './lectures/lecture-17';
import { lecture18 } from './lectures/lecture-18';
import type { Lecture, LectureId } from '@/types';

export const ALL_LECTURES: Lecture[] = [
  lecture01, lecture02, lecture03, lecture04, lecture05, lecture06,
  lecture07, lecture08, lecture09, lecture10, lecture11, lecture12,
  lecture13, lecture14, lecture15, lecture16, lecture17, lecture18,
];

export const LECTURE_MAP = Object.fromEntries(
  ALL_LECTURES.map(l => [l.id, l])
) as Record<LectureId, Lecture>;

export { GLOSSARY } from './glossary';
