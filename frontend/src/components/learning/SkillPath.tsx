'use client';

import React, { useState } from 'react';
import { CourseData, SkillNodeData } from '@/types/learning';
import { UnitSection } from './UnitSection';
import { LessonPopover } from './LessonPopover';
import { AnimatePresence } from 'framer-motion';

interface Props {
  course: CourseData;
}

export const SkillPath: React.FC<Props> = ({ course }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNodeData | null>(null);

  return (
    <div className="relative py-6 px-4">
      {course.units.map((unit) => (
        <UnitSection
          key={unit.id}
          unit={unit}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
        />
      ))}

      {/* Popover overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <LessonPopover
              skill={selectedSkill}
              onClose={() => setSelectedSkill(null)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
