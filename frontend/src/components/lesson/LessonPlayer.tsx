'use client';

import React from 'react';
import { useLessonStore } from '@/store/lesson-store';
import { LessonHeader } from './LessonHeader';
import { ExerciseRenderer } from './exercises/ExerciseRenderer';
import { FeedbackBar } from './feedback/FeedbackBar';
import { LessonCompleteModal } from './modals/LessonCompleteModal';
import { OutOfHeartsModal } from './modals/OutOfHeartsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { exerciseEnterExit } from '@/lib/animations/variants';

export const LessonPlayer: React.FC = () => {
  const {
    lesson,
    currentIndex,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    nextExercise,
    isFeedbackVisible,
    feedbackType,
    feedbackExplanation,
    hearts,
    correctCount,
    isCompleted,
    isOutOfHearts,
    resetLesson,
  } = useLessonStore();

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIndex];
  const isAnswerSelected =
    selectedAnswer !== null &&
    selectedAnswer !== undefined &&
    selectedAnswer !== '' &&
    !(Array.isArray(selectedAnswer) && selectedAnswer.length === 0);

  const handleSubmit = () => {
    if (!currentExercise) return;

    let isCorrect = false;
    let explanation = '';

    switch (currentExercise.type) {
      case 'multiple_choice':
        isCorrect = selectedAnswer === currentExercise.correctOptionId;
        explanation = currentExercise.options.find(o => o.id === currentExercise.correctOptionId)?.text || '';
        break;

      case 'word_bank': {
        const userSentence = (selectedAnswer as string[]).join(' ');
        const targetSentence = currentExercise.correctSentence.join(' ');
        isCorrect = userSentence === targetSentence;
        explanation = targetSentence;
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
        isCorrect = currentExercise.acceptableAnswers.some(
          (ans) => ans.toLowerCase() === typed
        );
        explanation = currentExercise.acceptableAnswers[0];
        break;
      }
    }

    submitAnswer(isCorrect, explanation);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <LessonHeader
        current={currentIndex + 1}
        total={lesson.exercises.length}
        hearts={hearts}
      />

      <main className="flex-1 flex flex-col justify-center px-4 py-8 pb-32 max-w-4xl mx-auto w-full">
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

      {/* Check / Submit Action Footer */}
      {!isFeedbackVisible && (
        <footer className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t-2 border-gray-200 z-30">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              disabled={!isAnswerSelected}
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-extrabold text-base uppercase tracking-wider text-white shadow-md border-b-4 transition-all duration-150 ${
                isAnswerSelected
                  ? 'bg-[#58CC02] hover:bg-[#46A302] border-[#46A302] active:border-b-0 active:translate-y-[2px]'
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed border-b-gray-300'
              }`}
            >
              Check
            </button>
          </div>
        </footer>
      )}

      {/* Feedback Bar overlay */}
      <FeedbackBar
        type={feedbackType}
        explanation={feedbackExplanation}
        onContinue={nextExercise}
      />

      {/* End Modals */}
      {isCompleted && (
        <LessonCompleteModal
          totalXP={lesson.totalXP}
          accuracy={(correctCount / lesson.exercises.length) * 100}
        />
      )}

      {isOutOfHearts && (
        <OutOfHeartsModal onRetry={resetLesson} />
      )}
    </div>
  );
};
