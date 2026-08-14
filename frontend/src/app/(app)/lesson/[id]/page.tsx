'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLesson } from '@/hooks/use-lesson';
import { LessonPlayer } from '@/components/lesson/LessonPlayer';
import { OutOfHeartsModal } from '@/components/lesson/modals/OutOfHeartsModal';

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // The URL is /lesson/[lessonId]?skillId=[unitId]
  // We use skillId to fetch the next lesson; lessonId is used for complete/submit
  const skillId = searchParams?.get('skillId') || (params?.id as string) || '';

  const { isLoading, error } = useLesson(skillId);

  if (isLoading) {
    return (
      // fixed inset-0 so it covers the sidebar+header from the parent layout
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isOutOfHearts =
      errorMsg.toLowerCase().includes('out of hearts') ||
      errorMsg.toLowerCase().includes('hearts');

    if (isOutOfHearts) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <OutOfHeartsModal onRetry={() => window.location.reload()} />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center p-6 max-w-sm">
          <p className="text-gray-700 font-extrabold text-lg mb-4">
            {errorMsg || 'Failed to load lesson.'}
          </p>
          <a
            href="/learn"
            className="inline-block px-6 py-3 rounded-2xl bg-[#58CC02] text-white font-extrabold shadow-md hover:bg-[#46A302] transition"
          >
            ← Back to Learning Path
          </a>
        </div>
      </div>
    );
  }

  return <LessonPlayer />;
}
