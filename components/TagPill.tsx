
import React from 'react';
import { getTagColor } from '../utils/color';

interface TagPillProps {
  tag: string;
  onClick?: (tag: string) => void;
  isActive?: boolean;
}

const TagPill: React.FC<TagPillProps> = ({ tag, onClick, isActive }) => {
  const color = getTagColor(tag);
  const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full transition-colors duration-200";
  
  const activeClasses = `${color.activeBg} text-white`;
  const inactiveClasses = `${color.bg} ${color.text} ${onClick ? color.hover : ''}`;
  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <span
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${clickableClasses}`}
      onClick={() => onClick?.(tag)}
    >
      #{tag}
    </span>
  );
};

export default TagPill;
