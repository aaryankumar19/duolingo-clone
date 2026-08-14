'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';
import { BackendCourse } from '@/types/learning';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import {
  ES,
  FR,
  JP,
  DE,
  IN,
  KR,
  IT,
  CN,
  RU,
  US,
  BR,
} from 'country-flag-icons/react/3x2';

interface CatalogCourse {
  id: string;
  title: string;
  learners: string;
  flagType: string;
}

const COURSE_CATALOG: CatalogCourse[] = [
  { id: 'es', title: 'Spanish', learners: '42M learners', flagType: 'ES' },
  { id: 'fr', title: 'French', learners: '22.8M learners', flagType: 'FR' },
  { id: 'chess', title: 'Chess', learners: '5M learners', flagType: 'CHESS' },
  { id: 'jp', title: 'Japanese', learners: '18.2M learners', flagType: 'JP' },
  { id: 'de', title: 'German', learners: '15.9M learners', flagType: 'DE' },
  { id: 'math', title: 'Math', learners: '10M learners', flagType: 'MATH' },
  { id: 'hi', title: 'Hindi', learners: '13.9M learners', flagType: 'IN' },
  { id: 'kr', title: 'Korean', learners: '12.5M learners', flagType: 'KR' },
  { id: 'it', title: 'Italian', learners: '10.4M learners', flagType: 'IT' },
  { id: 'cn', title: 'Chinese (Simplified)', learners: '9.26M learners', flagType: 'CN' },
  { id: 'ru', title: 'Russian', learners: '7.82M learners', flagType: 'RU' },
  { id: 'en', title: 'English', learners: '29.6M learners', flagType: 'US' },
  { id: 'pt', title: 'Portuguese', learners: '14.1M learners', flagType: 'BR' },
];

function RenderCourseIcon({ flagType }: { flagType: string }) {
  if (flagType === 'ES') return <ES className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'FR') return <FR className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'JP') return <JP className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'DE') return <DE className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'IN') return <IN className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'KR') return <KR className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'IT') return <IT className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'CN') return <CN className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'RU') return <RU className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'US') return <US className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'BR') return <BR className="w-14 h-10 rounded-xl object-cover shadow-sm" />;
  if (flagType === 'CHESS') {
    return (
      <div className="w-14 h-10 rounded-xl bg-[#58cc02] flex items-center justify-center text-white text-xl font-black shadow-sm">
        ♟
      </div>
    );
  }
  if (flagType === 'MATH') {
    return (
      <div className="w-14 h-10 rounded-xl bg-[#1cb0f6] flex items-center justify-center text-white text-xs font-black shadow-sm">
        +=−
      </div>
    );
  }
  return <div className="w-14 h-10 rounded-xl bg-[#202f36]" />;
}

export default function CoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const { data: dbCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: learningApi.getCourses,
  });

  const activeDbCourse = dbCourses?.find((c) => c.is_active) || dbCourses?.[0];

  const selectMutation = useMutation({
    mutationFn: (courseId: string) => learningApi.selectCourse(courseId),
    onMutate: (courseId) => {
      setSelectingId(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['learningPath'] });
      router.push('/learn');
    },
    onError: () => {
      setSelectingId(null);
      router.push('/learn');
    },
  });

  const handleCourseClick = (item: CatalogCourse) => {
    const matchedDbCourse = dbCourses?.find(
      (c) =>
        (c.target_language && c.target_language.toLowerCase() === item.title.toLowerCase()) ||
        c.title.toLowerCase().includes(item.title.toLowerCase())
    );

    if (matchedDbCourse) {
      selectMutation.mutate(matchedDbCourse.id);
    } else if (activeDbCourse) {
      selectMutation.mutate(activeDbCourse.id);
    } else {
      router.push('/learn');
    }
  };

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col p-6 sm:p-10 font-sans select-none">
      {/* Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2b3840]">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Courses for English Speakers
          </h1>

          <div className="flex items-center gap-2 text-xs font-black text-[#52656d] uppercase tracking-wider cursor-pointer hover:text-white transition">
            <span>I SPEAK ENGLISH</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Grid of Languages matching Image 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {COURSE_CATALOG.map((item) => {
            const isActive =
              activeDbCourse &&
              ((activeDbCourse.target_language && activeDbCourse.target_language.toLowerCase() === item.title.toLowerCase()) ||
                activeDbCourse.title.toLowerCase().includes(item.title.toLowerCase()) ||
                (item.id === 'es' && activeDbCourse.title.toLowerCase().includes('spanish')));

            const isSelectingThis = selectingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleCourseClick(item)}
                className={`relative bg-[#18262d] border-2 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group shadow-md ${
                  isActive
                    ? 'border-[#58cc02] bg-[#202f36]'
                    : 'border-[#2b3840] hover:border-[#37464f] hover:bg-[#202f36]'
                }`}
              >
                {/* Active Checkmark Badge */}
                {isActive && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#58cc02] rounded-lg flex items-center justify-center text-white shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                {/* Flag / Icon */}
                <div className="mb-4 transform group-hover:scale-105 transition-transform">
                  <RenderCourseIcon flagType={item.flagType} />
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-white mb-1 leading-snug">
                  {item.title}
                </h3>

                {/* Learner Count */}
                <p className="text-xs font-bold text-[#778e9a]">
                  {isSelectingThis ? (
                    <span className="flex items-center gap-1 text-[#58cc02]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Selecting...
                    </span>
                  ) : (
                    item.learners
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Back Action */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/learn')}
            className="text-sm font-black text-[#778e9a] hover:text-white uppercase tracking-widest transition cursor-pointer"
          >
            ← Back to Learn
          </button>
        </div>
      </div>
    </div>
  );
}
