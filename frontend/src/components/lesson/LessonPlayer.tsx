'use client';

import React, { useCallback } from 'react';
import { useLessonStore } from '@/store/lesson-store';
import { LessonHeader } from './LessonHeader';
import { ExerciseRenderer } from './exercises/ExerciseRenderer';
import { FeedbackBar } from './feedback/FeedbackBar';
import { LessonCompleteModal } from './modals/LessonCompleteModal';
import { OutOfHeartsModal } from './modals/OutOfHeartsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { exerciseEnterExit } from '@/lib/animations/variants';
import { lessonApi } from '@/lib/api/lesson/api';
import { playSound } from '@/lib/sounds/sound';

export const LessonPlayer: React.FC = () => {
  const {
    lesson,
    lessonId,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    applySubmitResult,
    submitAnswer,
    nextExercise,
    isFeedbackVisible,
    feedbackType,
    feedbackMessage,
    feedbackExplanation,
    hearts,
    correctCount,
    isCompleted,
    isOutOfHearts,
    resetLesson,
    earnedXP,
    newStreak,
  } = useLessonStore();

  // ── Derived values (safe when lesson is null — guarded in callbacks) ────────
  const currentExercise = lesson?.exercises[currentIndex] ?? null;

  const isAnswerSelected =
    selectedAnswer !== null &&
    selectedAnswer !== undefined &&
    selectedAnswer !== '' &&
    !(Array.isArray(selectedAnswer) && selectedAnswer.length === 0);

  const serialiseAnswer = useCallback((): any => {
    if (
      typeof selectedAnswer === 'object' &&
      selectedAnswer !== null &&
      !Array.isArray(selectedAnswer)
    ) {
      return selectedAnswer;
    }
    if (Array.isArray(selectedAnswer)) {
      return (selectedAnswer as string[]).join(' ');
    }
    return String(selectedAnswer ?? '');
  }, [selectedAnswer]);

  // ── Submit to backend, fall back to local evaluation on error ────────────
  // IMPORTANT: useCallback must always be called unconditionally (Rules of Hooks),
  // so this is placed before any early returns.
  const handleSubmit = useCallback(async () => {
    if (!currentExercise) return;

    const userAnswerStr = serialiseAnswer();

    try {
      const result = await lessonApi.submitExercise(currentExercise.id, userAnswerStr);

      try {
        if (result.is_correct) {
          playSound('correct');
        } else {
          playSound('incorrect');
        }
      } catch (audioErr) {
        console.warn('Audio playback error:', audioErr);
      }

      applySubmitResult({
        isCorrect: result.is_correct,
        feedbackMessage: result.feedback?.message || (result.is_correct ? 'Great job!' : 'Not quite.'),
        correctAnswer: result.correct_answer || '',
        heartsRemaining: result.hearts_remaining ?? 0,
        isOutOfHearts: result.is_out_of_hearts ?? false,
      });
    } catch (err) {
      console.error('Failed to submit answer to backend:', err);
      // Fallback: evaluate locally if backend is unreachable
      let isCorrect = false;
      let explanation = '';

      switch (currentExercise.type) {
        case 'multiple_choice':
          isCorrect = selectedAnswer === currentExercise.correctOptionId;
          explanation = currentExercise.options.find(o => o.id === currentExercise.correctOptionId)?.text || '';
          break;
        case 'word_bank': {
          const userSentence = (selectedAnswer as string[]).join(' ');
          const target = currentExercise.correctSentence.join(' ');
          isCorrect = userSentence === target;
          explanation = target;
          break;
        }
        case 'match_pairs':
          isCorrect = selectedAnswer === 'complete';
          explanation = 'All pairs matched!';
          break;
        case 'fill_blank':
          isCorrect = selectedAnswer === currentExercise.correctAnswer;
          explanation = currentExercise.correctAnswer;
          break;
        case 'type_answer': {
          const typed = (selectedAnswer as string).trim().toLowerCase();
          isCorrect = currentExercise.acceptableAnswers.some(a => a.toLowerCase() === typed);
          explanation = currentExercise.acceptableAnswers[0];
          break;
        }
      }
      submitAnswer(isCorrect, explanation);
    }
  }, [currentExercise, selectedAnswer, serialiseAnswer, applySubmitResult, submitAnswer]);

  // ── Early return AFTER all hooks ───────────────────────────────────────────
  if (!lesson || !currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <LessonHeader
        current={currentIndex + 1}
        total={lesson.exercises.length}
        hearts={hearts}
      />

      <main className="flex-1 overflow-y-auto flex flex-col justify-center px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            variants={exerciseEnterExit}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ExerciseRenderer
              exercise={currentExercise}
              selectedAnswer={selectedAnswer}
              onAnswerChange={setSelectedAnswer}
              disabled={isFeedbackVisible}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* CHECK button footer */}
      {!isFeedbackVisible && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t-2 border-gray-200 z-30">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              disabled={!isAnswerSelected}
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-base uppercase tracking-wider text-white shadow-md border-b-4 transition-all duration-150 ${
                isAnswerSelected
                  ? 'bg-[#58CC02] hover:bg-[#46A302] border-[#46A302] active:border-b-0 active:translate-y-[2px] cursor-pointer'
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed border-b-gray-300'
              }`}
            >
              Check
            </button>
          </div>
        </footer>
      )}

      {/* Feedback Bar */}
      <FeedbackBar
        type={feedbackType}
        explanation={feedbackExplanation || feedbackMessage}
        onContinue={nextExercise}
        heartsRemaining={feedbackType === 'incorrect' ? hearts : undefined}
      />

      {/* Lesson Complete Modal */}
      {isCompleted && (
        <LessonCompleteModal
          lessonId={lessonId}
          totalXP={earnedXP || lesson.totalXP}
          accuracy={(correctCount / lesson.exercises.length) * 100}
          correctCount={correctCount}
          totalExercises={lesson.exercises.length}
        />
      )}

      {/* Out of Hearts Modal */}
      {isOutOfHearts && (
        <OutOfHeartsModal onRetry={resetLesson} />
      )}
    </div>
  );
};
