export type SkillStatus = 'locked' | 'active' | 'completed';

export interface SkillNodeData {
  id: string;
  title: string;
  icon: string;
  status: SkillStatus;
  progress: number;
  totalLessons: number;
  crowns: number;
  totalCrowns: number;
  description: string;
}

export interface UnitData {
  id: string;
  number: number;
  title: string;
  description: string;
  backgroundColor: string;
  skills: SkillNodeData[];
}

export interface CourseData {
  id: string;
  title: string;
  flag: string;
  units: UnitData[];
}
