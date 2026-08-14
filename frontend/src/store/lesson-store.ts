import { create } from 'zustand';
import { Lesson, Exercise } from '@/types/lesson';

interface LessonStoreState {
  lesson: Lesson | null;
  currentIndex: number;
  selectedAnswer: unknown | null;
  answers: Record<number, unknown>;
  correctCount: number;
  hearts: number;
  maxHearts: number;
  isFeedbackVisible: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  feedbackExplanation?: string;
  isCompleted: boolean;
  isOutOfHearts: boolean;

  // Actions
  startLesson: (lesson: Lesson, initialHearts?: number) => void;
  setSelectedAnswer: (answer: unknown) => void;
  submitAnswer: (isCorrect: boolean, explanation?: string) => void;
  nextExercise: () => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonStoreState>((set, get) => ({
  lesson: null,
  currentIndex: 0,
  selectedAnswer: null,
  answers: {},
  correctCount: 0,
  hearts: 5,
  maxHearts: 5,
  isFeedbackVisible: false,
  feedbackType: null,
  feedbackExplanation: undefined,
  isCompleted: false,
  isOutOfHearts: false,

  startLesson: (lesson, initialHearts = 5) => {
    set({
      lesson,
      currentIndex: 0,
      selectedAnswer: null,
      answers: {},
      correctCount: 0,
      hearts: initialHearts,
      maxHearts: 5,
      isFeedbackVisible: false,
      feedbackType: null,
      feedbackExplanation: undefined,
      isCompleted: false,
      isOutOfHearts: false,
    });
  },

  setSelectedAnswer: (answer) => {
    set({ selectedAnswer: answer });
  },

  submitAnswer: (isCorrect, explanation) => {
    const { currentIndex, answers, selectedAnswer, correctCount, hearts } = get();
    const newAnswers = { ...answers, [currentIndex]: selectedAnswer };

    if (isCorrect) {
      set({
        answers: newAnswers,
        correctCount: correctCount + 1,
        isFeedbackVisible: true,
        feedbackType: 'correct',
        feedbackExplanation: explanation,
      });
    } else {
      const newHearts = Math.max(0, hearts - 1);
      set({
        answers: newAnswers,
        hearts: newHearts,
        isFeedbackVisible: true,
        feedbackType: 'incorrect',
        feedbackExplanation: explanation || 'That is not quite right.',
        isOutOfHearts: newHearts === 0,
      });
    }
  },

  nextExercise: () => {
    const { lesson, currentIndex, hearts } = get();
    if (!lesson) return;

    if (hearts <= 0) {
      set({ isOutOfHearts: true, isFeedbackVisible: false });
      return;
    }

    const nextIdx = currentIndex + 1;
    if (nextIdx >= lesson.exercises.length) {
      set({ isCompleted: true, isFeedbackVisible: false });
    } else {
      set({
        currentIndex: nextIdx,
        selectedAnswer: null,
        isFeedbackVisible: false,
        feedbackType: null,
        feedbackExplanation: undefined,
      });
    }
  },

  resetLesson: () => {
    const { lesson, maxHearts } = get();
    if (lesson) {
      get().startLesson(lesson, maxHearts);
    }
  },
}));
