import { apiClient } from '../client';
import {
  BackendNextLessonResponse,
  ExerciseSubmitResponse,
  LessonCompleteResponse,
  BackendExercise,
  Exercise,
  Lesson,
} from '@/types/lesson';

// ─── Type normaliser: backend (UPPERCASE) → frontend (lowercase) ──────────────

function normaliseExercise(raw: BackendExercise): Exercise {
  const type = (raw.exercise_type || '').toUpperCase();
  const question = raw.prompt || raw.question || 'Answer the question:';
  const audioUrl = raw.audio_url || undefined;
  const content = raw.content_json || {};

  if (type === 'MULTIPLE_CHOICE') {
    const rawOptions = content.options || raw.options || [];
    const options = rawOptions.map((o: any, idx: number) => {
      if (typeof o === 'string') {
        return { id: o, text: o };
      }
      return {
        id: o.id || o.text || String(idx),
        text: o.text || o.title || o.name || String(o),
        imageUrl: o.image_url || o.imageUrl || undefined,
      };
    });

    const correctOptionId =
      raw.correct_option_id ||
      (typeof raw.correct_answer === 'string'
        ? raw.correct_answer
        : raw.correct_answer?.answer) ||
      '';

    return {
      id: raw.id,
      type: 'multiple_choice',
      question,
      promptAudioUrl: audioUrl,
      options,
      correctOptionId,
    };
  }

  if (type === 'TRANSLATE') {
    const words = content.word_bank || raw.word_bank || [];
    const correctSentence =
      content.correct_sentence ||
      raw.correct_sentence ||
      (typeof raw.correct_answer === 'string'
        ? raw.correct_answer.split(' ')
        : raw.correct_answer?.answer
        ? String(raw.correct_answer.answer).split(' ')
        : []);

    return {
      id: raw.id,
      type: 'word_bank',
      question,
      promptAudioUrl: audioUrl,
      words: Array.isArray(words) ? words : [],
      correctSentence: Array.isArray(correctSentence) ? correctSentence : [],
    };
  }

  if (type === 'MATCH_PAIRS') {
    const rawPairs = content.pairs || raw.pairs || [];
    let pairs: { left: string; right: string }[] = [];

    if (Array.isArray(rawPairs)) {
      pairs = rawPairs.map((p: any) => {
        if (p.left !== undefined && p.right !== undefined) {
          return { left: String(p.left), right: String(p.right) };
        }
        if (p.spanish !== undefined && p.english !== undefined) {
          return { left: String(p.spanish), right: String(p.english) };
        }
        const entries = Object.entries(p);
        if (entries.length >= 2) {
          return { left: String(entries[0][1]), right: String(entries[1][1]) };
        }
        return { left: String(p), right: String(p) };
      });
    } else if (rawPairs && typeof rawPairs === 'object') {
      pairs = Object.entries(rawPairs).map(([k, v]) => ({
        left: String(k),
        right: String(v),
      }));
    }

    return {
      id: raw.id,
      type: 'match_pairs',
      question,
      promptAudioUrl: audioUrl,
      pairs,
    };
  }

  if (type === 'FILL_IN_BLANK') {
    const sentenceWithBlank =
      content.sentence_with_blank ||
      raw.sentence_with_blank ||
      question ||
      '';
    const rawOptions = content.options || raw.options || [];
    const options = rawOptions.map((o: any) =>
      typeof o === 'string' ? o : o.text || o.name || String(o)
    );
    const correctAnswer =
      content.correct_answer ||
      (typeof raw.correct_answer === 'string'
        ? raw.correct_answer
        : raw.correct_answer?.answer) ||
      '';

    return {
      id: raw.id,
      type: 'fill_blank',
      question,
      promptAudioUrl: audioUrl,
      sentenceWithBlank,
      options,
      correctAnswer,
    };
  }

  if (type === 'TYPE_ANSWER') {
    const acceptable =
      content.acceptable_answers ||
      raw.acceptable_answers ||
      (raw.correct_answer?.answer ? [String(raw.correct_answer.answer)] : []);

    return {
      id: raw.id,
      type: 'type_answer',
      question,
      promptAudioUrl: audioUrl,
      acceptableAnswers: Array.isArray(acceptable) ? acceptable : [],
    };
  }

  // Fallback
  return {
    id: raw.id,
    type: 'type_answer',
    question,
    promptAudioUrl: audioUrl,
    acceptableAnswers: [],
  };
}

// ─── Lesson API ───────────────────────────────────────────────────────────────

export const lessonApi = {
  /**
   * GET /api/skills/{skill_id}/next-lesson/
   * Returns the next uncompleted lesson for a unit/skill.
   */
  getNextLesson: async (skillId: string): Promise<Lesson> => {
    const res = await apiClient<BackendNextLessonResponse>(
      `/skills/${skillId}/next-lesson/`
    );
    const raw = res.data.lesson;
    return {
      id: raw.id,
      title: raw.title,
      unitId: raw.unit?.id || raw.unit_id || '',
      totalXP: raw.xp_reward ?? raw.total_xp ?? 10,
      exercises: (raw.exercises || []).map(normaliseExercise),
    };
  },

  /**
   * POST /api/lessons/exercises/{exercise_id}/submit/
   * Evaluates a user's answer; deducts a heart on backend if wrong.
   */
  submitExercise: async (
    exerciseId: string,
    userAnswer: any
  ): Promise<ExerciseSubmitResponse['data']> => {
    const res = await apiClient<ExerciseSubmitResponse>(
      `/lessons/exercises/${exerciseId}/submit/`,
      {
        method: 'POST',
        body: JSON.stringify({ user_answer: userAnswer }),
      }
    );
    return res.data;
  },

  /**
   * POST /api/lessons/{lesson_id}/complete/
   * Awards XP, updates streak, unlocks next unit, awards achievements.
   */
  completeLesson: async (
    lessonId: string
  ): Promise<LessonCompleteResponse['data']> => {
    const res = await apiClient<LessonCompleteResponse>(
      `/lessons/${lessonId}/complete/`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
    return res.data;
  },
};
