'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ES, US, FR, JP, DE, IN, KR, IT, CN, RU } from 'country-flag-icons/react/3x2';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';

import { learningApi } from '@/lib/api/learning/api';
import { lessonApi } from '@/lib/api/lesson/api';

const COURSES = [
  { id: 'spanish', name: 'Spanish', count: '42M learners', Flag: ES, available: true },
  { id: 'english', name: 'English', count: '30M learners', Flag: US, available: false },
  { id: 'french', name: 'French', count: '23M learners', Flag: FR, available: false },
  { id: 'chess', name: 'Chess', count: '21M learners', icon: '♟️', available: false },
  { id: 'japanese', name: 'Japanese', count: '18M learners', Flag: JP, available: false },
  { id: 'german', name: 'German', count: '16M learners', Flag: DE, available: false },
  { id: 'math', name: 'Math', count: '14M learners', icon: '➕➖', available: false },
  { id: 'hindi', name: 'Hindi', count: '14M learners', Flag: IN, available: false },
  { id: 'korean', name: 'Korean', count: '12M learners', Flag: KR, available: false },
  { id: 'italian', name: 'Italian', count: '10M learners', Flag: IT, available: false },
  { id: 'chinese', name: 'Chinese (Simplified)', count: '9.3M learners', Flag: CN, available: false },
  { id: 'russian', name: 'Russian', count: '7.8M learners', Flag: RU, available: false },
];

const KNOWLEDGE_LEVELS = [
  { id: 'new', label: "I'm new to Spanish", level: 1 },
  { id: 'words', label: "I know some common words", level: 2 },
  { id: 'conversations', label: "I can have basic conversations", level: 3 },
  { id: 'topics', label: "I can talk about various topics", level: 4 },
  { id: 'detail', label: "I can discuss most topics in detail", level: 5 },
];

// Mapping each step to an authentic Duo SVG pose provided by user
const DUO_STEP_IMAGES = {
  1: '/duo/3aeb9f981f17977278cf.svg', // Waving Duo
  2: '/duo/ad9ec13f2b161e008ab1.svg', // Sparkle/Happy Duo
  3: '/duo/885521149d32d1cf32c3.svg', // Thinking Duo with book
  4: '/duo/6289e2c94af3a5dbdcec.svg', // Surprised/Listening Duo
  5: '/duo/266788168c5f135b35e3.svg', // Determined/Flying Duo
};

export default function WelcomePage() {
  const router = useRouter();

  // Onboarding steps: 1..5
  const [step, setStep] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<string>('spanish');
  const [selectedLevel, setSelectedLevel] = useState<string>('new');
  const [startPlacement, setStartPlacement] = useState<'scratch' | 'placement'>('scratch');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleNext = async () => {
    if (step === 3 && selectedCourse !== 'spanish') {
      showToast('Only Spanish course is available right now!');
      return;
    }

    if (step === 4) {
      localStorage.setItem('spanish_level', selectedLevel);
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      if (isNavigating) return;
      setIsNavigating(true);
      try {
        const pathData = await learningApi.getLearningPath();
        const firstUnit = pathData?.sections?.[0]?.units?.[0];
        if (firstUnit) {
          const nextLesson = await lessonApi.getNextLesson(firstUnit.id);
          if (nextLesson?.id) {
            router.push(`/lesson/${nextLesson.id}?skillId=${firstUnit.id}`);
            return;
          }
        }
        router.push('/learn');
      } catch {
        router.push('/learn');
      }
    }
  };

  const progressPercentage = (step / 5) * 100;
  const currentDuoImage = DUO_STEP_IMAGES[step as keyof typeof DUO_STEP_IMAGES] || '/duo/3aeb9f981f17977278cf.svg';

  return (
    <AuthGuard>
      <div className="w-full min-h-screen bg-[#131f24] text-white flex flex-col justify-between select-none relative font-sans">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#202f36] border-2 border-[#1cb0f6] text-[#1cb0f6] px-6 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase shadow-2xl animate-bounce">
            ✨ {toastMsg}
          </div>
        )}

        {/* Top Header / Progress Bar */}
        <header className="w-full max-w-4xl mx-auto pt-6 px-6">
          <div className="w-full h-3 bg-[#202f36] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-[#58cc02] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto px-4 py-8">
          {/* STEP 1: Hi there! I'm Duo! */}
          {step === 1 && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative bg-[#202f36] border-2 border-[#2b3840] text-white font-extrabold text-lg px-6 py-3 rounded-2xl shadow-lg">
                Hi there! I'm Duo!
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-r-2 border-b-2 border-[#2b3840] rotate-45" />
              </div>
              <div className="w-44 h-44 relative mt-2">
                <Image
                  src={currentDuoImage}
                  alt="Duo"
                  width={176}
                  height={176}
                  priority
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Let's get this party started! */}
          {step === 2 && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="relative bg-[#202f36] border-2 border-[#2b3840] text-white font-extrabold text-lg px-6 py-3 rounded-2xl shadow-lg">
                Let's get this party started!
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-r-2 border-b-2 border-[#2b3840] rotate-45" />
              </div>
              <div className="w-44 h-44 relative mt-2">
                <Image
                  src={currentDuoImage}
                  alt="Duo"
                  width={176}
                  height={176}
                  priority
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          )}

          {/* STEP 3: What would you like to learn? */}
          {step === 3 && (
            <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 relative shrink-0">
                  <Image
                    src={currentDuoImage}
                    alt="Duo"
                    width={64}
                    height={64}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative bg-[#202f36] border-2 border-[#2b3840] text-white font-extrabold text-base px-5 py-3 rounded-2xl">
                  What would you like to learn?
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-[#202f36] border-l-2 border-b-2 border-[#2b3840] rotate-45" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
                {COURSES.map((course) => {
                  const isSelected = selectedCourse === course.id;
                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        if (!course.available) {
                          showToast('Only Spanish is available right now!');
                        } else {
                          setSelectedCourse(course.id);
                        }
                      }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none text-left ${
                        isSelected
                          ? 'bg-[#202f36] border-[#1cb0f6] shadow-[0_0_0_2px_#1cb0f6]'
                          : 'bg-[#131f24] hover:bg-[#202f36] border-[#2b3840]'
                      } ${!course.available ? 'opacity-70' : ''}`}
                    >
                      {course.Flag ? (
                        <course.Flag className="w-9 h-6 rounded-md shadow-xs object-cover shrink-0" />
                      ) : (
                        <span className="text-2xl shrink-0">{course.icon}</span>
                      )}
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm text-white">
                          {course.name}
                        </span>
                        <span className="text-xs font-bold text-[#778e9a]">
                          {course.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: How much Spanish do you know? */}
          {step === 4 && (
            <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 relative shrink-0">
                  <Image
                    src={currentDuoImage}
                    alt="Duo"
                    width={64}
                    height={64}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative bg-[#202f36] border-2 border-[#2b3840] text-white font-extrabold text-base px-5 py-3 rounded-2xl">
                  How much Spanish do you know?
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-[#202f36] border-l-2 border-b-2 border-[#2b3840] rotate-45" />
                </div>
              </div>

              <div className="flex flex-col gap-3.5 w-full max-w-md">
                {KNOWLEDGE_LEVELS.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none text-left ${
                        isSelected
                          ? 'bg-[#202f36] border-[#1cb0f6] shadow-[0_0_0_2px_#1cb0f6]'
                          : 'bg-[#131f24] hover:bg-[#202f36] border-[#2b3840]'
                      }`}
                    >
                      <div className="flex items-end gap-1 h-5 shrink-0 px-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 rounded-xs transition-colors ${
                              bar <= lvl.level ? 'bg-[#1cb0f6]' : 'bg-[#37464f]'
                            }`}
                            style={{ height: `${bar * 4 + 4}px` }}
                          />
                        ))}
                      </div>

                      <span className="font-extrabold text-sm text-white">
                        {lvl.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Now let's find the best place to start! */}
          {step === 5 && (
            <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 relative shrink-0">
                  <Image
                    src={currentDuoImage}
                    alt="Duo"
                    width={64}
                    height={64}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative bg-[#202f36] border-2 border-[#2b3840] text-white font-extrabold text-base px-5 py-3 rounded-2xl">
                  Now let's find the best place to start!
                  <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-4 h-4 bg-[#202f36] border-l-2 border-b-2 border-[#2b3840] rotate-45" />
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-md">
                <button
                  onClick={() => setStartPlacement('scratch')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer select-none text-left ${
                    startPlacement === 'scratch'
                      ? 'bg-[#202f36] border-[#1cb0f6] shadow-[0_0_0_2px_#1cb0f6]'
                      : 'bg-[#131f24] hover:bg-[#202f36] border-[#2b3840]'
                  }`}
                >
                  <div className="w-12 h-14 bg-[#ffc800] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                    1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base text-[#1cb0f6]">
                      Start from scratch
                    </span>
                    <span className="text-xs font-bold text-[#778e9a] mt-0.5">
                      Take the easiest lesson of the Spanish course
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setStartPlacement('placement')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer select-none text-left ${
                    startPlacement === 'placement'
                      ? 'bg-[#202f36] border-[#1cb0f6] shadow-[0_0_0_2px_#1cb0f6]'
                      : 'bg-[#131f24] hover:bg-[#202f36] border-[#2b3840]'
                  }`}
                >
                  <div className="w-12 h-12 bg-[#1cb0f6] rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base text-white">
                      Find my level
                    </span>
                    <span className="text-xs font-bold text-[#778e9a] mt-0.5">
                      Let Duo recommend where you should start learning
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Fixed Footer Bar */}
        <footer className="w-full bg-[#131f24] border-t-2 border-[#2b3840] py-4 px-6 sm:px-10">
          <div className="max-w-4xl mx-auto flex items-center justify-end">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-48"
              onClick={handleNext}
            >
              CONTINUE
            </Button>
          </div>
        </footer>
      </div>
    </AuthGuard>
  );
}
