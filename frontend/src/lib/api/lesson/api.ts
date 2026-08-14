import { Lesson } from '@/types/lesson';

export const mockLesson: Lesson = {
  id: 'lesson-1',
  title: 'Phrases & Basics',
  unitId: 'unit-1',
  totalXP: 15,
  exercises: [
    {
      id: 'ex-1',
      type: 'multiple_choice',
      question: 'Which one of these is "the boy"?',
      options: [
        { id: 'opt-1', text: 'El niño' },
        { id: 'opt-2', text: 'La niña' },
        { id: 'opt-3', text: 'El hombre' },
        { id: 'opt-4', text: 'La mujer' },
      ],
      correctOptionId: 'opt-1',
    },
    {
      id: 'ex-2',
      type: 'word_bank',
      question: 'Translate this sentence: "The girl drinks water"',
      words: ['La', 'niña', 'bebe', 'agua', 'el', 'niño', 'come', 'pan'],
      correctSentence: ['La', 'niña', 'bebe', 'agua'],
    },
    {
      id: 'ex-3',
      type: 'match_pairs',
      question: 'Tap the matching pairs',
      pairs: [
        { left: 'The boy', right: 'El niño' },
        { left: 'Water', right: 'Agua' },
        { left: 'Bread', right: 'Pan' },
        { left: 'The woman', right: 'La mujer' },
      ],
    },
    {
      id: 'ex-4',
      type: 'fill_blank',
      question: 'Complete the sentence:',
      sentenceWithBlank: 'Yo ___ un hombre.',
      options: ['soy', 'eres', 'es', 'somos'],
      correctAnswer: 'soy',
    },
    {
      id: 'ex-5',
      type: 'type_answer',
      question: 'Write "Good morning" in Spanish',
      acceptableAnswers: ['Buenos días', 'buenos dias', 'Buenos dias', 'buenos días'],
    },
  ],
};

export const lessonApi = {
  getLesson: async (_lessonId: string): Promise<Lesson> => {
    return mockLesson;
  },
  submitLessonCompletion: async (_lessonId: string, _score: { xp: number; accuracy: number }) => {
    return { success: true, xpEarned: 15, currentStreak: 5 };
  },
};
