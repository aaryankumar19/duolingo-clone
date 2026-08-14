'use client';

import React from 'react';
import { Book } from 'lucide-react';
import { UnitData, SkillNodeData } from '@/types/learning';
import { SkillNode } from './SkillNode';

interface Props {
  unit: UnitData;
  onSelectSkill: (skill: SkillNodeData, event: React.MouseEvent) => void;
}

export const UnitSection: React.FC<Props> = ({ unit, onSelectSkill }) => {
  return (
    <div className="w-full max-w-lg mx-auto mb-10">
      {/* Unit Header Card */}
      <div className={`${unit.backgroundColor} text-white p-5 rounded-3xl shadow-lg mb-8 border-b-8 border-black/10`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-extrabold tracking-widest uppercase opacity-90">
            Unit {unit.number}
          </span>
          <Book className="w-5 h-5 opacity-90" />
        </div>
        <h2 className="text-xl font-extrabold mb-1">{unit.title}</h2>
        <p className="text-xs font-semibold opacity-90 leading-relaxed">{unit.description}</p>
      </div>

      {/* Winding Skill Nodes */}
      <div className="flex flex-col items-center">
        {unit.skills.map((skill, idx) => (
          <SkillNode
            key={skill.id}
            id={skill.id}
            title={skill.title}
            iconName={skill.icon}
            status={skill.status}
            progress={skill.progress}
            totalLessons={skill.totalLessons}
            crowns={skill.crowns}
            index={idx}
            onClick={() => onSelectSkill(skill, {} as React.MouseEvent)}
          />
        ))}
      </div>
    </div>
  );
};
