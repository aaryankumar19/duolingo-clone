'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Star, Lock, Crown, ChevronRight, Loader2,
  BookOpen, Zap, Gift, Heart, Check, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { useLearningPath } from '@/hooks/use-learning-path';
import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';
import { lessonApi } from '@/lib/api/lesson/api';
import { userApi } from '@/lib/api/user/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { BackendUnit, BackendSection } from '@/types/learning';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LESSON_CHARACTERS } from '@/lib/constants/characters';


// ─── Section colour palette ────────────────────────────────────────────────────
const SECTION_PALETTES = [
  { bg: '#58cc02', border: '#46a302' },
  { bg: '#ce82ff', border: '#9c44d0' },
  { bg: '#1cb0f6', border: '#1899d6' },
  { bg: '#ff9600', border: '#d97d00' },
  { bg: '#ff4b4b', border: '#d94141' },
];

// ─── Snake path: S-curve alternating zigzag (right arc → left arc → repeating)
// Each entry: x offset and which "side" the node is on
const SNAKE_PATH: { x: string; side: 'left' | 'center' | 'right' }[] = [
  { x: '0px',   side: 'center' },
  { x: '44px',  side: 'right'  },
  { x: '72px',  side: 'right'  },  // ← peak right — character shows on LEFT side
  { x: '44px',  side: 'right'  },
  { x: '0px',   side: 'center' },
  { x: '-44px', side: 'left'   },
  { x: '-72px', side: 'left'   },  // ← peak left — character shows on RIGHT side
  { x: '-44px', side: 'left'   },
];




// ─── Unit icon ────────────────────────────────────────────────────────────────
function UnitIcon({ unit }: { unit: BackendUnit }) {
  const isCompleted = unit.is_completed || (unit.total_lessons > 0 && unit.completed_lessons >= unit.total_lessons);
  if (isCompleted) return <Check className="w-8 h-8 text-white stroke-[3.5]" />;
  if (!unit.is_unlocked) return <Lock className="w-6 h-6 text-[#52656d]" />;
  return <Star className="w-7 h-7 fill-white text-white" />;
}

// ─── Single unit node ─────────────────────────────────────────────────────────
interface UnitNodeProps {
  unit: BackendUnit;
  palette: (typeof SECTION_PALETTES)[0];
  offsetX: string;
  snakeSide: 'left' | 'center' | 'right';
  isActive: boolean;
  onToggle: () => void;
  onStartLesson: (unitId: string) => void;
  isStarting: boolean;
  userHearts: number;
  /** Character image shown beside the node — only on 'peak' nodes */
  character?: { src: string; name: string } | null;
}

function UnitNode({
  unit, palette, offsetX, snakeSide, isActive, onToggle, onStartLesson, isStarting, userHearts, character,
}: UnitNodeProps) {
  const isLocked = !unit.is_unlocked;
  const isCompletedUnit =
    unit.is_completed || (unit.total_lessons > 0 && unit.completed_lessons >= unit.total_lessons);
  const currentLessonNum = Math.min(unit.completed_lessons + 1, unit.total_lessons);
  const pct =
    unit.total_lessons > 0
      ? Math.round((Math.min(unit.completed_lessons, unit.total_lessons) / unit.total_lessons) * 100)
      : 0;
  const isFirst = unit.completed_lessons === 0 && unit.is_unlocked;

  // Character appears on the opposite side of the node's lean
  const charSide = snakeSide === 'left' ? 'right' : snakeSide === 'right' ? 'left' : null;

  return (
    <div
      className={`relative flex flex-col items-center ${isActive ? 'z-[60]' : 'z-10'}`}
      style={{ transform: `translateX(${offsetX})` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* START badge */}
      {isFirst && !isActive && (
        <div className="relative mb-3 flex flex-col items-center">
          <div
            className="text-xs font-black px-4 py-1.5 rounded-2xl uppercase tracking-widest shadow-lg border-2"
            style={{ background: '#202f36', borderColor: '#2b3840', color: palette.bg }}
          >
            START
          </div>
          <div
            className="w-3 h-3 rotate-45 -mt-1.5 border-r-2 border-b-2"
            style={{ background: '#202f36', borderColor: '#2b3840' }}
          />
        </div>
      )}

      {/* Crown level pips */}
      {unit.crown_level > 0 && (
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: Math.min(unit.crown_level, 5) }).map((_, i) => (
            <Crown key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      )}

      {/* Node circle */}
      <div
        className={`rounded-full border-4 flex items-center justify-center p-1 ${isLocked
            ? 'border-[#2b3840] bg-[#202f36]/40 w-[80px] h-[80px]'
            : isCompletedUnit
              ? 'border-[#58cc02]/30 w-[92px] h-[92px]'
              : 'w-[92px] h-[92px]'
          }`}
        style={!isLocked && !isCompletedUnit ? { borderColor: `${palette.bg}50` } : {}}
      >
        <button
          onClick={onToggle}
          className={`rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-75 cursor-pointer relative overflow-hidden select-none ${isLocked
              ? 'w-16 h-16 bg-[#202f36] hover:bg-[#283b44] border-b-[6px] border-[#2b3840] active:translate-y-[3px] active:border-b-[2px]'
              : isCompletedUnit
                ? 'w-20 h-20 bg-[#58cc02] hover:bg-[#61d803] border-b-[8px] border-[#46a302] active:translate-y-[6px] active:border-b-[2px] active:shadow-inner'
                : 'w-20 h-20 border-b-[8px] active:translate-y-[6px] active:border-b-[2px]'
            }`}
          style={!isLocked && !isCompletedUnit ? { background: palette.bg, borderColor: palette.border } : {}}
        >
          {/* Top-left diagonal glossy 3D shine overlay for completed buttons */}
          {isCompletedUnit && (
            <div className="absolute -top-3 -left-3 w-14 h-14 bg-white/25 rounded-full blur-[1px] pointer-events-none" />
          )}

          <UnitIcon unit={unit} />
        </button>
      </div>


      {/* Progress bar */}
      {!isLocked && pct > 0 && pct < 100 && (
        <div className="mt-2 w-16 h-1.5 bg-[#2b3840] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: palette.bg }}
          />
        </div>
      )}

      {/* Popover */}
      {isActive && (
        <div
          className="absolute top-36 z-[100] w-72 sm:w-80 rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={
            isLocked
              ? { background: '#202f36', border: '2px solid #2b3840' }
              : { background: palette.bg, borderBottom: `6px solid ${palette.border}` }
          }
        >
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
            style={
              isLocked
                ? { background: '#202f36', borderTop: '2px solid #2b3840', borderLeft: '2px solid #2b3840' }
                : { background: palette.bg }
            }
          />

          <h3 className={`text-lg sm:text-xl font-extrabold leading-tight mb-1 text-left ${isLocked ? 'text-[#778e9a]' : 'text-white'}`}>
            {unit.title}
          </h3>
          <p className={`text-xs sm:text-sm font-bold mb-4 text-left ${isLocked ? 'text-[#52656d]' : 'text-white/90'}`}>
            {isLocked
              ? 'Complete lessons above to unlock!'
              : userHearts <= 0
                ? 'Out of hearts! Refill with gems to play.'
                : isCompletedUnit
                  ? 'Unit completed! Practice to review.'
                  : `Lesson ${currentLessonNum} of ${unit.total_lessons}`}
          </p>

          {isLocked ? (
            <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
              LOCKED
            </div>
          ) : userHearts <= 0 ? (
            <button
              onClick={() => onStartLesson(unit.id)}
              className="w-full py-3.5 bg-white hover:bg-gray-50 border-b-4 border-[#e5e5e5] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md active:translate-y-[2px] active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer select-none text-[#ff4b4b]"
            >
              <Heart className="w-4 h-4 fill-[#ff4b4b] text-[#ff4b4b]" />
              <span>REFILL HEARTS TO PLAY</span>
            </button>
          ) : (
            <button
              onClick={() => onStartLesson(unit.id)}
              disabled={isStarting}
              className="w-full py-3.5 bg-white hover:bg-gray-50 border-b-4 border-[#e5e5e5] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-md active:translate-y-[2px] active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-60"
              style={{ color: palette.bg }}
            >
              {isStarting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {isCompletedUnit
                      ? 'PRACTICE'
                      : unit.completed_lessons === 0
                        ? 'START'
                        : 'CONTINUE'} +10 XP
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Daily XP widget ──────────────────────────────────────────────────────────
function DailyXPWidget() {
  const { data } = useQuery({
    queryKey: ['dailyActivity'],
    queryFn: learningApi.getDailyActivity,
    staleTime: 1000 * 5,
  });

  const raw = data as any;
  const xp = raw?.xp_today ?? raw?.xp_gained ?? 0;
  const goal = raw?.daily_goal ?? raw?.xp_goal ?? 10;
  const pct = Math.min((xp / goal) * 100, 100);

  return (
    <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white">Daily Quest</h3>
        <Zap className="w-4 h-4 text-[#ffc800] fill-[#ffc800]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <Zap className="w-5 h-5 fill-white text-white" />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-xs font-extrabold text-white">Earn {goal} XP</span>
          <div className="w-full h-3 bg-[#131f24] rounded-full overflow-hidden relative border border-[#2b3840]">
            <div
              className="h-full bg-[#ffc800] transition-all duration-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
              {xp} / {goal}
            </span>
          </div>
        </div>
        {pct >= 100 && <Gift className="w-6 h-6 text-[#ff9600] shrink-0 animate-bounce" />}
      </div>
    </div>
  );
}

// ─── Sticky Section Banner ─────────────────────────────────────────────────────
interface StickyBannerProps {
  sectionIdx: number;
  unitIdx: number;      // unit index WITHIN the section
  globalUnitNum: number; // absolute unit number across all sections
  sectionTitle: string;
  palette: (typeof SECTION_PALETTES)[0];
  prevPalette: (typeof SECTION_PALETTES)[0] | null;
  isTransitioning: boolean;
}

function StickyBanner({
  sectionIdx, unitIdx, globalUnitNum, sectionTitle, palette, prevPalette, isTransitioning,
}: StickyBannerProps) {
  const router = useRouter();

  return (
    <div
      className="sticky z-40 w-full rounded-3xl shadow-xl mb-8 overflow-hidden"
      style={{ top: '16px' }}
    >
      {/* Transition layer: slide previous colour out */}
      {isTransitioning && prevPalette && (
        <div
          className="absolute inset-0 rounded-3xl animate-out slide-out-to-top duration-300"
          style={{ background: prevPalette.bg, borderBottom: `6px solid ${prevPalette.border}` }}
        />
      )}

      <div
        className="relative w-full text-white p-5 rounded-3xl flex items-center justify-between border-b-[6px] transition-colors duration-500"
        style={{ background: palette.bg, borderColor: palette.border }}
      >
        {/* Left: back to /sections link + section / unit label + title */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => router.push('/sections')}
            className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black tracking-widest uppercase text-white/90 hover:text-white transition cursor-pointer group text-left w-fit py-1 px-2.5 -ml-2.5 rounded-xl hover:bg-white/15 active:scale-95"
            title="Go to sections overview"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-1 transition-transform shrink-0" />
            <span>SECTION {sectionIdx + 1}, UNIT {globalUnitNum}</span>
          </button>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-wide leading-tight">
            {sectionTitle}
          </h1>
        </div>

        {/* Right: Guidebook button */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shrink-0 active:scale-95">
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Guidebook</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Learn Page ──────────────────────────────────────────────────────────
export default function LearnPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [startingUnitId, setStartingUnitId] = useState<string | null>(null);

  // Track active section and unit state from scroll
  const [activeBanner, setActiveBanner] = useState<{
    sectionIdx: number;
    unitIdx: number;
    globalUnitNum: number;
    unitTitle: string;
    paletteIdx: number;
  }>({
    sectionIdx: 0,
    unitIdx: 0,
    globalUnitNum: 1,
    unitTitle: '',
    paletteIdx: 0,
  });

  const [prevPaletteIdx, setPrevPaletteIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: pathData, isLoading, error } = useLearningPath();

  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillError, setRefillError] = useState<string | null>(null);

  const handleRefillHearts = async () => {
    setIsRefilling(true);
    setRefillError(null);
    try {
      await userApi.refillHearts();
      setIsHeartModalOpen(false);
    } catch (err: any) {
      setRefillError(err?.message || 'Failed to refill hearts.');
    } finally {
      setIsRefilling(false);
    }
  };

  const handleStartLesson = async (unitId: string) => {
    // If user has 0 hearts, block and prompt to refill
    if ((user?.hearts ?? 5) <= 0) {
      setIsHeartModalOpen(true);
      return;
    }

    setStartingUnitId(unitId);
    try {
      const lesson = await lessonApi.getNextLesson(unitId);
      router.push(`/lesson/${lesson.id}?skillId=${unitId}`);
    } catch (err: any) {
      console.error('Failed to fetch lesson:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('out of hearts') || msg.toLowerCase().includes('hearts')) {
        setIsHeartModalOpen(true);
      }
    } finally {
      setStartingUnitId(null);
    }
  };

  // Map of refs per UNIT (not per section) to accurately update unit data on scroll
  const unitRefs = useRef<{ [unitId: string]: HTMLDivElement | null }>({});

  // ── IntersectionObserver: track UNIT sentinels ───────────────────────────
  // Keeps section fixed while user scrolls through units, updating unit title & unit number.
  useEffect(() => {
    if (!pathData) return;

    const observers: IntersectionObserver[] = [];
    let cumulativeUnitCount = 0;

    pathData.sections.forEach((section, sIdx) => {
      section.units.forEach((unit, uIdx) => {
        cumulativeUnitCount += 1;
        const currentGlobalNum = cumulativeUnitCount;
        const el = unitRefs.current[unit.id];
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveBanner((prev) => {
                const targetPaletteIdx = sIdx % SECTION_PALETTES.length;
                if (prev.paletteIdx !== targetPaletteIdx) {
                  setPrevPaletteIdx(prev.paletteIdx);
                  setIsTransitioning(true);
                  setTimeout(() => setIsTransitioning(false), 400);
                }
                return {
                  sectionIdx: sIdx,
                  unitIdx: uIdx,
                  globalUnitNum: currentGlobalNum,
                  unitTitle: unit.title,
                  paletteIdx: targetPaletteIdx,
                };
              });
            }
          },
          {
            rootMargin: '-20px 0px -55% 0px',
            threshold: 0,
          }
        );

        observer.observe(el);
        observers.push(observer);
      });
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathData]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#778e9a] font-bold text-sm">Loading your path...</p>
        </div>
      </div>
    );
  }

  // ── Error / no course ──────────────────────────────────────────────────────
  if (error || !pathData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-24 h-24">
          <Image src="/duo/duo_sad.svg" alt="No course" width={96} height={96} loading="eager" className="w-full h-full object-contain" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-white mb-2">No active course</h2>
          <p className="text-[#778e9a] text-sm font-bold mb-6">
            Pick a language to start learning!
          </p>
          <Button variant="primary" onClick={() => router.push('/courses')}>
            CHOOSE A LANGUAGE
          </Button>
        </div>
      </div>
    );
  }

  const { sections } = pathData;
  const currentPalette = SECTION_PALETTES[activeBanner.paletteIdx % SECTION_PALETTES.length];
  const prevPalette = prevPaletteIdx !== null ? SECTION_PALETTES[prevPaletteIdx % SECTION_PALETTES.length] : null;
  const displayTitle = activeBanner.unitTitle || sections[0]?.units[0]?.title || sections[0]?.title || '';

  return (
    <div
      onClick={() => setActiveNodeId(null)}
      className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-10 lg:gap-12 py-2 px-2 sm:px-4 text-white font-sans selection:bg-[#58cc02] relative"
    >
      {/* ── LEFT: Skill Path ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center w-full max-w-[592px] mx-auto">
        {/* Mobile top stats header */}
        <div className="lg:hidden w-full flex justify-end mb-4">
          <AppHeader />
        </div>

        {/* ── STICKY BANNER — single banner, tracks scroll ───────────────── */}
        <StickyBanner
          sectionIdx={activeBanner.sectionIdx}
          unitIdx={activeBanner.unitIdx}
          globalUnitNum={activeBanner.globalUnitNum}
          sectionTitle={displayTitle}
          palette={currentPalette}
          prevPalette={prevPalette}
          isTransitioning={isTransitioning}
        />

        {/* ── Section + unit nodes ───────────────────────────────────────── */}
        {sections.map((section, sIdx) => {
          const palette = SECTION_PALETTES[sIdx % SECTION_PALETTES.length];

          return (
            <div key={section.id || sIdx} className="w-full">
              {/* Unit nodes — alternating zigzag snake, mirrored per section */}
              <div className="w-full flex flex-col items-center relative space-y-10 my-4 mb-14">
                {section.units.map((unit, uIdx) => {
                  const nodeId = unit.id;
                  // Offset the path by 4 for odd sections so they mirror even sections
                  const pathOffset = sIdx % 2 === 0 ? 0 : 4;
                  const snap = SNAKE_PATH[(uIdx + pathOffset) % SNAKE_PATH.length];
                  // Show a character beside every 3rd node (at index 2, 5, 8, ...)
                  const showChar = uIdx % 4 === 2;
                  const charIdx = (sIdx * 7 + uIdx * 3) % LESSON_CHARACTERS.length;
                  const character = showChar ? LESSON_CHARACTERS[charIdx] : null;

                  return (
                    <div
                      key={unit.id}
                      ref={(el) => { unitRefs.current[unit.id] = el; }}
                      className="flex justify-center w-full relative"
                    >
                      {/* Character mascot — rendered as sibling to avoid clipping */}
                      {character && snap.side !== 'center' && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none z-10 ${
                            snap.side === 'right'
                              ? 'left-[calc(50%-210px)]'  // left side when node leans right
                              : 'right-[calc(50%-210px)]' // right side when node leans left
                          }`}
                        >
                          <img
                            src={character.src}
                            alt={character.name}
                            width={112}
                            height={112}
                            className="w-28 h-28 object-contain drop-shadow-xl"
                          />
                        </div>
                      )}
                      <UnitNode
                        unit={unit}
                        palette={palette}
                        offsetX={snap.x}
                        snakeSide={snap.side}
                        isActive={activeNodeId === nodeId}
                        onToggle={() => setActiveNodeId((p) => (p === nodeId ? null : nodeId))}
                        onStartLesson={handleStartLesson}
                        isStarting={startingUnitId === unit.id}
                        userHearts={user?.hearts ?? 5}
                        character={null}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Section divider between sections */}
              {sIdx < sections.length - 1 && (
                <div className="w-full flex items-center gap-4 my-8 max-w-md mx-auto">
                  <div className="flex-1 border-t-2 border-[#2b3840]" />
                  <span className="text-xs font-extrabold text-[#52656d] uppercase tracking-widest text-center px-2">
                    SECTION {sIdx + 2}: {sections[sIdx + 1]?.title}
                  </span>
                  <div className="flex-1 border-t-2 border-[#2b3840]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── RIGHT SIDEBAR: Widgets ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-[310px] shrink-0">
        {/* Top User Stats Bar */}
        <AppHeader />

        {/* Super Duolingo */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 max-w-[200px]">
              <span className="text-xs font-black uppercase text-[#a855f7] tracking-widest">SUPER</span>
              <h3 className="text-base font-extrabold text-white">Try Super for free</h3>
              <p className="text-xs font-bold text-[#777777] leading-relaxed">
                No ads, personalized practice, and unlimited Legendary!
              </p>
            </div>
            <div className="w-20 h-20 relative shrink-0">
              <Image src="/duo/ad9ec13f2b161e008ab1.svg" alt="Super Duo" width={80} height={80} className="w-full h-full object-contain" />
            </div>
          </div>
          <Button variant="secondary" fullWidth className="bg-[#5865f2] hover:bg-[#4752c4] shadow-[0_4px_0_0_#3b429f]">
            TRY 1 WEEK FREE
          </Button>
        </div>

        {/* Unlock Leaderboards Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-white">Unlock Leaderboards!</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#131f24] border border-[#2b3840] rounded-2xl flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#52656d]" />
            </div>
            <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quest */}
        <DailyXPWidget />

        {/* Ad-blocker widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4 items-center text-center">
          <div className="w-20 h-20 relative">
            <Image src="/duo/266788168c5f135b35e3.svg" alt="Ad blocker Duo" width={80} height={80} className="w-full h-full object-contain" />
          </div>
          <h3 className="text-base font-extrabold text-white">Using an ad blocker?</h3>
          <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
            Support education with Super Duolingo and we&apos;ll remove ads for you
          </p>
          <button className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#131f24] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer">
            TRY SUPER FOR FREE
          </button>
        </div>
      </div>

      {/* Refill Hearts Modal */}
      <Modal
        isOpen={isHeartModalOpen}
        onClose={() => {
          setIsHeartModalOpen(false);
          setRefillError(null);
        }}
        title="Need More Hearts?"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-[#ff4b4b] shadow-inner">
            <Heart className="w-10 h-10 fill-[#ff4b4b] text-[#ff4b4b]" />
          </div>

          <p className="text-sm font-bold text-[#777777] leading-relaxed">
            You currently have <span className="text-[#ff4b4b] font-extrabold">{user?.hearts ?? 0} hearts</span>. Refill to full hearts for <span className="text-[#1cb0f6] font-extrabold">100 gems</span> to start learning!
          </p>

          {refillError && (
            <div className="w-full p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-200">
              {refillError}
            </div>
          )}

          <div className="flex flex-col gap-2.5 w-full pt-2">
            <Button
              variant="primary"
              fullWidth
              disabled={isRefilling || (user?.hearts ?? 0) >= 5}
              onClick={handleRefillHearts}
            >
              {isRefilling ? 'REFILLING...' : 'REFILL HEARTS (100 GEMS)'}
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setIsHeartModalOpen(false);
                setRefillError(null);
              }}
            >
              NO THANKS
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
