'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useLesson } from '@/hooks/use-lesson';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';

export default function LessonPage() {
  const params = useParams();
  const lessonId = (params?.id as string) || 'lesson-1';
  const { isLoading } = useLesson(lessonId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <LessonPlayer />;
}
