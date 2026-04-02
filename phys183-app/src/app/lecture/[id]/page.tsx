'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import LectureShell from '@/components/lecture/LectureShell';
import { LECTURE_MAP } from '@/data';

export default function LecturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lectureId = Number(id);
  const lecture = LECTURE_MAP[lectureId as keyof typeof LECTURE_MAP];
  if (!lecture) notFound();
  return <LectureShell lecture={lecture} />;
}
