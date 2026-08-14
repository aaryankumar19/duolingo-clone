import { CourseData } from '@/types/learning';

export const mockCourseData: CourseData = {
  id: 'spanish',
  title: 'Spanish',
  flag: '🇪🇸',
  units: [
    {
      id: 'unit-1',
      number: 1,
      title: 'Order food, describe people',
      description: 'Form basic sentences, introduce yourself, and order tapas!',
      backgroundColor: 'bg-[#58CC02]',
      skills: [
        {
          id: 'skill-basics-1',
          title: 'Basics 1',
          icon: 'BookOpen',
          status: 'completed',
          progress: 5,
          totalLessons: 5,
          crowns: 5,
          totalCrowns: 5,
          description: 'Basic greetings, common phrases, and essential pronouns.',
        },
        {
          id: 'skill-phrases',
          title: 'Phrases',
          icon: 'MessageCircle',
          status: 'active',
          progress: 3,
          totalLessons: 5,
          crowns: 3,
          totalCrowns: 5,
          description: 'Polite words, thank you, please, and basic questions.',
        },
        {
          id: 'skill-food',
          title: 'Food & Tapas',
          icon: 'Utensils',
          status: 'locked',
          progress: 0,
          totalLessons: 5,
          crowns: 0,
          totalCrowns: 5,
          description: 'Ordering bread, coffee, wine, and delicious dishes.',
        },
        {
          id: 'skill-animals',
          title: 'Animals',
          icon: 'Dog',
          status: 'locked',
          progress: 0,
          totalLessons: 5,
          crowns: 0,
          totalCrowns: 5,
          description: 'Cats, dogs, birds, and farm animals.',
        },
      ],
    },
    {
      id: 'unit-2',
      number: 2,
      title: 'Get around town, travel',
      description: 'Ask for directions, buy train tickets, and explore Madrid.',
      backgroundColor: 'bg-[#1CB0F6]',
      skills: [
        {
          id: 'skill-travel',
          title: 'Travel',
          icon: 'Compass',
          status: 'locked',
          progress: 0,
          totalLessons: 5,
          crowns: 0,
          totalCrowns: 5,
          description: 'Airports, hotels, taxis, and passport control.',
        },
        {
          id: 'skill-family',
          title: 'Family',
          icon: 'Users',
          status: 'locked',
          progress: 0,
          totalLessons: 5,
          crowns: 0,
          totalCrowns: 5,
          description: 'Parents, siblings, and describing family members.',
        },
      ],
    },
  ],
};

export const learningApi = {
  getCourseData: async (_courseId = 'spanish'): Promise<CourseData> => {
    // In actual API, will fetch from backend or fallback to mock
    return mockCourseData;
  },
};
